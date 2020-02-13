import { Component, ElementRef } from '@angular/core';
import { uEventTemplate, uEvents, uParts } from "@protocol-shared/event";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  traceId = 1;

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
      uParts.Menu);

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

  title = 'menu';
  i = 0;

  async sendRequestLoadScript()
  {
    let eventId = uEvents.RequestToLoadScript.EventId;

    const ev = new uEventTemplate(
      eventId,
      this.traceId++,
      uParts.Menu);

    const domEvent = new CustomEvent(
      eventId.toString(),
      {
        detail:
        {
          ev,
          urls:
          ["http://127.0.0.1:3004/main.js" ]
        },
        bubbles: true
      });

    this.mainChannelEl.dispatchEvent(domEvent);
  }

  menuClick(evt, eventName:number)
  {
    //
    //document.getElementById("occupations").innerHTML = "<team-occupations-2></team-occupations-2>";

    const ev = new uEventTemplate(
      eventName,
      this.traceId++,
      uParts.Menu);

    const domEvent = new CustomEvent(
      eventName.toString(),
      {
        detail:
        {
          ev
        },
        bubbles: true
      });

    this.mainChannelEl.dispatchEvent(domEvent);

    // switch(eventName)
    // {
    //   case uEvents.PerssonelButtonPressed.EventId:
    //     this.openTab(evt, "personnel");
    //     break;
    //   case uEvents.OccupationButtonPressed.EventId:
    //     this.openTab(evt, "occupations");
    //     break;
    // }

    this.sendRequestLoadScript();
  }

  openTab(evt, tabName: string)
  {
    var i, tabcontent, tablinks;

    tabcontent = document.getElementsByClassName("tabcontent");

    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
  }

}
