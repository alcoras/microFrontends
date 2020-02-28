import { Component, AfterViewInit } from '@angular/core';
import { EventProxyLibService } from 'event-proxy-lib';
import { RequestToLoadScripts, SubscibeToEvent, LoadedScript, UrlScheme } from '@protocol-shared/events';
import { uEventsIds, uParts } from '@protocol-shared/models/event';

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
    this.subToLoadedScriptEvent();
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
            this.attemptLoadScript(element);
            break;
        }
    });
  }

  private sendEventLoadedScript(eventId: number, url: string) {
    const event = new LoadedScript(eventId, url);

    event.SourceId = this.sourceId.toString();
    event.SourceEventUniqueId = this.traceId++;

    this.eProxyService.dispatchEvent(event).subscribe(
      (value: any) => { console.log(value); },
      (error: any) => { console.log('error', error); },
      () => {},
    );
  }

  private subToLoadedScriptEvent() {
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

  private async attemptLoadScript( event: RequestToLoadScripts ) {
    event.UrlSchemes.forEach(async url => {
      await this.loadScript( event.RequestEventId, url );
    });
  }

  // TODO: change to load resources (for scripts and css)
  private async loadScript(eventId: number, urlScheme: UrlScheme): Promise<any> {
    const scripts = Array
      .from( document.querySelectorAll('script') )
      .map( src => src.src);

    if (!scripts.includes(urlScheme.URL)) {
      return new Promise(resolve => {
        const scriptElement = document.createElement('script');
        scriptElement.src = urlScheme.URL;
        scriptElement.onload = resolve;

        for (const key in urlScheme.Attributes) {
          if (urlScheme.hasOwnProperty(key)) {
            scriptElement.setAttribute(key, urlScheme[key]);
          }
        }

        document.body.appendChild(scriptElement);

        this.sendEventLoadedScript(eventId, urlScheme.URL);
      });
    }
  }
}
