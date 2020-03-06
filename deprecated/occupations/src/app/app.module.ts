import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, Injector } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';

import { MaterialModule } from './meterial-module';

import { AppComponent } from './app.component';
import { MagicComponent } from './magic/magic.component';

import { EventProxyLibModule, EventProxyLibService } from '@uf-shared-libs/event-proxy-lib';
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
    MaterialModule,
    EventProxyLibModule
  ],
  providers: [ EventProxyLibService ],
  bootstrap: [],
  entryComponents: [AppComponent, MagicComponent]
})


export class AppModule {
  title = 'occupations';
  traceId = 1;

  sourceId: number = uParts.Occupations;

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
    this.elToPlace[uEventsIds.OccupationButtonPressed] = '<team-occupations-2></team-occupations-2>';
  }

  private parseNewEvent(event: any) {
    event.forEach(element => {
        switch (element.EventId) {
          case uEventsIds.OccupationButtonPressed:
            this.processButtonPressed(element);
            break;
          default:
            throw new Error('Event not implemented.');
        }
    });
  }

  private processButtonPressed(element: EventButtonPressed) {
    switch (element.EventId) {
      case uEventsIds.OccupationButtonPressed:
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

    const ngCustomElement = createCustomElement(AppComponent, { injector });
    const ngCustomElement2 = createCustomElement(MagicComponent, { injector });

    customElements.define('team-occupations', ngCustomElement);
    customElements.define('team-occupations-2', ngCustomElement2);
  }
}
