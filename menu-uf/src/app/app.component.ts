import { Component } from '@angular/core';
import { uEventsIds, uParts } from '@uf-shared-models/event';
import { EventButtonPressed, LanguageChange } from '@uf-shared-events/index';
import { EventProxyLibService } from '@uf-shared-libs/event-proxy-lib';

interface ISelector {
  value: string;
  viewValue: string;
}

interface IUFState {
  elementId: string;
  loaded: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ EventProxyLibService ],
})
export class AppComponent {
  title = 'menu';

  sourceId: string = uParts.Menu;

  placement: { [id: number]: IUFState } = {};

  themes: ISelector[];
  selectedTheme: string;

  langs: ISelector[];
  selectedLang: string;

  constructor(
    private eProxyService: EventProxyLibService
  ) {
    this.preparePlacements();
    this.prepareThemeAndLang();
  }

  // TODO: port should be configurable
  private prepareThemeAndLang() {
    const url = `${this.eProxyService.env.Url}:3002/en/`;
    this.themes = [
      { value: url + 'assets/deeppurple-amber.css', viewValue: 'Deep Purple & Amber' },
      { value: url + 'assets/indigo-pink.css', viewValue: 'Indigo & Pink' },
      { value: url + 'assets/pink-bluegrey.css', viewValue: 'Pink & Blue-grey' },
      { value: url + 'assets/purple-green.css', viewValue: 'Purple & Green' }
    ];
    this.langs = [
      { value: 'en', viewValue: 'EN' },
      { value: 'uk', viewValue: 'UK' },
      { value: 'ru', viewValue: 'RU' },
      { value: 'lt', viewValue: 'LT' },
    ];
    this.selectedTheme = this.themes[0].value;
    this.selectedLang = this.eProxyService.env.Language;
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

    this.eProxyService.DispatchEvent(e).subscribe(
      (value: any) => { },
      (error: any) => { console.log('error', error); },
      () => {  },
    );
  }

  private preparePlacements() {
    this.placement[uEventsIds.PerssonelButtonPressed] = { elementId: 'personnel', loaded: false };
    this.placement[uEventsIds.OccupationNg9ButtonPressed] = { elementId: 'occupationsNg9', loaded: false };
  }

  private getElFromID(id: number): IUFState {
    const elId = this.placement[id];

    if (!elId) {
      throw new Error('Unsupported ButtonPressed Id');
    }

    return elId;
  }

  menuClick(evt, eventName: number) {
    // create an event
    this.eventButtonPressed(eventName);

    const elId = this.getElFromID(eventName);

    this.openTab(evt, elId.elementId);
  }

  eventButtonPressed(eventName: number) {
    const elState = this.getElFromID(eventName);

    const elId = elState.loaded ? null : elState.elementId;

    if (elId) {
      this.placement[eventName].loaded = true;
    }

    const event = new EventButtonPressed(eventName, elId);

    event.SourceId = this.sourceId;

    this.eProxyService.DispatchEvent(event).subscribe(
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
