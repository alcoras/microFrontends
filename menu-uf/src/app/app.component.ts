import { Component } from '@angular/core';
import {
  EventProxyLibService,
  EnvironmentService,
  MicroFrontendParts,
  LanguageChange,
  EventButtonPressed,
  EnvironmentTypes,
  EventIds} from 'event-proxy-lib-src';

import { environment } from 'src/environments/environment';

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
})
export class AppComponent {

  public themes: ISelector[];
  public selectedTheme: string;

  public langs: ISelector[];
  public selectedLang: string;
  private sourceId: string = MicroFrontendParts.Menu.SourceId;
  private sourceName: string = MicroFrontendParts.Menu.SourceName;

  private placement: { [id: number]: IUFState } = {};

  public constructor(
    private environmentService: EnvironmentService,
    private eventProxyService: EventProxyLibService,
  ) {
    this.preparePlacements();
    this.prepareThemeAndLang();
  }

  /**
   * Handle menu clicks
   * @param evt ?
   * @param eventName button event name
   */
  public MenuClick(evt, eventName: number): void {
    // create an event
    this.eventButtonPressed(eventName);

    const elId = this.getElFromID(eventName);

    this.openTab(evt, elId.elementId);
  }

  /**
   * Change theme handler
   */
  public ChangeTheme(): void {
    const el = document.getElementById('themeAsset') as HTMLLinkElement;
    el.href = this.selectedTheme;
  }

  /**
   * Button change language handler
   */
  public ChangeLanguage(): void {
    const e = new LanguageChange(this.selectedLang);

    e.SourceId = this.sourceId;
    e.SourceName = this.sourceName;

    this.eventProxyService.DispatchEvent(e).toPromise();
  }

  /**
   * Reload page
   */
  public Reload(): void {
    window.location.reload();
  }

  /**
   *  Prepares theme and language
   */
  private prepareThemeAndLang(): void {
    let url = '';
    // only in development and above (staging, prod) additional path needs to be added
    // so nginx can take care of redirections
    if (environment.EnvironmentTypes <= EnvironmentTypes.Development)
      url = `menu/`;

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
    this.selectedLang = this.environmentService.Language;
  }

  /**
   * Prepares placements for Micro Frontends
   * which html element should they use
   */
  private preparePlacements(): void {
    this.placement[EventIds.PersonnelButtonPressed] =
      { elementId: 'personnel', loaded: false };

    this.placement[EventIds.OccupationNg9ButtonPressed] =
      { elementId: 'occupationsNg9', loaded: false };

    this.placement[EventIds.ObserverButtonPressed] =
      { elementId: 'observer', loaded: false };

    this.placement[EventIds.MaterialsReceiptsButtonPressed] =
      { elementId: 'materialReceipts', loaded: false };
    // this.placement[EventIds.<project_name>ButtonPressed] =
    // { elementId: '<project_name>', loaded: false };
  }

  private getElFromID(id: number): IUFState {
    const elId = this.placement[id];

    if (!elId) {
      throw new Error('Unsupported ButtonPressed Id');
    }

    return elId;
  }

  private eventButtonPressed(eventName: number): void {
    const elState = this.getElFromID(eventName);

    const elId = elState.loaded ? null : elState.elementId;

    if (elId) {
      this.placement[eventName].loaded = true;
    } else {
      return;
    }

    const event = new EventButtonPressed(eventName, elId);

    event.SourceId = this.sourceId;

    this.eventProxyService.DispatchEvent(event).toPromise();
  }

  /**
   * Opens tab
   * @param evt ?
   * @param tabName tab name of micro frontend
   */
  // (DEMO)
  private openTab(evt, tabName: string): void {
    let i: number;

    const tabcontent = document.getElementsByClassName('tabcontent') as HTMLCollectionOf<HTMLElement>;

    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = 'none';
    }

    const tablinks = document.getElementsByClassName('tablinks');
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(' active', '');
    }
    document.getElementById(tabName).style.display = 'block';
    evt.currentTarget.className += ' active';
  }

}
