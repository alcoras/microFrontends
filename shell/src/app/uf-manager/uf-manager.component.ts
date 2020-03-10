import { Component } from '@angular/core';
import { uParts, uEventsIds, uEvent } from '@uf-shared-models/event';
import { EventProxyLibService } from '@uf-shared-libs/event-proxy-lib';
import { SubscibeToEvent, RequestToLoadScripts, LoadedResource, LanguageChange } from '@uf-shared-events/index';
import { MessageService } from '../msg.service';
import { forkJoin } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { LanguageService, ILanguageSettings } from '../lang-service/lang.service';

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

  langConn: LanguageService | null;

  constructor(
    private httpClient: HttpClient,
    private eProxyService: EventProxyLibService,
    private msgService: MessageService
  ) {
    this.eProxyService.startQNA(this.sourceId).subscribe
    (
      (value) => { this.parseNewEvent(value); },
      (error) => { console.log(this.title, error); },
      () => {}
    );

    this.langConn = new LanguageService(this.httpClient);
    this.loadUserSettings();

    // check if configs are loaded by script-loader
    this.msgService.eventPreloaded.subscribe(
      () => {
        // wait for micro frontends to sub
        Promise.all([this.subMicroFrontends(), this.subToEvents()]).then(() => {
          this.preloadMenuMicroFrontend();
        });
      });
  }

  private loadUserSettings() {
    // TODO: transfer ability to set/load env vars to env library
    this.langConn.getLang().subscribe(
      (res: HttpResponse<any>) => {
        if (res.status === 200) {
          const lang: ILanguageSettings = res.body;
          // tslint:disable-next-line: no-string-literal
          window['__env']['lang'] = lang.lang;
        }
      },
      (error: any) => { console.log('error', error); },
      () => {},
    );
  }

  private preloadMenuMicroFrontend() {
    const e = new uEvent();

    e.SourceId = this.sourceId.toString();
    e.SourceEventUniqueId = this.traceId++;
    e.EventId = uEventsIds.InitMenu;

    this.eProxyService.dispatchEvent(e).toPromise();
  }

  private subToEvents() {
    const e = new SubscibeToEvent([
      [uEventsIds.LoadedResource, 0, 0],
      [uEventsIds.LanguageChange, 0, 0]]);

    e.SourceId = this.sourceId.toString();
    e.SourceEventUniqueId = this.traceId++;

    return this.eProxyService.dispatchEvent(e).toPromise();
  }

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

      if (element.EventId === uEventsIds.LanguageChange) {
        this.eventChangeLanguage(element);
        return;
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

  private eventChangeLanguage(element: LanguageChange) {
    this.langConn.setLang(element.NewLanguage).toPromise().then(
      () => { window.location.reload(); }
    );
  }

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
