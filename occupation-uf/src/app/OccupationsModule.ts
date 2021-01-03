import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, Injector, APP_INITIALIZER } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { EventProxyLibModule, EventProxyLibService } from 'event-proxy-lib-src';

import { OccupationsComponent } from './OccupationsComponent';

import { NewOccupComponent } from './new-occup/new-occup.component';
import { MaterialModule } from './meterial-module';

import { OccupTable3Component } from './occup-table3/occup-table3.component';
import { EventBusService } from './services/EventBusService';
import { OccupationAPIService } from './services/OccupationAPI';
import { OccupationServiceFactory } from './services/OccupationFactory';
import { OccupationService } from './services/OccupationService';

/**
 * Main entry component for occupation micro frontend
 */
@NgModule({
  declarations: [
    OccupationsComponent,
    OccupTable3Component,
    NewOccupComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    EventProxyLibModule
  ],
  providers: [
    EventProxyLibService,
    EventBusService,
    OccupationAPIService,
    { provide: APP_INITIALIZER, useFactory: OccupationServiceFactory, deps: [OccupationService], multi: false}
  ],
  entryComponents: [OccupationsComponent]
})
export class OccupationsModule {
  public constructor(private injector: Injector) { }

  public ngDoBootstrap(): void {
    const { injector } = this;

    const ngCustomElement = createCustomElement(OccupationsComponent, { injector });

    if (!customElements.get('team-occupation-ng9')) {
      customElements.define('team-occupation-ng9', ngCustomElement); }
  }
}
