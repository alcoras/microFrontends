import { Component } from '@angular/core';
import { uParts, uEventsIds, uEvent } from '@uf-shared-models/event';
import { EventProxyLibService } from '@uf-shared-libs/event-proxy-lib';
import { SubscibeToEvent, RequestToLoadScripts, LoadedResource } from '@uf-shared-events/index';
import { MessageService } from '../msg.service';


/**
 * Micro Frontend Manager is responsible for presubscribing all micro frontends
 * to their event which are loaded from JS configuration files statically hold.
 */
@Component({
  selector: 'app-uf-manager',
  template: '',
  providers: [ EventProxyLibService ]
})
export class UFManagerComponent {
  title = 'uf-manager';
  desc = 'micro frontend manager';
  traceId = 1;
  sourceId: number = uParts.UFManager;

  resources: { [srcId: number]: boolean } = {};

  /**
   * Start listening to new events and subs to other micro frontend bootstraping
   * functions
   * @param eProxyService library service used for communication with backend
   * @param msgService helper for communication between Script-Loader
   */
  constructor(
    private eProxyService: EventProxyLibService,
    private msgService: MessageService
  ) {
    this.eProxyService.startQNA(this.sourceId).subscribe
    (
      (value) => { this.parseNewEvent(value); },
      (error) => { console.log(this.title, error); },
      () => {}
    );

    // check if configs are loaded by script-loader
    this.msgService.eventPreloaded.subscribe(
      () => {
        this.init();
      });
  }

  /**
   * Inits ufmanager component with async functions
   * @returns null
   */
  private async init() {
    await this.subMicroFrontends();
    await this.subToEvents();
    await this.preloadMenuMicroFrontend();

    return;
  }

  /**
   * Sends event to backend to init Menu
   * @returns Promise
   */
  private preloadMenuMicroFrontend() {
    const e = new uEvent();

    e.SourceId = this.sourceId.toString();
    e.SourceEventUniqueId = this.traceId++;
    e.EventId = uEventsIds.InitMenu;

    return this.eProxyService.dispatchEvent(e).toPromise();
  }

  /**
   * Subs to events which this micro frontend is responsible for
   * @returns Promise
   */
  private subToEvents() {
    const e = new SubscibeToEvent([
      [uEventsIds.LoadedResource, 0, 0]]);

    e.SourceId = this.sourceId.toString();
    e.SourceEventUniqueId = this.traceId++;

    return this.eProxyService.dispatchEvent(e).toPromise();
  }

  /**
   * Parses new events, every new event goes through this function which will determine
   * its further path, also if resource responsible for event is not yet loaded, sends
   * event with request to load resources for that micro frontend.
   * @param event Event array
   */
  private parseNewEvent(event: any) {
    event.forEach(element => {
      this.eProxyService.confirmEvents(this.sourceId, [element.AggregateId]).toPromise();
      this.eProxyService.env.loadConfig();
      const dic = this.eProxyService.env.uf;
      // check if event is LoadedResource
      if (element.EventId === uEventsIds.LoadedResource) {
        const el: LoadedResource = element;

        // tslint:disable-next-line: forin
        for (const key in dic) {
          if (dic.hasOwnProperty(key)) {
            if (dic[key].events.includes(el.ResourceEventId)) {
              this.resources[+key] = true;
              return;
            }
          }
        }
      }

      for (const key in dic) {
        if (dic.hasOwnProperty(key)) {
          if (dic[key].events.includes(element.EventId)) {
            // check if loaded
            if (this.resources[+key]) {
              break;
            }

            // else request loading
            const e = new RequestToLoadScripts(element.EventId, dic[key].resources);

            e.SourceId = key;
            e.SourceEventUniqueId = this.traceId++;

            this.eProxyService.dispatchEvent(e).subscribe(
              (value: any) => { console.log(value); },
              (error: any) => { console.log('error', error); },
              () => {},
            );
          }
        }
      }
    });
  }

  /**
   * Subs micro frontends to their events and subs itself to them so it
   * can load them if they're not yet laoded
   * @returns Promise
   */
  private subMicroFrontends() {
    const ret: Promise<any>[] = [];

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
        event.SourceEventUniqueId = this.traceId++;

        ret.push(this.eProxyService.dispatchEvent(event).toPromise());

        // Subscribe to them for loading
        event = new SubscibeToEvent(subList);

        event.SourceId = this.sourceId.toString();
        event.SourceEventUniqueId = this.traceId++;
        ret.push(this.eProxyService.dispatchEvent(event).toPromise());
      }
    }
    return Promise.all(ret);
  }
}
