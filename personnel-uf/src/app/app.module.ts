import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, Injector } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';

import { EventProxyLibModule, EventProxyLibService } from '@uf-shared-libs/event-proxy-lib/';

import { AppComponent } from './app.component';
import { MagicComponent } from './magic/magic.component';
import { uParts, uEventsIds } from '@uf-shared-models/event';
import { EventButtonPressed } from '@uf-shared-events/index';

@NgModule({
  declarations: [
    AppComponent,
    MagicComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    EventProxyLibModule
  ],
  providers: [ EventProxyLibService, EventProxyLibService ],
  bootstrap: [],
  entryComponents: [AppComponent, MagicComponent]
})


export class AppModule {
  title = 'personnel';
  traceId = 1;

  sourceId: number = uParts.Personnel;

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
    this.elToPlace[uEventsIds.PerssonelButtonPressed] = '<team-personnel-2></team-personnel-2>';
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

  private processButtonPressed(element: EventButtonPressed) {
    switch (element.EventId) {
      case uEventsIds.PerssonelButtonPressed:
        this.putToElement(element.UniqueElementId, this.getElFromID(element.EventId));
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

    const ngCustomElement2 = createCustomElement(MagicComponent, { injector });

    if (!customElements.get('team-personnel-2')) {
      customElements.define('team-personnel-2', ngCustomElement2); }
  }
}
