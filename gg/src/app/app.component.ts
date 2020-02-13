import { Component, ElementRef, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent
{
  traceId = 1;
  mainChannelEl: HTMLElement;
  title = 'gg';

  constructor(
    public el: ElementRef,
    public renderer: Renderer2)
    {
      console.log('INIT main-channel');
      this.mainChannelEl = document.querySelector('main-channel');
      this.subToAll();
    }

  subToAll()
  {
    for (let i = 1000; i < 1004; i++)
    {

      this.mainChannelEl.addEventListener(
        i.toString(),
        this.log.bind(this));
    }
  }

  log(event)
  {
    event['detail']['AggregateId'] = this.traceId++;
    console.log(event);
  }
}
