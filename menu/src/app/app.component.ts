import { Component } from '@angular/core';
import { uEvent, uEventsIds, uParts } from '@protocol-shared/models/event';
import { EventProxyLibService } from 'event-proxy-lib';
import { SubscibeToEvent, RequestToLoadScripts, LoadedScript, UrlScheme } from '@protocol-shared/events';
import { MenuUrlsStatus } from './helpers/Urls';

class IncorrectEventName extends Error {
  public name = 'IncorrectEventName';
  public message = 'Incorrect event name was passed';
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'menu';
  traceId = 1;

  sourceId: number = uParts.Menu;

  menuUrlsStatus: { [id: number]: MenuUrlsStatus } = {};

  constructor(
    private eProxyService: EventProxyLibService
  ) {
    this.eProxyService.startQNA(this.sourceId).subscribe(
      (value) => { this.parseNewEvent(value); },
      (error) => { console.log(this.title, error); },
      () => {}
    );

    this.subToLoadedScriptEvent();
    this.prepareUrls();
  }

  parseNewEvent(event: any) {
    event.forEach(element => {
        switch (element.EventId) {
          case uEventsIds.LoadedScript:
            this.eventLoadedScript(element);
            break;
        }
    });
  }

  prepareUrls() {
    // TODO:micro frontend probably could tell himself where he is
    this.setupPersonnelUrls();
    this.setupOccupationUrls();
    this.setupPersonnelNg9Urls();
  }

  private setupPersonnelNg9Urls() {
    // TODO: addreses should be followed from path which are defined by nginx config
    const eventNum = uEventsIds.OccupationNg9ButtonPressed;
    let temp: UrlScheme;
    const addr = 'http://127.0.0.1:3005/';
    // passing only es2015 (es6)
    const scripts = ['runtime.js', 'polyfills.js', 'main.js'];
    this.menuUrlsStatus[eventNum] = new MenuUrlsStatus();
    this.menuUrlsStatus[eventNum].urlShemes = new Array<UrlScheme>();

    scripts.forEach(script => {
      temp = new UrlScheme();
      temp.URL = addr + script;
      temp.setAttribute('type', 'module');
      this.menuUrlsStatus[eventNum].urlShemes.push(temp);
    });

    this.menuUrlsStatus[eventNum].elementToPlace = '<team-occupation-ng9></team-occupation-ng9>';
    this.menuUrlsStatus[eventNum].elementToReplaceId = 'occupationsNg9';
  }

  private setupOccupationUrls() {
    const eventNum = uEventsIds.OccupationButtonPressed;
    const temp = new UrlScheme();
    temp.URL = 'http://127.0.0.1:3003/main.js';
    this.menuUrlsStatus[eventNum] = new MenuUrlsStatus();
    this.menuUrlsStatus[eventNum].urlShemes = new Array<UrlScheme>();
    this.menuUrlsStatus[eventNum].urlShemes.push(temp);
    this.menuUrlsStatus[eventNum].elementToPlace = '<team-occupations-2></team-occupations-2>';
    this.menuUrlsStatus[eventNum].elementToReplaceId = 'occupations';
  }

  private setupPersonnelUrls() {
    const eventNum = uEventsIds.PerssonelButtonPressed;
    const temp = new UrlScheme();
    temp.URL = 'http://127.0.0.1:3004/main.js';
    this.menuUrlsStatus[eventNum] = new MenuUrlsStatus();
    this.menuUrlsStatus[eventNum].urlShemes = new Array<UrlScheme>();
    this.menuUrlsStatus[eventNum].urlShemes.push(temp);
    this.menuUrlsStatus[eventNum].elementToPlace = '<team-personnel-2></team-personnel-2>';
    this.menuUrlsStatus[eventNum].elementToReplaceId = 'personnel';
  }

  subToLoadedScriptEvent() {
    const event = new SubscibeToEvent([[uEventsIds.LoadedScript, 0, 0]]);
    event.SourceId = this.sourceId.toString();
    event.SourceEventUniqueId = this.traceId++;

    this.eProxyService.dispatchEvent(event).subscribe(
      (value: any) => { console.log('value', value); },
      (error: any) => { console.log('error', error); },
      () => {},
    );
  }

  eventLoadedScript(event: LoadedScript) {
    // put element into tab
    const tabcontent = document.getElementById(
      this.menuUrlsStatus[event.scriptEventId].elementToReplaceId);

    tabcontent.innerHTML = this.menuUrlsStatus[event.scriptEventId].elementToPlace;
    this.menuUrlsStatus[event.scriptEventId].loaded = true;
  }

  menuClick(evt, eventName: number) {
    // create event
    this.eventButtonPressed(eventName);

    switch (eventName) {
      case uEventsIds.PerssonelButtonPressed:
        this.openTab(evt, 'personnel');
        break;
      case uEventsIds.OccupationButtonPressed:
        this.openTab(evt, 'occupations');
        break;
      case uEventsIds.OccupationNg9ButtonPressed:
        this.openTab(evt, 'occupationsNg9');
        break;
    }
  }

  eventButtonPressed(eventName: number) {
    const event = new uEvent();
    if (Object.values(uEventsIds).includes(eventName)) {
      event.EventId = eventName;
    } else {
      throw new IncorrectEventName();
    }

    event.SourceEventUniqueId = this.traceId++;
    event.SourceId = this.sourceId.toString();

    this.eProxyService.dispatchEvent(event).subscribe(
      (value: any) => { console.log(value); },
      (error: any) => { console.log('error', error); },
      () => {},
    );

    if (this.menuUrlsStatus[eventName].loaded) {
      return;
    }

    const event2 = new RequestToLoadScripts(
      eventName, this.menuUrlsStatus[eventName].urlShemes);

    event2.SourceEventUniqueId = this.traceId++;
    event2.SourceId = this.sourceId.toString();

    this.eProxyService.dispatchEvent(event2).subscribe(
      (value: any) => { console.log(value); },
      (error: any) => { console.log('error', error); },
      () => {},
    );
  }

  openTab(evt, tabName: string) {
    let i: number;
    let tabcontent;
    let tablinks;

    tabcontent = document.getElementsByClassName('tabcontent');

    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = 'none';
    }
    tablinks = document.getElementsByClassName('tablinks');
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(' active', '');
    }
    document.getElementById(tabName).style.display = 'block';
    evt.currentTarget.className += ' active';
  }

}
