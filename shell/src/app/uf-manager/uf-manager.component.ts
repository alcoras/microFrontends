import { Component, OnInit, Injectable } from '@angular/core';
import { uParts, uEventsIds, uEvent } from '@uf-shared-models/event';
import { EventProxyLibService } from '@uf-shared-libs/event-proxy-lib';
import { SubscibeToEvent, RequestToLoadScripts, LoadedResource, LanguageChange } from '@uf-shared-events/index';
import { ResourceLoaderService } from '../services/resource-loader.service';
import { LanguageService } from '../services/lang.service';
import { PrestartService } from '../services/prestart.service';
import { HttpResponse } from '@angular/common/http';

class InitMenuEvent extends uEvent {
  constructor(sourceId: string) {
    super();
    this.EventId = uEventsIds.InitMenu;
    this.SourceId = sourceId;
  }
}

function delay(ms) {
  return new Promise( resolve => setTimeout(resolve, ms) );
}

/**
 * Micro Frontend Manager is responsible for presubscribing all micro frontends
 * to their event which are loaded from JS configuration files statically hold.
 */
@Injectable({
  providedIn: 'root'
})
export class UFManagerComponent {
  private title = 'uf-manager';
  private sourceId: string = uParts.UFManager;

  private resources: { [srcId: number]: boolean } = {};

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
  public Init() {
    this.eProxyService.StartQNA(this.sourceId)
    .subscribe
    (
      (value: HttpResponse<any>) => {
        if (!value) { throw new Error('Can\'t connect to backend'); }

        if (!value.body) { return; }

        if (!value.body.hasOwnProperty('EventId')) {
          throw new Error('No EventId in message');
        }

        if (value.body['EventId'] === uEventsIds.GetNewEvents) {
          this.parseNewEvent(value.body.Events);
        }
      },
      (error) => { console.log(this.title, error); },
      () => {}
    );

    return new Promise(async (resolve) => {
      console.time('subscribeToEventsAsync');
      await this.subscribeToEventsAsync();
      console.timeEnd('subscribeToEventsAsync');

      console.time('preloadScripts');
      await this.preloadScripts();
      console.timeEnd('preloadScripts');

      console.time('subscribeMicroFrontends');
      await this.subscribeMicroFrontends();
      console.timeEnd('subscribeMicroFrontends');

      console.time('preloadMenuMicroFrontend');
      await this.preloadMenuMicroFrontend();
      console.timeEnd('preloadMenuMicroFrontend');

      resolve();
    });
  }

  /**
   * Preloads scripts for each micro frontend.
   * @returns Promise
   */
  private preloadScripts() {
    const promises = [];

    this.eProxyService.env.loadConfig();
    const url: string = this.eProxyService.env.url;
    const urlList = [
      url + ':3002/en/scripts/conf.js', // Menu
      url + ':3004/scripts/conf.js', // Personnel
      url + ':3005/scripts/conf.js' // Occupation
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

    return this.eProxyService.dispatchEvent(e).toPromise();
  }

  /**
   * Subscribes to events which this micro frontend is responsible for
   * @returns Promise
   */
  private subscribeToEventsAsync() {
    const e = new SubscibeToEvent([
      [uEventsIds.LoadedResource, 0, 0],
      [uEventsIds.RequestToLoadScript, 0, 0],
      [uEventsIds.LanguageChange, 0, 0],
      [uEventsIds.InitMenu, 0, 0]
    ]);

    e.SourceId = this.sourceId.toString();

    return this.eProxyService.dispatchEvent(e).toPromise();
  }

  /**
   * Parses new events, every new event goes through this function which will determine
   * its further path, also if resource responsible for event is not yet loaded, sends
   * event with request to load resources for that micro frontend.
   * @param event Event array
   */
  private parseNewEvent(event: any) {
    event.forEach( async (element) => {
      this.eProxyService.confirmEvents(this.sourceId, [element.AggregateId]).toPromise();
      this.eProxyService.env.loadConfig();
      const ufConfigs = this.eProxyService.env.uf;

      // check if event is LoadedResource
      if (element.EventId === uEventsIds.LoadedResource) {
        const el: LoadedResource = element;

        // tslint:disable-next-line: forin
        for (const config in ufConfigs) {
          if (ufConfigs.hasOwnProperty(config)) {
            if (ufConfigs[config].events.includes(el.ResourceEventId)) {
              this.resources[+config] = true;
              return; // gets back to other event because forEach creates function for each loop
            }
          }
        }
      }

      if (element.EventId === uEventsIds.RequestToLoadScript) {
        this.loadResourcesEvent(element);
        return;
      }

      if (element.EventId === uEventsIds.LanguageChange) {
        this.changeLanguageEvent(element);
        return;
      }

      for (const config in ufConfigs) {
        if (ufConfigs.hasOwnProperty(config)) {
          if (ufConfigs[+config].events.includes(element.EventId)) {
            // check if loaded
            if (this.resources[+config]) {
              break;
            }

            // else load resources
            await this.resourceLoader.LoadResources(ufConfigs[+config].resources);

            // TODO: remove after some time
            // const e = new RequestToLoadScripts(element.EventId, ufConfigs[config].resources);

            // e.SourceId = config;
            // e.SourceEventUniqueId = this.traceId++;

            // this.eProxyService.dispatchEvent(e).subscribe(
            //   (value: any) => { console.log(value); },
            //   (error: any) => { console.log('error', error); },
            //   () => {},
            // );
          }
        }
      }
    });
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
  private async subscribeMicroFrontends() {

    const promises: Promise<any>[] = [];

    this.eProxyService.env.loadConfig();
    const dic = this.eProxyService.env.uf;
    for (const key in dic) {
      // Traverse through all uFrontends
      if (dic.hasOwnProperty(key)) {

        const subList = [];
        dic[+key].events.forEach(eventId => {
          subList.push([eventId, 0, 0]);
        });

        // Subscribe designated micro frontend
        let event = new SubscibeToEvent(subList);

        event.SourceId = key;

        promises.push(this.eProxyService.dispatchEvent(event).toPromise());

        // Subscribe to them for loading
        event = new SubscibeToEvent(subList);

        event.SourceId = this.sourceId.toString();
        promises.push(await this.eProxyService.dispatchEvent(event).toPromise());
      }
    }
    return Promise.all(promises);
  }
}
