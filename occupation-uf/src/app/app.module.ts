import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { EventButtonPressed } from '@uf-shared-events/index';
import { EventProxyLibModule, EventProxyLibService } from '@uf-shared-libs/event-proxy-lib/';
import { uEventsIds, UParts } from '@uf-shared-models/index';
import { NewOccupComponent } from './new-occup/new-occup.component';
import { MaterialModule } from './meterial-module';

import { OccupTable3Component } from './occup-table3/occup-table3.component';
import { EventBusService } from './services/EventBus.service';
import { OccupationAPIService } from './services/OccupationAPI.service';

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
  title = 'occupation';
  traceId = 1;

  sourceId: string = UParts.Occupations.SourceId;

  elToPlace: { [id: number]: string } = {};

  constructor(
    private injector: Injector,
    private eProxyService: EventProxyLibService) {

    this.eProxyService.StartQNA(this.sourceId).subscribe(
      (value) => {
        if (!value.body) { return; }

        if (!value.body.hasOwnProperty('EventId')) {
          throw new Error('No EventId in message');
        }

        if (value.body['EventId'] === uEventsIds.GetNewEvents) {
          this.parseNewEvent(value.body.Events);
        }
      },
      (error) => { console.log(this.title, error); },
      () => {}
    );

    this.preparePlacements();
  }

  private preparePlacements() {
    this.elToPlace[uEventsIds.OccupationNg9ButtonPressed] = '<team-occupation-ng9></team-occupation-ng9>';
  }

  private parseNewEvent(event: any) {
    event.forEach(element => {
        this.eProxyService.ConfirmEvents(this.sourceId, [element.AggregateId]).toPromise();
        switch (element.EventId) {
          case uEventsIds.OccupationNg9ButtonPressed:
            this.processButtonPressed(element);
            break;
          default:
            throw new Error('Event not implemented.');
        }
    });
  }

  private processButtonPressed(element: EventButtonPressed) {
    switch (element.EventId) {
      case uEventsIds.OccupationNg9ButtonPressed:
        if (element.UniqueElementId) {
          this.putToElement(element.UniqueElementId, this.getElFromID(element.EventId));
        }
        break;
    }
  }

  private putToElement(elName: string, elToPut: string) {
    let element: HTMLElement;
    element = document.getElementById(elName);
    element.innerHTML = elToPut;
  }

  private getElFromID(id: number): string {
    const elId = this.elToPlace[id];

    if (!elId) {
      throw new Error('Unsupported ButtonPressed Id');
    }

    return elId;
  }

  ngDoBootstrap(): void {
    const { injector } = this;

    const ngCustomElement = createCustomElement(AppComponent, { injector });

    if (!customElements.get('team-occupation-ng9')) {
      customElements.define('team-occupation-ng9', ngCustomElement); }
  }
}
