import { Component, AfterViewInit } from '@angular/core';
import { EventProxyLibService } from 'event-proxy-lib';
import { SubscibeToEvent } from '@protocol-shared/events/SubscibeToEvent';
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

  parseNewEvent(event:any)
  {
    event.forEach(element =>
    {
        //TODO: continue here
    });
  }

  subToLoadedScriptEvent()
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

  async attemptLoadScript( event )
  {
    console.log("loading");
    // check for event param, addr of script...
    event['detail']['urls'].forEach(async url => {
      await this.loadScript( url );
    });

  }

  async loadScript(scriptUrl:string) : Promise<any>
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
      });
    }
  }

  eventLoadDone()
  {
  //   let initEventId = uEvents.LoadedScript.EventId;

  //   const ev = new uEventTemplate(
  //     initEventId,
  //     this.traceId++,
  //     uParts.ScriptLoader);

  //   const domEvent = new CustomEvent(
  //     initEventId.toString(),
  //     {
  //       detail:
  //       {
  //         ev,
  //         "part": this.title
  //       },
  //       bubbles: true
  //     });

  //   this.mainChannelEl.dispatchEvent(domEvent);
  //
  }

}
