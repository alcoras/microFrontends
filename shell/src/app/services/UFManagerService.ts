import { Injectable } from '@angular/core';
import {
  EventProxyLibService,
  EnvironmentService,
  ValidationStatus,
  SubscibeToEvent,
  CoreEvent,
  RequestToLoadScripts,
  LoadedResource,
  LanguageChange,
  InitializeMenuEvent,
  MicroFrontendParts,
  MicroFrontendInfo,
  EnvironmentTypes,
  EventIds,
  LoginRequest } from 'event-proxy-lib-src';
import { ResourceLoaderService } from './ResourceLoaderService';
import { PrestartService } from './PrestartService';
import { AuthenticationService } from '../services/AuthenticationService';
import { environment } from 'src/environments/environment';

/**
 * Micro Frontend Manager is responsible for presubscribing all micro frontends
 * to their events which are loaded from JS configuration files.
 */
@Injectable({
  providedIn: 'root'
})
export class UFManagerService {

  public SourceInfo: MicroFrontendInfo = MicroFrontendParts.FrontendShell;

  /**
   * Resources dictionary to account which micro frontend is loaded
   */
  private resources: { [sourceId: number]: boolean } = {};

  /**
   * Creates an instance of UFManagerService.
   * @param authService auth service
   * @param eventProxyService - library service used for communication with backend
   * @param environmentService - some DOM globals
   * @param resourceLoader - helper for communication between Script-Loader
   * @param prestartService - prestart service for demo
   */
  public constructor(
    private authService: AuthenticationService,
    private eventProxyService: EventProxyLibService,
    private environmentService: EnvironmentService,
    private resourceLoader: ResourceLoaderService,
    private prestartService: PrestartService
  ) { }

  /**
   * Inits ufmanager component with async functions
   */
  public async InitAsync(): Promise<void> {

    // We confirm all events because otherwise upon errors from other microservices, we start to accumulate
    // unconfirmed events, because shell subscribe to them aswell
    // It's fine because no one should call shell, as it's an entry point
    await this.eventProxyService.ConfirmEventsAsync(this.SourceInfo.SourceId, [], true).toPromise().then(
      () => { console.log(`${this.SourceInfo.SourceName} events are preconfirmed`)},
      () => { throw new Error('Failed to confirm events'); }
    );

    // only in development and above (staging, prod)
    // we should not login in isolated regimes
    if (environment.EnvironmentTypes <= EnvironmentTypes.Development && environment.enableLogin) {
      await this.authService.LoginAsync().then(
        () => { console.log('Logged In.')},
        (error: LoginRequest) => {
          alert(error.Error);
          throw new Error(error.FullError);
        }
      );
    }

    await this.preloadScripts().then(
      () => { console.log(`${this.SourceInfo.SourceName} preloadedScripts done. `)},
      () => { throw new Error('Failed to load scripts'); }
    );

    await this.subscribeToEventsAsync().then(
      () => { console.log(`${this.SourceInfo.SourceName} subscribeToEventsAsync done.`)}
    );

    await this.subscribeMicroFrontends().then(
      () => { console.log(`${this.SourceInfo.SourceName} subscribeMicroFrontends done.`)}
    );

    await this.preloadMenuMicroFrontend().then(
      () => { console.log(`${this.SourceInfo.SourceName} preloadMenuMicroFrontend done.`)}
    )
  }

  /**
   * Initialize Connection to backend (API gateway)
   */
  public InitializeConnectionWithBackend(): void {

    this.eventProxyService.InitializeConnectionToBackend(this.SourceInfo.SourceId).subscribe(
      (response: ValidationStatus) => {
        if (this.eventProxyService.PerformResponseCheck(response)) {
          this.parseNewEventAsync(response.HttpResult.body.Events);
        }
      },
      (error: ValidationStatus) => {
        this.eventProxyService.EndListeningToBackend();
        throw new Error(error.Error);
      }
    );

  }

  /**
   * Preloads scripts for each micro frontend. muy importante
   * @returns Promise
   */
  private preloadScripts(): Promise<void[]> {
    const promises = [];
    const url: string = this.environmentService.Url;

    if (!url) {
      throw new Error('Url is not defined in environment');
    }

    // only in development and above (staging, prod)
    // we load other micro frontends
    let urlList = [];
    if (environment.EnvironmentTypes <= EnvironmentTypes.Development)
      urlList = this.environmentService.ConfigUrlList;

    if (urlList.length == 0) {
      console.warn('Config list is not defined in environment');
    }

    promises.push(this.prestartService.InitScripts(urlList));
    //promises.push(this.prestartService.InitLanguage());
    return Promise.all(promises);
  }

  /**
   * Sends event to backend to init Menu
   * @returns Promise
   */
  private preloadMenuMicroFrontend(): Promise<ValidationStatus> {
    const e = new InitializeMenuEvent(this.SourceInfo.SourceId);
    e.SourceName = this.SourceInfo.SourceName;

    return this.eventProxyService.DispatchEventAsync(e).toPromise();
  }

  /**
   * Subscribes to events which this micro frontend is responsible for
   * @returns Promise
   */
  private subscribeToEventsAsync(): Promise<ValidationStatus> {
    const e = new SubscibeToEvent(this.SourceInfo.SourceId, [
      [EventIds.LoadedResource, 0, 0],
      [EventIds.RequestToLoadScript, 0, 0],
      [EventIds.LanguageChange, 0, 0],
      [EventIds.InitMenu, 0, 0],
    ]);
    e.SourceName = this.SourceInfo.SourceName;
    return this.eventProxyService.DispatchEventAsync(e).toPromise();
  }

  /**
   * Parses new events, every new event goes through this function which will determine
   * its further path, also if resource responsible for event is not yet loaded, sends
   * event with request to load resources for that micro frontend.
   * @param eventList - Event array
   */
  private async parseNewEventAsync(eventList: CoreEvent[]): Promise<void> {
    for (const element of eventList) {

      console.log(`${this.SourceInfo.SourceId} Parsing event:`, element);

      const ufConfigs = window['__env']['uf'];

      // check if event is LoadedResource
      if (element.EventId === EventIds.LoadedResource) {
        const el: LoadedResource = element as LoadedResource;

        for (const config in ufConfigs) {
          if (Object.prototype.hasOwnProperty.call(ufConfigs, config)
            && ufConfigs[config].events.includes(el.ResourceEventId)) {
            this.resources[+config] = true;
            await this.eventProxyService.ConfirmEventsAsync(this.SourceInfo.SourceId, [element.AggregateId]).toPromise();
          }
        }
      }
      else if (element.EventId === EventIds.RequestToLoadScript) {
        const event: RequestToLoadScripts = element as RequestToLoadScripts;
        this.loadResourcesEvent(event);
        await this.eventProxyService.ConfirmEventsAsync(this.SourceInfo.SourceId, [element.AggregateId]).toPromise();
      }
      else if (element.EventId === EventIds.LanguageChange) {
        const event: LanguageChange = element as LanguageChange;
        this.changeLanguageEvent(event);
        await this.eventProxyService.ConfirmEventsAsync(this.SourceInfo.SourceId, [element.AggregateId]).toPromise();
      }
      else {
        for (const config in ufConfigs) {
          if (Object.prototype.hasOwnProperty.call(ufConfigs, config) &&
              ufConfigs[+config].events.includes(element.EventId)) {
            // check if loaded
            if (this.resources[+config]) {
              break;
            }

            // else load resources
            await this.resourceLoader.LoadResources(ufConfigs[+config].resources);
            await this.eventProxyService.ConfirmEventsAsync(
              this.SourceInfo.SourceId, [element.AggregateId]).toPromise();
          }
        }
      }
    }
  }

  /**
   * Events change language
   * @param event - Event model for language change event
   */
  private changeLanguageEvent(event: LanguageChange): void {
    console.error(event);
    throw new Error("Not implemented");
  }

  /**
   * Attempts to load a resource
   * @param event - resource load event model
   */
  private loadResourcesEvent(event: RequestToLoadScripts): void {
    this.resourceLoader.LoadResources(event.ResourceSchemes);
  }

  /**
   * Subscribe micro frontends to their events and subs itself to them so it
   * can load them if they're not yet laoded
   * @returns Promise
   */
  private subscribeMicroFrontends(): Promise<ValidationStatus> {

    const subscribeEventsList: SubscibeToEvent[] = [];

    const dic = window['__env']['uf'];
    for (const key in dic) {
      // Traverse through all uFrontends
      if (Object.prototype.hasOwnProperty.call(dic, key)) {
        const subList = [];
        dic[+key].events.forEach((eventId: number) => {
          subList.push([eventId, 0, 0]);
        });

        // Subscribe designated micro frontend
        let event = new SubscibeToEvent(key, subList);
        event.SourceName = MicroFrontendParts.GetSourceNameFromSourceID(event.SourceId);
        subscribeEventsList.push(event);
        // promises.push(this.eventProxyService.DispatchEventAsync(event).toPromise());

        // Subscribe to them for loading
        event = new SubscibeToEvent(this.SourceInfo.SourceId, subList);
        event.SourceName = this.SourceInfo.SourceName;
        subscribeEventsList.push(event);
        // promises.push(this.eventProxyService.DispatchEventAsync(event).toPromise());
      }
    }
    const promise = this.eventProxyService.DispatchEventAsync(subscribeEventsList).toPromise();
    return Promise.resolve(promise);
  }
}
