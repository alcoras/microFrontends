import { Component } from '@angular/core';
import { EventProxyLibService } from '@uf-shared-libs/event-proxy-lib';
import { RequestToLoadScripts, SubscibeToEvent, LoadedResource, ResourceSheme } from '@uf-shared-events/index';
import { uEventsIds, uParts } from '@uf-shared-models/event';
import { MessageService } from '../msg.service';

@Component({
  selector: 'app-script-loader',
  template: '',
  providers: [ EventProxyLibService, EventProxyLibService ]
})
export class ScriptLoaderComponent {
  title = 'script-loader';
  traceId = 1;
  sourceId: number = uParts.ScriptLoader;

  constructor(
    private eProxyService: EventProxyLibService,
    private msgService: MessageService
  ) {
    this.preLoadScripts()
      .then( () => {
        this.eProxyService.env.loadConfig();
        this.msgService.preloaded(); } );

    this.subToRequestToLoadScript();
    this.eProxyService.startQNA(this.sourceId).subscribe
    (
      (value) => { this.parseNewEvent(value); },
      (error) => { console.log(this.title, error); },
      () => {}
    );
  }

  public async preLoadScripts() {
    const promises: any[] = [];
    // TODO: refactor ports add to env

    this.eProxyService.env.loadConfig();
    const url: string = this.eProxyService.env.url;

    // Occupation
    promises.push(this.loadScript(url + ':3003/scripts/conf.js') );

    // Personnel
    promises.push(this.loadScript(url + ':3004/scripts/conf.js') );

    // OccupationNg9
    promises.push(this.loadScript(url + ':3005/scripts/conf.js') );

    return Promise.all(promises);
  }

  private parseNewEvent(event: any) {
    event.forEach(element => {
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

  private subToRequestToLoadScript() {
    const event = new SubscibeToEvent([
      [uEventsIds.RequestToLoadScript, 0, 0]]);

    event.SourceId = this.sourceId.toString();
    event.SourceEventUniqueId = this.traceId++;

    this.eProxyService.dispatchEvent(event).subscribe(
      (value: any) => { console.log(value); },
      (error: any) => { console.log('error', error); },
      () => {},
    );
  }

  private async attemptLoadScripts(event: RequestToLoadScripts) {
      await this.loadResources(event);
  }

  private async loadScript(url: string): Promise<any> {
    const scripts = Array
      .from( document.querySelectorAll('script') )
      .map( src => src.src);

    if (!scripts.includes(url)) {
      return new Promise(resolve => {
        const scriptElement = document.createElement('script');
        scriptElement.src = url;
        scriptElement.onload = resolve;
        document.body.appendChild(scriptElement);
      });
    }
  }

  private async loadResources(event: RequestToLoadScripts) {

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
