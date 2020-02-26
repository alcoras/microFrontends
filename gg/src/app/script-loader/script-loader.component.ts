import { Component, AfterViewInit } from '@angular/core';
import { EventProxyLibService } from 'event-proxy-lib';
import { RequestToLoadScripts, SubscibeToEvent, LoadedScript } from "@protocol-shared/events";
import { uEventsIds, uParts } from '@protocol-shared/models/event';

@Component({
  selector: 'app-script-loader',
  template: ''
})
export class ScriptLoaderComponent implements AfterViewInit
{
  title = "script-loader"
  traceId = 1;
  sourceId:number = uParts.ScriptLoader;

  constructor(
    private eProxyService: EventProxyLibService
  )
  {
    this.subToLoadedScriptEvent();
    this.eProxyService.startQNA(this.sourceId).subscribe
    (
      (value) => { this.parseNewEvent(value); },
      (error) => { console.log(this.title, error)},
      () => {}
    )
  }

  private parseNewEvent(event:any)
  {
    event.forEach(element =>
    {
        switch(element.EventId)
        {
          case uEventsIds.RequestToLoadScript:
            this.attemptLoadScript(element);
            break;
        }
    });
  }

  private sendEventLoadedScript(eventId:number, url:string)
  {
    let event = new LoadedScript(eventId, url);

    event.SourceId = this.sourceId.toString();
    event.SourceEventUniqueId = this.traceId++;

    this.eProxyService.dispatchEvent(event).subscribe(
      (value:any) => { console.log(value) },
      (error:any) => { console.log("error", error)},
      () => {},
    );
  }

  private subToLoadedScriptEvent()
  {
    let event = new SubscibeToEvent([
      [uEventsIds.RequestToLoadScript,0,0]]);

    event.SourceId = this.sourceId.toString();
    event.SourceEventUniqueId = this.traceId++;

    this.eProxyService.dispatchEvent(event).subscribe(
      (value:any) => { console.log(value) },
      (error:any) => { console.log("error", error)},
      () => {},
    );
  }

  ngAfterViewInit(): void
  {

  }

  private async attemptLoadScript( event: RequestToLoadScripts )
  {
    event.UrlList.forEach(async url => {
      await this.loadScript( event.requestEventId, url )
    });
  }

  private async loadScript(eventId:number, scriptUrl:string) : Promise<any>
  {
    let scripts = Array
      .from( document.querySelectorAll('script') )
      .map( src => src.src);

    if (!scripts.includes(scriptUrl))
    {
      return new Promise(resolve =>
      {
        const scriptElement = document.createElement('script');
        scriptElement.src = scriptUrl;
        scriptElement.onload = resolve;
        document.body.appendChild(scriptElement);

        this.sendEventLoadedScript(eventId, scriptUrl);
      });
    }
  }
}
