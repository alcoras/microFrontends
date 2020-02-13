import { Component, ElementRef, AfterViewInit } from '@angular/core';
import { uEvents, uParts, uEventTemplate } from "@protocol-shared/event";

@Component({
  selector: 'app-script-loader',
  template: ''
})
export class ScriptLoaderComponent implements AfterViewInit
{
  traceId = 1;
  title = "script-loader"
  mainChannelEl: HTMLElement;

  constructor(private el: ElementRef)
  {
    this.mainChannelEl = document.querySelector('main-channel');
    this.sendInitEvent();
  }

  sendInitEvent()
  {
    let initEventId = uEvents.InitEvent.EventId;

    const ev = new uEventTemplate(
      initEventId,
      this.traceId++,
      uParts.ScriptLoader);

    const domEvent = new CustomEvent(
      initEventId.toString(),
      {
        detail:
        {
          ev,
          "part": this.title
        },
        bubbles: true
      });

    this.mainChannelEl.dispatchEvent(domEvent);
  }

  ngAfterViewInit(): void
  {
    this.mainChannelEl.addEventListener(
      uEvents.RequestToLoadScript.EventId.toString(),
      this.attemptLoadScript.bind(this));
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
    let initEventId = uEvents.LoadedScript.EventId;

    const ev = new uEventTemplate(
      initEventId,
      this.traceId++,
      uParts.ScriptLoader);

    const domEvent = new CustomEvent(
      initEventId.toString(),
      {
        detail:
        {
          ev,
          "part": this.title
        },
        bubbles: true
      });

    this.mainChannelEl.dispatchEvent(domEvent);
  }

}
