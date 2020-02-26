import { Component } from '@angular/core';
import { uEvent, uEventsIds, uParts } from "@protocol-shared/models/event";
import { EventProxyLibService } from 'event-proxy-lib'
// TODO: fix index.d.ts so event classes are loaded from one source
import { SubscibeToEvent } from "@protocol-shared/events/SubscibeToEvent";
import { RequestToLoadScripts } from "@protocol-shared/events/RequestToLoadScript";
import { LoadedScript } from "@protocol-shared/events/LoadedScript";
import { MenuUrlsStatus } from './helpers/Urls';

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

  parseNewEvent(event: any)
  {
    event.forEach(element =>
    {
        switch(element.EventId)
        {
          case uEventsIds.LoadedScript:
            this.eventLoadedScript(element);
            break;
        }
    });
  }

  title = 'menu';
  traceId = 1;

  sourceId:number = uParts.Menu;

  menuUrlsStatus: { [id:number]: MenuUrlsStatus } = {};

  constructor(
    private eProxyService: EventProxyLibService
  )
  {
    this.eProxyService.startQNA(this.sourceId).subscribe(
      (value) => { this.parseNewEvent(value); },
      (error) => { console.log(this.title, error)},
      () => {}
    )

    this.subToLoadedScriptEvent();
    this.prepareUrls();
  }

  prepareUrls()
  {
    // TODO:micro frontend probably could tell himself where he is

    this.menuUrlsStatus[uEventsIds.PerssonelButtonPressed] = new MenuUrlsStatus();
    this.menuUrlsStatus[uEventsIds.PerssonelButtonPressed].urls.push("http://127.0.0.1:3004/main.js");
    this.menuUrlsStatus[uEventsIds.PerssonelButtonPressed].elementToPlace = "<team-personnel-2></team-personnel-2>";
    this.menuUrlsStatus[uEventsIds.PerssonelButtonPressed].elementToReplaceId = "personnel";

    this.menuUrlsStatus[uEventsIds.OccupationButtonPressed] = new MenuUrlsStatus();
    this.menuUrlsStatus[uEventsIds.OccupationButtonPressed].urls.push("http://127.0.0.1:3003/main.js");
    this.menuUrlsStatus[uEventsIds.OccupationButtonPressed].elementToPlace = "<team-occupations-2></team-occupations-2>";
    this.menuUrlsStatus[uEventsIds.OccupationButtonPressed].elementToReplaceId = "occupations";
  }

  subToLoadedScriptEvent()
  {
    let event = new SubscibeToEvent([[uEventsIds.LoadedScript,0,0]]);
    event.SourceId = this.sourceId.toString();
    event.SourceEventUniqueId = this.traceId++;

    this.eProxyService.dispatchEvent(event).subscribe(
      (value:any) => { console.log("value", value) },
      (error:any) => { console.log("error", error)},
      () => {},
    );
  }

  eventLoadedScript(event: LoadedScript)
  {
    this.menuUrlsStatus[event.scriptEventId].loaded = true;
    // put element into tab
    var tabcontent = document.getElementById(
      this.menuUrlsStatus[event.scriptEventId].elementToReplaceId);

    tabcontent.innerHTML = this.menuUrlsStatus[event.scriptEventId].elementToPlace;
  }

  menuClick(evt, eventName:number)
  {
    // create event
    this.eventButtonPressed(eventName)

    switch(eventName)
    {
      case uEventsIds.PerssonelButtonPressed:
        this.openTab(evt, "personnel");
        break;
      case uEventsIds.OccupationButtonPressed:
        this.openTab(evt, "occupations");
        break;
    }
  }

  eventButtonPressed(eventName:number)
  {
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
    );

    if (this.menuUrlsStatus[eventName].loaded)
      return;

    let event2 = new RequestToLoadScripts(
      eventName,
      this.menuUrlsStatus[eventName].urls);

    event2.SourceEventUniqueId = this.traceId++;
    event2.SourceId = this.sourceId.toString();

    this.eProxyService.dispatchEvent(event2).subscribe(
      (value:any) => { console.log(value) },
      (error:any) => { console.log("error", error)},
      () => {},
    );
  }

  openTab(evt, tabName: string)
  {
    var i: number, tabcontent, tablinks;

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
