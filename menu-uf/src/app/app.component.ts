import { Component } from '@angular/core';
import { uEventsIds, uParts } from '@uf-shared-models/event';
import { EventButtonPressed, LanguageChange } from '@uf-shared-events/index';
import { EventProxyLibService } from '@uf-shared-libs/event-proxy-lib';
import { Router } from '@angular/router';

class IncorrectEventName extends Error {
  public name = 'IncorrectEventName';
  public message = 'Incorrect event name was passed';
}

interface Selector {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ EventProxyLibService ],
})
export class AppComponent {
  title = 'menu';
  traceId = 1;

  sourceId: number = uParts.Menu;

  placement: { [id: number]: string } = {};

  themes: Selector[];
  selectedTheme: string;

  langs: Selector[];
  selectedLang: string;

  constructor(
    private eProxyService: EventProxyLibService,
    private router: Router
  ) {
    this.preparePlacements();
    // TODO: port should be configurable
    const url = `${eProxyService.env.url}:3002/en/`;
    this.themes = [
      {value: url + 'assets/deeppurple-amber.css', viewValue: 'Deep Purple & Amber'},
      {value: url + 'assets/indigo-pink.css', viewValue: 'Indigo & Pink'},
      {value: url + 'assets/pink-bluegrey.css', viewValue: 'Pink & Blue-grey'},
      {value: url + 'assets/purple-green.css', viewValue: 'Purple & Green'}
    ];

    this.langs = [
      {value: 'en', viewValue: 'EN'},
      {value: 'uk', viewValue: 'UK'},
      {value: 'ru', viewValue: 'RU'},
      {value: 'lt', viewValue: 'LT'},
    ];

    this.selectedTheme = this.themes[0].value;
    this.selectedLang = this.eProxyService.env.lang;
  }

  public changeTheme() {
    const el = document.getElementById('themeAsset') as HTMLLinkElement;
    el.href = this.selectedTheme;
  }

  refresh() {
    window.location.reload();
  }

  public changeLanguage() {
    const e = new LanguageChange(this.selectedLang);

    e.SourceId = this.sourceId.toString();

    this.eProxyService.dispatchEvent(e).subscribe(
      (value: any) => { },
      (error: any) => { console.log('error', error); },
      () => {  },
    );
  }

  private preparePlacements() {
    this.placement[uEventsIds.PerssonelButtonPressed] = 'personnel';
    this.placement[uEventsIds.OccupationNg9ButtonPressed] = 'occupationsNg9';
  }

  private getElFromID(id: number): string {
    const elId = this.placement[id];

    if (!elId) {
      throw new Error('Unsupported ButtonPressed Id');
    }

    return elId;
  }

  menuClick(evt, eventName: number) {
    // create event
    this.eventButtonPressed(eventName);

    const elId = this.getElFromID(eventName);

    this.openTab(evt, elId);
  }

  eventButtonPressed(eventName: number) {
    const elId = this.getElFromID(eventName);

    const event = new EventButtonPressed(eventName, elId);

    event.SourceEventUniqueId = this.traceId++;
    event.SourceId = this.sourceId.toString();

    this.eProxyService.dispatchEvent(event).subscribe(
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
