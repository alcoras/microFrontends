import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';
import { createCustomElement } from '@angular/elements';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { EventButtonPressed } from '@uf-shared-events/index';
import { EventProxyLibModule, EventProxyLibService } from '@uf-shared-libs/event-proxy-lib';
import { uParts, uEventsIds } from '@uf-shared-models/event';
import { NewOccupComponent } from './new-occup/new-occup.component';
import { MaterialModule } from './meterial-module';

import { OccupTable3Component } from './occup-table3/occup-table3.component';

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
    HttpClientModule,
    EventProxyLibModule
  ],
  providers: [ EventProxyLibService ],
  entryComponents: [AppComponent]
})

export class AppModule {
  title = 'occupationsNg9';
  traceId = 1;

  sourceId: number = uParts.OccupationNg9;

  elToPlace: { [id: number]: string } = {};

  constructor(
    private injector: Injector,
    private eProxyService: EventProxyLibService) {

    this.eProxyService.startQNA(this.sourceId).subscribe(
      (value) => { this.parseNewEvent(value); },
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
        this.eProxyService.confirmEvents(this.sourceId, [element.AggregateId]).toPromise();
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
