import { Component, ElementRef } from '@angular/core';
import { uEventTemplate, uEvents } from './models/event';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  traceId = 0;

  mainChannelEl: HTMLElement;
  constructor(private el: ElementRef)
  {
    console.log('INIT MENU');
    this.mainChannelEl = document.querySelector('main-channel');
  }

  title = 'menu';
  i = 0;

  menuClick(evt, eventName:number)
  {
    //document.getElementById("occupations").innerHTML = "<team-occupations-2></team-occupations-2>";

    const ev = new uEventTemplate(
      eventName,
      this.traceId++,
      0,
      uEvents.PerssonelButtonPressed.srcID,
      uEvents.PerssonelButtonPressed.destID);

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

    switch(eventName)
    {
      case uEvents.PerssonelButtonPressed.eventID:
        this.openTab(evt, "personnel");
        break;
    }
    console.log('menu: Dispatched event', domEvent);
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
