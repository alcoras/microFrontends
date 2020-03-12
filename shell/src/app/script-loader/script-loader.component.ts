import { Component } from '@angular/core';
import { EventProxyLibService } from '@uf-shared-libs/event-proxy-lib';
import { RequestToLoadScripts, SubscibeToEvent, LoadedResource, ResourceSheme, LanguageChange } from '@uf-shared-events/index';
import { uEventsIds, uParts } from '@uf-shared-models/event';
import { MessageService } from '../msg.service';
import { LanguageService, ILanguageSettings } from '../lang-service/lang.service';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Subject } from 'rxjs';

/**
 * Responsible for loading resources into DOM by appending
 * script or link elements.
 * Constructor subscribes to: events, new events from backend, user
 * settings and preloads configurations for each micro frontend.
 */
@Component({
  selector: 'app-script-loader',
  template: '',
  providers: [ EventProxyLibService ]
})
export class ScriptLoaderComponent {
  title = 'script-loader';
  traceId = 1;
  sourceId: number = uParts.ScriptLoader;
  langConn: LanguageService | null;
  eventConstructorDone = new Subject();

  constructor(
    private httpClient: HttpClient,
    private eProxyService: EventProxyLibService,
    private msgService: MessageService,
  ) {
    this.langConn = new LanguageService(this.httpClient);

    this.eProxyService.startQNA(this.sourceId).subscribe
    (
      (value) => { this.parseNewEvent(value); },
      (error) => { console.log(this.title, error); },
      () => {}
    );

    this.eventConstructorDone.subscribe(() => { this.init(); });
    this.eventConstructorDone.next();
  }

  /**
   * Inits script loader component
   * Gets user settings(language).
   * Preloads configuration scripts for each micro frontend.
   * Subscribes to event ScriptLoader is responsible for.
   * Launches event which lets MicroFrontend Manager (ufM).
   */
  private async init() {
    this.langConn.getLang().subscribe(
      async (res: HttpResponse<any>) => {
        if (res.status === 200) {
          const lang: ILanguageSettings = res.body;
          // tslint:disable-next-line: no-string-literal
          window['__env']['lang'] = lang.lang;
          this.eProxyService.env.loadConfig();

          await this.preLoadScripts();
          await this.subToEvents();
          this.msgService.preloaded();
        }
      },
      (error: any) => { console.log('error', error); },
      () => {},
    );
    return;
  }


  /**
   * Preloads scripts for each micro frontend.
   * @returns Promise
   */
  public preLoadScripts(): Promise<any> {
    let promises: any[] = [];
    // TODO: refactor ports add to env

    this.eProxyService.env.loadConfig();
    const url: string = this.eProxyService.env.url;
    const menuPath = ':3002/en/scripts/conf.js';
    const personnelPath = ':3004/scripts/conf.js';
    const occupationPath = ':3005/scripts/conf.js';
    // TODO: uf-manager should do this?
    // Menu
    promises.push(this.loadScript(url + menuPath) );

    // Personnel
    promises.push(this.loadScript(url + personnelPath) );

    // OccupationNg9
    promises.push(this.loadScript(url + occupationPath) );

    return Promise.all(promises);
  }


  /**
   * Events change language
   * @param event Event model for language change event
   */
  private eventChangeLanguage(event: LanguageChange) {
    this.langConn.setLang(event.NewLanguage).toPromise().then(
      () => { window.location.reload(); }
    );
  }

  /**
   * Parses new events, every new event goes through this function which will determine
   * its further path
   * @param event Event array
   */
  private parseNewEvent(event: any) {
    event.forEach(element => {
      this.eProxyService.confirmEvents(this.sourceId, [element.AggregateId]).toPromise();
      switch (element.EventId) {
        case uEventsIds.RequestToLoadScript:
          this.attemptLoadResource(element);
          break;
        case uEventsIds.LanguageChange:
          this.eventChangeLanguage(element);
          break;
        }
    });
  }

  /**
   * Sends event loaded script when it loads some resource
   * @param eventId id for which the resource was loaded after
   * @param resScheme resource scheme model
   */
  private sendEventLoadedScript(eventId: number, resScheme: ResourceSheme) {
    const event = new LoadedResource(eventId, resScheme);

    event.SourceId = this.sourceId.toString();
    event.SourceEventUniqueId = this.traceId++;

    this.eProxyService.dispatchEvent(event).subscribe(
      (value: any) => { console.log(value); },
      (error: any) => { console.log('error', error); },
      () => {},
    );
  }


  /**
   * Subscribes to events this micro fronted is responsible for
   * @returns Promise
   */
  private subToEvents(): Promise<any> {
    const event = new SubscibeToEvent([
      [uEventsIds.RequestToLoadScript, 0, 0],
      [uEventsIds.LanguageChange, 0, 0]]);

    event.SourceId = this.sourceId.toString();
    event.SourceEventUniqueId = this.traceId++;

    return this.eProxyService.dispatchEvent(event).toPromise();
  }

  /**
   * Attempts to load a resource
   * @param event resource load event model
   */
  private attemptLoadResource(event: RequestToLoadScripts) {
    this.loadResources(event);
  }

  /**
   * Loads script only into DOM
   * @param url script url
   * @returns Promise
   */
  private loadScript(url: string): Promise<any> {
    const scripts = Array
      .from( document.querySelectorAll('script') )
      .map( src => src.src);

    if (!scripts.includes(url)) {
      return new Promise(resolve => {
        const scriptElement = document.createElement('script');
        scriptElement.src = url;
        scriptElement.onload = resolve;
        // TODO_HIGH: does not check whether script was actually found and loaded
        document.body.appendChild(scriptElement);
      });
    }
  }

  /**
   * Loads resources
   * @param event resource load event model
   */
  private loadResources(event: RequestToLoadScripts) {

    event.ResourceSchemes.forEach(scheme => {

      let resources;
      let attrToCheck: string;
      let el;

      switch (scheme.Element) {
        case 'script':
            resources = Array
              .from( document.querySelectorAll('script') )
              .map( src => src.src );
            attrToCheck = 'src';
            el = document.createElement('script');

            break;
        case 'link':
            resources = Array
              .from( document.querySelectorAll('link') )
              .map( src => src.href );
            attrToCheck = 'href';
            el = document.createElement('link');

            break;
      }
      // Check if it's not loaded yet
      if ( !resources.includes( scheme.Attributes[attrToCheck] ) ) {
        return new Promise(resolve => {
          el.onload = resolve;

          for (const key in scheme.Attributes) {
            if (scheme.Attributes.hasOwnProperty(key)) {
              el.setAttribute(key, scheme.Attributes[key]);
            }
          }

          document.body.appendChild(el);
          // TODO_HIGH: does not check whether script was actually found and loaded
          this.sendEventLoadedScript(event.RequestEventId, scheme);
        });
      }

    });

  }
}
