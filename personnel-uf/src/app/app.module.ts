import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, Injector, OnInit } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';

import { EventProxyLibModule, EventProxyLibService } from '@uf-shared-libs/event-proxy-lib/';

import { AppComponent } from './app.component';
import { uParts, uEventsIds } from '@uf-shared-models/event';
import { EventButtonPressed } from '@uf-shared-events/index';
import { MaterialModule } from './meterial-module';
import { PersonnelTableComponent } from './personnel-table/personnel-table.component';
import { NewPersonnelComponent } from './new-personnel/new-personnel.component';

@NgModule({
  declarations: [
    AppComponent,
    PersonnelTableComponent,
    NewPersonnelComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    EventProxyLibModule,
  ],
  providers: [ EventProxyLibService, EventProxyLibService ],
  bootstrap: [],
  entryComponents: [AppComponent]
})
export class AppModule {
  title = 'personnel';
  traceId = 1;

  sourceId: string = uParts.Personnel;

  elToPlace: { [id: number]: string } = {};

  constructor(
    private injector: Injector,
    private eProxyService: EventProxyLibService) {
      // this.Init();
  }

  private preparePlacements() {
    this.elToPlace[uEventsIds.PerssonelButtonPressed] = '<team-personnel-2></team-personnel-2>';
  }

  private Init() {
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

  private parseNewEvent(event: any) {
    event.forEach(element => {
      this.eProxyService.confirmEvents(this.sourceId, [element.AggregateId]).toPromise();
      switch (element.EventId) {
        case uEventsIds.PerssonelButtonPressed:
          this.processButtonPressed(element);
          break;
        default:
          throw new Error('Event not implemented.');
      }
    });
  }

  private processButtonPressed(event: EventButtonPressed) {
    switch (event.EventId) {
      case uEventsIds.PerssonelButtonPressed:
        if (event.UniqueElementId) {
          this.putToElement(event.UniqueElementId, this.getElFromID(event.EventId));
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

    const ngCustomElement2 = createCustomElement(AppComponent, { injector });

    if (!customElements.get('team-personnel-2')) {
      customElements.define('team-personnel-2', ngCustomElement2); }
  }
}
