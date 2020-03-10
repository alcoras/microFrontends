import { Component } from '@angular/core';
import { EventProxyLibService } from '@uf-shared-libs/event-proxy-lib';
import { RequestToLoadScripts, SubscibeToEvent, LoadedResource, ResourceSheme } from '@uf-shared-events/index';
import { uEventsIds, uParts } from '@uf-shared-models/event';
import { MessageService } from '../msg.service';

@Component({
  selector: 'app-script-loader',
  template: '',
  providers: [ EventProxyLibService ]
})
export class ScriptLoaderComponent {
  title = 'script-loader';
  traceId = 1;
  sourceId: number = uParts.ScriptLoader;

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

    Promise.all([this.preLoadScripts(), this.subToRequestToLoadScript()])
      .then( () => {
        this.eProxyService.env.loadConfig();
        this.msgService.preloaded(); });

  }

  public preLoadScripts(): Promise<any> {
    const promises: any[] = [];
    // TODO: refactor ports add to env

    this.eProxyService.env.loadConfig();
    const url: string = this.eProxyService.env.url;
    const menuPath = ':3002/en/scripts/conf.js';
    const personnelPath = ':3004/scripts/conf.js';
    const occupationPath = ':3005/scripts/conf.js';
    // TODO: uf-manager should do this?
    // Menu
    promises.push(this.loadScript(url + menuPath) );

    // Personnel
    promises.push(this.loadScript(url + personnelPath) );

    // OccupationNg9
    promises.push(this.loadScript(url + occupationPath) );

    return Promise.all(promises);
  }

  private parseNewEvent(event: any) {
    event.forEach(element => {
      this.eProxyService.confirmEvents(this.sourceId, [element.AggregateId]).toPromise();
      switch (element.EventId) {
        case uEventsIds.RequestToLoadScript:
          this.attemptLoadScripts(element);
          break;
        }
    });
  }

  private sendEventLoadedScript(eventId: number, resScheme: ResourceSheme) {
    const event = new LoadedResource(eventId, resScheme);

    event.SourceId = this.sourceId.toString();
    event.SourceEventUniqueId = this.traceId++;

    this.eProxyService.dispatchEvent(event).subscribe(
      (value: any) => { console.log(value); },
      (error: any) => { console.log('error', error); },
      () => {},
    );
  }

  private subToRequestToLoadScript(): Promise<any> {
    const event = new SubscibeToEvent([
      [uEventsIds.RequestToLoadScript, 0, 0]]);

    event.SourceId = this.sourceId.toString();
    event.SourceEventUniqueId = this.traceId++;

    return this.eProxyService.dispatchEvent(event).toPromise();
  }

  private attemptLoadScripts(event: RequestToLoadScripts) {
    this.loadResources(event);
  }

  private loadScript(url: string): Promise<any> {
    const scripts = Array
      .from( document.querySelectorAll('script') )
      .map( src => src.src);

    if (!scripts.includes(url)) {
      return new Promise(resolve => {
        const scriptElement = document.createElement('script');
        scriptElement.src = url;
        scriptElement.onload = resolve;
        // TODO_HIGH: does not check whether script was actually found and loaded
        document.body.appendChild(scriptElement);
      });
    }
  }

  private loadResources(event: RequestToLoadScripts) {

    event.ResourceSchemes.forEach(scheme => {

      let resources;
      let attrToCheck: string;
      let el;

      switch (scheme.Element) {
        case 'script':
            resources = Array
              .from( document.querySelectorAll('script') )
              .map( src => src.src );
            attrToCheck = 'src';
            el = document.createElement('script');

            break;
        case 'link':
            resources = Array
              .from( document.querySelectorAll('link') )
              .map( src => src.href );
            attrToCheck = 'href';
            el = document.createElement('link');

            break;
      }
      // Check if it's not loaded yet
      if ( !resources.includes( scheme.Attributes[attrToCheck] ) ) {
        return new Promise(resolve => {
          el.onload = resolve;

          for (const key in scheme.Attributes) {
            if (scheme.Attributes.hasOwnProperty(key)) {
              el.setAttribute(key, scheme.Attributes[key]);
            }
          }

          document.body.appendChild(el);
          // TODO_HIGH: does not check whether script was actually found and loaded
          this.sendEventLoadedScript(event.RequestEventId, scheme);
        });
      }

    });

  }
}
