import { Component } from '@angular/core';
import { uParts, uEventsIds, uEvent } from '@uf-shared-models/event';
import { EventProxyLibService } from '@uf-shared-libs/event-proxy-lib';
import { SubscibeToEvent, RequestToLoadScripts, LoadedResource } from '@uf-shared-events/index';
import { MessageService } from '../msg.service';
import { Observable, forkJoin, observable } from 'rxjs';

@Component({
  selector: 'app-uf-manager',
  template: '',
  providers: [ EventProxyLibService, EventProxyLibService ]
})
export class UFManagerComponent {
  title = 'uf-manager';
  desc = 'micro frontend manager';
  traceId = 1;
  sourceId: number = uParts.UFManager;

  resources: { [srcId: number]: boolean } = {};

  constructor(
    private eProxyService: EventProxyLibService,
    private msgService: MessageService
  ) {
    // check if configs are loaded by script-loader
    this.msgService.eventPreloaded.subscribe(
      () => {
        // wait for micro frontends to sub
        forkJoin(this.subMicroFrontends()).subscribe(
          () => { this.preloadMenuMicroFrontend(); }
        );
      });

    this.eProxyService.startQNA(this.sourceId).subscribe
    (
      (value) => { this.parseNewEvent(value); },
      (error) => { console.log(this.title, error); },
      () => {}
    );

    this.subToLoadedResource();
  }

  private preloadMenuMicroFrontend() {
    const e = new uEvent();

    e.SourceId = this.sourceId.toString();
    e.SourceEventUniqueId = this.traceId++;
    e.EventId = uEventsIds.InitMenu;

    this.eProxyService.dispatchEvent(e).subscribe(
      (value: any) => { console.log(value); },
      (error: any) => { console.log('error', error); },
      () => {},
    );
  }

  private subToLoadedResource() {
    const e = new SubscibeToEvent([
      [uEventsIds.LoadedResource, 0, 0]]);

    e.SourceId = this.sourceId.toString();
    e.SourceEventUniqueId = this.traceId++;

    this.eProxyService.dispatchEvent(e).subscribe(
      (value: any) => { console.log(value); },
      (error: any) => { console.log('error', error); },
      () => {},
    );
  }

  private parseNewEvent(event: any) {

    event.forEach(element => {
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

  private subMicroFrontends() {
    const obs: any[] = [];

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

        obs.push(this.eProxyService.dispatchEvent(event));

        // Subscribe to them for loading
        event = new SubscibeToEvent(subList);

        event.SourceId = this.sourceId.toString();
        event.SourceEventUniqueId = this.traceId++;

        obs.push(this.eProxyService.dispatchEvent(event));
      }
    }
    return obs;
  }
}