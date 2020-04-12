import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';

import { EventProxyLibModule, EventProxyLibService } from '@uf-shared-libs/event-proxy-lib';
import { uEventsIds, uParts } from '@uf-shared-models/event';
import { MaterialModule } from './material-modules';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    HttpClientModule,
    EventProxyLibModule,
  ],
  entryComponents: [AppComponent]
})

export class AppModule {
  title = 'menu';
  traceId = 1;

  sourceId: string = uParts.Menu;

  elToPlace: { [id: number]: string } = {};

  constructor(
    private injector: Injector,
    private eProxyService: EventProxyLibService
  ) {
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
  }

  private parseNewEvent(event: any) {
    event.forEach(async (element) => {
        switch (element.EventId) {
          case uEventsIds.InitMenu:
            this.eProxyService.ConfirmEvents(this.sourceId, [element.AggregateId]).toPromise();
            this.putToElement('menu-team', '<menu-team></menu-team>');
            break;
          default:
            throw new Error('Event not implemented.');
        }
    });
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

    if (!customElements.get('menu-team')) {
      customElements.define('menu-team', ngCustomElement); }
  }
}
