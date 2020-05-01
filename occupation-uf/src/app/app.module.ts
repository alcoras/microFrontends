import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { EventButtonPressed, SubscibeToEvent } from '@uf-shared-events/index';
import { EventProxyLibModule, EventProxyLibService } from '@uf-shared-libs/event-proxy-lib/';
import { uEventsIds, UParts, EventResponse } from '@uf-shared-models/index';
import { NewOccupComponent } from './new-occup/new-occup.component';
import { MaterialModule } from './meterial-module';

import { OccupTable3Component } from './occup-table3/occup-table3.component';
import { EventBusService } from './services/EventBus.service';
import { OccupationAPIService } from './services/OccupationAPI.service';
import { HttpResponse } from '@angular/common/http';

/**
 * Main entry component for occupation micro frontend
 */
@NgModule({
  declarations: [
    AppComponent,
    OccupTable3Component,
    NewOccupComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    EventProxyLibModule
  ],
  providers: [
    EventProxyLibService,
    EventBusService,
    OccupationAPIService
  ],
  entryComponents: [AppComponent]
})

export class AppModule {
  /**
   * Source id of occupation component
   */
  private sourceId: string = UParts.Occupations.SourceId;

  /**
   * Source name of occupation component
   */
  private sourceName: string = UParts.Occupations.SourceName;

  /**
   * Element to place dictionary
   */
  private elToPlace: { [id: number]: string } = {};

  constructor(
    private injector: Injector,
    private eventBusService: EventBusService,
    private eProxyService: EventProxyLibService) {

    this.StartQNA();
    this.subscribeToEventsAsync();
    this.preparePlacements();
  }

  /**
   * Starts qna with backend
   */
  public StartQNA() {
    this.eProxyService.StartQNA(this.sourceId).subscribe(
      (response: HttpResponse<any>) => {
        this.newHttpResponseAsync(response);
      },
      (error) => { console.error(this.sourceName, error); },
      () => { }
    );
  }

  /**
   * Parses new http response
   * @param response HttpResponse
   */
  private async newHttpResponseAsync(response: HttpResponse<any>) {
    if (!response) {
      throw new Error('Can\'t connect to backend');
    }

    if (!response.body) { return; }

    if (!response.body.hasOwnProperty('EventId')) {
      throw new Error('No EventId in message');
    }

    if (response.body['EventId'] === uEventsIds.GetNewEvents) {
      this.parseNewEvent(response);
    }
  }

  /**
   * Prepares placements for components
   */
  private preparePlacements() {
    this.elToPlace[uEventsIds.OccupationNg9ButtonPressed] = '<team-occupation-ng9></team-occupation-ng9>';
  }

  /**
   * Parses new events
   * @param event HttpResposne with event list
   */
  private parseNewEvent(event: HttpResponse<EventResponse>) {
    event.body.Events.forEach(element => {
      // tslint:disable-next-line: no-small-switch
      switch (element.EventId) {
        case uEventsIds.OccupationNg9ButtonPressed:
            if (this.processButtonPressed(element)) {
              this.eProxyService.ConfirmEvents(this.sourceId, [element.AggregateId]).toPromise();
            } else {
              throw new Error('Did not proccess after processButtonPressed');
            }
            break;
          case uEventsIds.OccupationsRead:
            this.eventBusService.EventBus.next(element);
            break;
          default:
            throw new Error('Event not implemented.');
        }
    });
  }

  /**
   * Subscribes to events which this micro frontend is responsible for
   * @returns Promise
   */
  private async subscribeToEventsAsync(): Promise<HttpResponse<any>> {
    const e = new SubscibeToEvent(
      this.sourceId, [
      [uEventsIds.OccupationsRead, 0, 0]
    ]);

    e.SourceName = this.sourceName;

    return this.eProxyService.DispatchEvent(e).toPromise();
  }

  /**
   * Process button pressed event
   * @param event EventButtonPressed
   */
  private processButtonPressed(element: any) {
    const e = element as EventButtonPressed;

    // TODO: remove tslint:disable.. after one more case in switch
    // tslint:disable-next-line: no-small-switch
    switch (e.EventId) {
      case uEventsIds.OccupationNg9ButtonPressed:
        if (element.UniqueElementId) {
          this.putToElement(element.UniqueElementId, this.getElFromID(element.EventId));
          return true;
        }
        break;
    }

    return false;
  }

  /**
   * Puts to element to DOm
   * @param elName element name to put in
   * @param elToPut element name to put
   */
  private putToElement(elName: string, elToPut: string) {
    let element: HTMLElement;
    element = document.getElementById(elName);
    element.innerHTML = elToPut;
  }

  /**
   * Gets element by id
   * @param id number of elment
   * @returns name of element
   */
  private getElFromID(id: number): string {
    const elId = this.elToPlace[id];

    if (!elId) {
      throw new Error('Unsupported ButtonPressed Id');
    }

    return elId;
  }

  // tslint:disable
  ngDoBootstrap(): void {
    const { injector } = this;

    const ngCustomElement = createCustomElement(AppComponent, { injector });

    if (!customElements.get('team-occupation-ng9')) {
      customElements.define('team-occupation-ng9', ngCustomElement); }
  }
  // tslint:eanble
}
