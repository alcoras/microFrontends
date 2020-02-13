import { Component, ElementRef } from '@angular/core';
import { uEvents } from "@protocol-shared/models/event";

import { EventProxyLibService } from "event-proxy-lib";
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  obs:Observable<string>;

  title = 'personnel';
  mainChannelEl: HTMLElement;

  constructor(
    private eProxyService: EventProxyLibService,
    private el: ElementRef)
  {

    this.obs = eProxyService.logThis();

    console.log('INIT PERSONNEL');
    this.mainChannelEl = document.querySelector('main-channel');
  }

  ngAfterViewInit()
  {
    // this.mainChannelEl.addEventListener(
    //   uEvents.PerssonelButtonPressed.EventId.toString(),
    //   this.onClick.bind(this));
  }

  onClick(event)
  {
    console.log(event);
    console.log('Personnel: '+ event['type'] );

    var comp:HTMLElement = document.getElementById(event['detail']['comp_name']);

    comp.innerHTML= "<team-personnel-2></team-personnel-2>"
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.

  }
}
