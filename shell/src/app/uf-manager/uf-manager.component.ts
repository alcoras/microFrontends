import { Injectable } from '@angular/core';
import { uEventsIds, uEvent, UParts, EventResponse, APIGatewayResponse } from '@uf-shared-models/index';
import { EventProxyLibService, EnvironmentService } from '@uf-shared-libs/event-proxy-lib';
import {
  SubscibeToEvent,
  RequestToLoadScripts,
  LoadedResource,
  LanguageChange,
  InitializeMenuEvent } from '@uf-shared-events/index';
import { ResourceLoaderService } from '../services/resource-loader.service';
import { LanguageService } from '../services/lang.service';
import { PrestartService } from '../services/prestart.service';
import { HttpResponse } from '@angular/common/http';
import { AuthenticationService } from '../services/AuthenticationService';
import { LoginRequest } from '../models/LoginRequest';

/**
 * Micro Frontend Manager is responsible for presubscribing all micro frontends
 * to their events which are loaded from JS configuration files.
 */
@Injectable({
  providedIn: 'root'
})
export class UFManagerComponent {
  /**
   * Source id of ufmanager component
   */
  private sourceId: string = UParts.UFManager.SourceId;

  /**
   * Source name of ufmanager component
   */
  private sourceName: string = UParts.UFManager.SourceName;

  /**
   * Resources dictionary to account which micro frontend is loaded
   */
  private resources: { [sourceId: number]: boolean } = {};

  /**
   * Creates an instance of UFManagerComponent.
   * @param authService auth service
   * @param eventProxyService - library service used for communication with backend
   * @param environmentService - some DOM globals
   * @param resourceLoader - helper for communication between Script-Loader
   * @param languageService - langauge service for demo
   * @param prestartService - prestart service for demo
   */
  public constructor(
    private authService: AuthenticationService,
    private eventProxyService: EventProxyLibService,
    private environmentService: EnvironmentService,
    private resourceLoader: ResourceLoaderService,
    private languageService: LanguageService,
    private prestartService: PrestartService
  ) { }

  /**
   * Inits ufmanager component with async functions
   */
  public async InitAsync(): Promise<void> {

    await this.authService.LoginAsync().then(
      () => { console.log('Logged In.')},
      (error: LoginRequest) => {
        alert(error.Error);
        throw new Error(error.FullError);
      }
    );

    await this.preloadScripts().then(
      () => { console.log(`${this.sourceName} preloadedScripts done. `)},
      () => { throw new Error('Failed to load scripts'); } );

    await this.subscribeToEventsAsync().then(
      () => { console.log(`${this.sourceName} subscribeToEventsAsync done.`)}
    );

    await this.subscribeMicroFrontends().then(
      () => { console.log(`${this.sourceName} subscribeMicroFrontends done.`)}
    );

    await this.preloadMenuMicroFrontend().then(
      () => { console.log(`${this.sourceName} preloadMenuMicroFrontend done.`)}
    )
  }

  /**
   * Starts qna with backend
   */
  public StartQNA(): void {

    this.eventProxyService.StartQNA(this.sourceId).subscribe(
      (response: HttpResponse<EventResponse>) => {
        this.newHttpResponseAsync(response);
      },
      (error) => { console.log(this.sourceName, error); },
    );
  }


  private async newHttpResponseAsync(response: HttpResponse<EventResponse>): Promise<void> {
    if (!response) { throw new Error('Can\'t connect to backend'); }

    if (!response.body) { return; }

    if (!Object.prototype.hasOwnProperty.call(response.body, 'EventId')) {
      throw new Error('No EventId in message');
    }

    if (response.body['EventId'] === uEventsIds.GetNewEvents) {
      this.parseNewEventAsync(response.body.Events);
    }
  }

  /**
   * Preloads scripts for each micro frontend. muy importante
   * @returns Promise
   */
  private preloadScripts(): Promise<void[]> {
    const promises = [];
    const url: string = this.environmentService.Url;

    if (!url) {
      throw new Error('Url is not defined in environment (env.js)');
    }

    const urlList = this.environmentService.ConfigUrlList;

    if (urlList.length == 0) {
      console.warn('Config list is not defined in environment (env.js)');
    }

    promises.push(this.prestartService.InitScripts(urlList));
    promises.push(this.prestartService.InitLanguage());
    return Promise.all(promises);
  }

  /**
   * Sends event to backend to init Menu
   * @returns Promise
   */
  private preloadMenuMicroFrontend(): Promise<HttpResponse<APIGatewayResponse>> {
    const e = new InitializeMenuEvent(this.sourceId);
    e.SourceName = this.sourceName;

    return this.eventProxyService.DispatchEvent(e).toPromise();
  }

  /**
   * Subscribes to events which this micro frontend is responsible for
   * @returns Promise
   */
  private subscribeToEventsAsync(): Promise<HttpResponse<APIGatewayResponse>> {
    const e = new SubscibeToEvent(this.sourceId, [
      [uEventsIds.LoadedResource, 0, 0],
      [uEventsIds.RequestToLoadScript, 0, 0],
      [uEventsIds.LanguageChange, 0, 0],
      [uEventsIds.InitMenu, 0, 0],
    ], true);
    e.SourceName = this.sourceName;
    return this.eventProxyService.DispatchEvent(e).toPromise();
  }

  /**
   * Parses new events, every new event goes through this function which will determine
   * its further path, also if resource responsible for event is not yet loaded, sends
   * event with request to load resources for that micro frontend.
   * @param eventList - Event array
   */
  private async parseNewEventAsync(eventList: uEvent[]): Promise<void> {
    for (const element of eventList) {

      console.log(`${this.sourceId} Parsing event:`, element);

      const ufConfigs = window['__env']['uf'];

      // check if event is LoadedResource
      if (element.EventId === uEventsIds.LoadedResource) {
        const el: LoadedResource = element as LoadedResource;

        for (const config in ufConfigs) {
          if (Object.prototype.hasOwnProperty.call(ufConfigs, config)
            && ufConfigs[config].events.includes(el.ResourceEventId)) {
            this.resources[+config] = true;
            await this.eventProxyService.ConfirmEvents(this.sourceId, [element.AggregateId]).toPromise();
          }
        }
      }
      else if (element.EventId === uEventsIds.RequestToLoadScript) {
        const event: RequestToLoadScripts  = element as RequestToLoadScripts;
        this.loadResourcesEvent(event);
        await this.eventProxyService.ConfirmEvents(this.sourceId, [element.AggregateId]).toPromise();
      }
      else if (element.EventId === uEventsIds.LanguageChange) {
        const event: LanguageChange  = element as LanguageChange;
        this.changeLanguageEvent(event);
        await this.eventProxyService.ConfirmEvents(this.sourceId, [element.AggregateId]).toPromise();
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
            await this.eventProxyService.ConfirmEvents(this.sourceId, [element.AggregateId]).toPromise();
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
    this.languageService.SetLang(event.NewLanguage).toPromise().then(
      () => { window.location.reload(); }
    );
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
  private subscribeMicroFrontends(): Promise<HttpResponse<APIGatewayResponse>[]> {

    const promises: Promise<HttpResponse<APIGatewayResponse>>[] = [];

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
        event.SourceName = UParts.GetSourceNameFromSourceID(event.SourceId);
        promises.push(this.eventProxyService.DispatchEvent(event).toPromise());

        // Subscribe to them for loading
        event = new SubscibeToEvent(this.sourceId, subList);
        event.SourceName = this.sourceName;
        promises.push(this.eventProxyService.DispatchEvent(event).toPromise());
      }
    }
    return Promise.all(promises);
  }
}
