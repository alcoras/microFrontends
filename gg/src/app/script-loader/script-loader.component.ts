import { Component, AfterViewInit } from '@angular/core';
import { EventProxyLibService } from '@uf-shared-libs/event-proxy-lib';
import { RequestToLoadScripts, SubscibeToEvent, LoadedResource, ResourceSheme } from '@uf-shared-events/index';
import { uEventsIds, uParts } from '@uf-shared-models/event';

@Component({
  selector: 'app-script-loader',
  template: ''
})
export class ScriptLoaderComponent implements AfterViewInit {
  title = 'script-loader';
  traceId = 1;
  sourceId: number = uParts.ScriptLoader;

  constructor(
    private eProxyService: EventProxyLibService
  ) {
    this.subToRequestToLoadScript();
    this.eProxyService.startQNA(this.sourceId).subscribe
    (
      (value) => { this.parseNewEvent(value); },
      (error) => { console.log(this.title, error); },
      () => {}
    );
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

  ngAfterViewInit(): void {

  }

  private async attemptLoadScripts(event: RequestToLoadScripts) {
      await this.loadResources(event);
  }

  // private async loadScript(eventId: number, urlScheme: ResourceSheme): Promise<any> {
  //   const scripts = Array
  //     .from( document.querySelectorAll('script') )
  //     .map( src => src.src);
  //
  //   if (!scripts.includes(urlScheme.URL)) {
  //     return new Promise(resolve => {
  //       const scriptElement = document.createElement('script');
  //       scriptElement.src = urlScheme.URL;
  //       scriptElement.onload = resolve;

  //       for (const key in urlScheme.Attributes) {
  //         if (urlScheme.hasOwnProperty(key)) {
  //           scriptElement.setAttribute(key, urlScheme[key]);
  //         }
  //       }

  //       document.body.appendChild(scriptElement);

  //       this.sendEventLoadedScript(eventId, urlScheme.URL);
  //     });
  //   }
  // }

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

      if ( !resources.includes( scheme.Attributes[attrToCheck] ) ) {
        return new Promise(resolve => {
          el.onload = resolve;

          for (const key in scheme.Attributes) {
            if (scheme.Attributes.hasOwnProperty(key)) {
              el.setAttribute(key, scheme[key]);
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
