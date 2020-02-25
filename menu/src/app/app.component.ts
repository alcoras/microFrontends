import { Component } from '@angular/core';
import { uEvent, uEventsIds, uParts } from "@protocol-shared/models/event";
import { EventProxyLibService } from 'event-proxy-lib'
import { SubscibeToEvent } from "@protocol-shared/events/SubscibeToEvent";

class IncorrectEventName extends Error
{
  public name = "IncorrectEventName";
  public message = "Incorrect event name was passed";
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'menu';
  traceId = 1;

  sourceId:number = uParts.Menu;

  constructor(
    private eProxyService: EventProxyLibService
  )
  {
    this.eProxyService.startQNA(this.sourceId).subscribe(
      (value) => { console.log(this.title, value)},
      (error) => { console.log(this.title, error)},
      () => {}
    )

    this.subToLoadedScriptEvent();
  }


  subToLoadedScriptEvent()
  {
    let event = new SubscibeToEvent([[uEventsIds.LoadedScript,0,0]]);
    event.SourceId = this.sourceId.toString();
    event.SourceEventUniqueId = this.traceId++;

    this.eProxyService.dispatchEvent(event).subscribe(
      (value:any) => { console.log(value) },
      (error:any) => { console.log("error", error)},
      () => {},
    );
  }

  menuClick(evt, eventName:number)
  {
    // create event
    let event = new uEvent();
    if (Object.values(uEventsIds).includes(eventName))
      event.EventId = eventName;
    else
      throw new IncorrectEventName();

    event.SourceEventUniqueId = this.traceId++;
    event.SourceId = this.sourceId.toString();

    this.eProxyService.dispatchEvent(event).subscribe(
      (value:any) => { console.log(value) },
      (error:any) => { console.log("error", error)},
      () => {},
    )

    switch(eventName)
    {
      case uEventsIds.PerssonelButtonPressed:
        this.openTab(evt, "personnel");
        break;
      case uEventsIds.PerssonelButtonPressed:
        this.openTab(evt, "occupations");
        break;
    }
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
