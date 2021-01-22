import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, Injector, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

import { EventProxyLibModule, EventProxyLibService } from 'event-proxy-lib-src';

import { PrimeNgModules } from './PrimeNgModules';

import { createCustomElement } from '@angular/elements';

import { WunderMobilityFactory } from './services/WunderMobilityFactory';
import { WunderMobilityService } from './services/WunderMobilityService';

import { WunderMobilityComponent } from './Components/WunderMobilityComponent';

@NgModule({
  declarations: [
    WunderMobilityComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    CommonModule,
    BrowserAnimationsModule,
    EventProxyLibModule,
    PrimeNgModules
  ],
  providers: [
    EventProxyLibService,
    {
      provide: APP_INITIALIZER,
      useFactory: WunderMobilityFactory,
      deps: [ WunderMobilityService ],
      multi: false
    }
  ],
  entryComponents: [WunderMobilityComponent]
})
export class WunderMobilityModule {
  public constructor(private injector: Injector) { }

  public ngDoBootstrap(): void {
    const { injector } = this;

    const ngCustomElement2 = createCustomElement(WunderMobilityComponent, { injector });

    if (!customElements.get('wunder-mobility')) {
      customElements.define('wunder-mobility', ngCustomElement2); }
  }
}
