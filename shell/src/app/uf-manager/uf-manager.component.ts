import { Injectable } from '@angular/core';
import { uEventsIds, uEvent, UParts } from '@uf-shared-models/index';
import { EventProxyLibService } from '@uf-shared-libs/event-proxy-lib';
import { SubscibeToEvent, RequestToLoadScripts, LoadedResource, LanguageChange, InitMenuEvent } from '@uf-shared-events/index';
import { ResourceLoaderService } from '../services/resource-loader.service';
import { LanguageService } from '../services/lang.service';
import { PrestartService } from '../services/prestart.service';
import { HttpResponse } from '@angular/common/http';

/**
 * Micro Frontend Manager is responsible for presubscribing all micro frontends
 * to their events which are loaded from JS configuration files.
 */
@Injectable({
  providedIn: 'root'
})
export class UFManagerComponent {
  /**
   * Title  of ufmanager component
   */
  private title = 'uf-manager';

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
   * Start listening to new events and subs to other micro frontend bootstraping
   * functions
   * @param eProxyService library service used for communication with backend
   * @param msgService helper for communication between Script-Loader
   */
  constructor(
    private eProxyService: EventProxyLibService,
    private resourceLoader: ResourceLoaderService,
    private languageService: LanguageService,
    private prestartService: PrestartService
  ) { }

  /**
   * Inits ufmanager component with async functions
   */
  public async InitAsync() {
    return new Promise(async (resolve, reject) => {
      await this.preloadScripts().then(
        () => {},
        () => {
          throw new Error('Failed to load scripts');
        }
      );

      await this.subscribeToEventsAsync();

      await this.subscribeMicroFrontends();

      await this.preloadMenuMicroFrontend();

      resolve();
    });
  }

  /**
   * Starts qna with backend
   */
  public StartQNA() {

    this.eProxyService.StartQNA(this.sourceId).subscribe
    (
      (value: HttpResponse<any>) => {
        if (!value) { throw new Error('Can\'t connect to backend'); }

        if (!value.body) { return; }

        if (!value.body.hasOwnProperty('EventId')) {
          throw new Error('No EventId in message');
        }

        if (value.body['EventId'] === uEventsIds.GetNewEvents) {
          this.parseNewEventAsync(value.body.Events);
        }
      },
      (error) => { console.log(this.title, error); },
      () => {}
    );
  }

  /**
   * Preloads scripts for each micro frontend.
   * @returns Promise
   */
  private preloadScripts() {
    const promises = [];
    const url: string = this.eProxyService.env.Url;

    if (!url) {
      throw new Error('Url is not defined in environment (env.js)');
    }

    const urlList = [
      url + ':3002/en/scripts/conf.js', // Menu
      // url + ':3004/scripts/conf.js', // Personnel
      // url + ':3005/scripts/conf.js' // Occupation
    ];
    promises.push(this.prestartService.InitScripts(urlList));
    promises.push(this.prestartService.InitLanguage());
    return Promise.all(promises);
  }

  /**
   * Sends event to backend to init Menu
   * @returns Promise
   */
  private preloadMenuMicroFrontend() {
    const e = new InitMenuEvent(this.sourceId);
    e.SourceName = this.sourceName;

    return this.eProxyService.DispatchEvent(e).toPromise();
  }

  /**
   * Subscribes to events which this micro frontend is responsible for
   * @returns Promise
   */
  private subscribeToEventsAsync() {
    const e = new SubscibeToEvent(this.sourceId, [
      [uEventsIds.LoadedResource, 0, 0],
      [uEventsIds.RequestToLoadScript, 0, 0],
      [uEventsIds.LanguageChange, 0, 0],
      [uEventsIds.InitMenu, 0, 0]
    ]);
    e.SourceName = this.sourceName;
    return this.eProxyService.DispatchEvent(e).toPromise();
  }

  /**
   * Parses new events, every new event goes through this function which will determine
   * its further path, also if resource responsible for event is not yet loaded, sends
   * event with request to load resources for that micro frontend.
   * @param event Event array
   */
  // tslint:disable-next-line: cognitive-complexity
  private async parseNewEventAsync(eventList: uEvent[]) {
    for (const element of eventList) {

      console.log(`${this.sourceId} Parsing event:`, element);

      const ufConfigs = window['__env']['uf'];

      // check if event is LoadedResource
      if (element.EventId === uEventsIds.LoadedResource) {
        const el: LoadedResource = element as LoadedResource;

        for (const config in ufConfigs) {
          if (ufConfigs.hasOwnProperty(config) && ufConfigs[config].events.includes(el.ResourceEventId)) {
            this.resources[+config] = true;
            await this.eProxyService.ConfirmEvents(this.sourceId, [element.AggregateId]).toPromise();
          }
        }
      } else if (element.EventId === uEventsIds.RequestToLoadScript) {
        const event: RequestToLoadScripts  = element as RequestToLoadScripts;
        this.loadResourcesEvent(event);
        await this.eProxyService.ConfirmEvents(this.sourceId, [element.AggregateId]).toPromise();
      } else if (element.EventId === uEventsIds.LanguageChange) {
        const event: LanguageChange  = element as LanguageChange;
        this.changeLanguageEvent(event);
        await this.eProxyService.ConfirmEvents(this.sourceId, [element.AggregateId]).toPromise();
      } else {
        for (const config in ufConfigs) {
          if (ufConfigs.hasOwnProperty(config) && ufConfigs[+config].events.includes(element.EventId)) {
            // check if loaded
            if (this.resources[+config]) {
              break;
            }

            // else load resources
            await this.resourceLoader.LoadResources(ufConfigs[+config].resources);
            await this.eProxyService.ConfirmEvents(this.sourceId, [element.AggregateId]).toPromise();
          }
        }
      }
    }
  }

  /**
   * Events change language
   * @param event Event model for language change event
   */
  private changeLanguageEvent(event: LanguageChange) {
    this.languageService.setLang(event.NewLanguage).toPromise().then(
      () => { window.location.reload(); }
    );
  }

  /**
   * Attempts to load a resource
   * @param event resource load event model
   */
  private loadResourcesEvent(event: RequestToLoadScripts) {
    this.resourceLoader.LoadResources(event.ResourceSchemes);
  }

  /**
   * Subscribe micro frontends to their events and subs itself to them so it
   * can load them if they're not yet laoded
   * @returns Promise
   */
  private subscribeMicroFrontends() {

    const promises: Promise<any>[] = [];

    const dic = window['__env']['uf'];
    for (const key in dic) {
      // Traverse through all uFrontends
      if (dic.hasOwnProperty(key)) {
        const subList = [];
        dic[+key].events.forEach(eventId => {
          subList.push([eventId, 0, 0]);
        });

        // Subscribe designated micro frontend
        let event = new SubscibeToEvent(key, subList);
        event.SourceName = UParts.GetSourceNameFromSourceID(event.SourceId);
        promises.push(this.eProxyService.DispatchEvent(event).toPromise());

        // Subscribe to them for loading
        event = new SubscibeToEvent(this.sourceId, subList);
        event.SourceName = this.sourceName;
        promises.push(this.eProxyService.DispatchEvent(event).toPromise());
      }
    }
    return Promise.all(promises);
  }
}
