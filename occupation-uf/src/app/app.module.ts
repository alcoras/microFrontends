import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, Injector, APP_INITIALIZER } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { EventProxyLibModule, EventProxyLibService } from '@uf-shared-libs/event-proxy-lib/';

import { AppComponent } from './app.component';

import { NewOccupComponent } from './new-occup/new-occup.component';
import { MaterialModule } from './meterial-module';

import { OccupTable3Component } from './occup-table3/occup-table3.component';
import { EventBusService } from './services/EventBus.service';
import { OccupationAPIService } from './services/OccupationAPI.service';
import { OccupationServiceFactory } from './services/Occupation.factory';
import { OccupationService } from './services/Occupation.service';

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
  entryComponents: [AppComponent]
})
export class AppModule {
  public constructor(private injector: Injector) { }

  public ngDoBootstrap(): void {
    const { injector } = this;

    const ngCustomElement = createCustomElement(AppComponent, { injector });

    if (!customElements.get('team-occupation-ng9')) {
      customElements.define('team-occupation-ng9', ngCustomElement); }
  }
}
