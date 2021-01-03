import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, Injector, NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { EventProxyLibModule, EventProxyLibService } from 'event-proxy-lib-src';

import { ObserverComponent } from './ObserverComponent';
import { createCustomElement } from '@angular/elements';

import { OccupationServiceFactory } from './services/ObserverFactory';
import { ObserverService } from './services/ObserverService';
import { ObserverAPI } from './services/ObserverAPI';
import { TraceTableComponent } from './TraceTable/TraceTableComponent';
import { PrimeNgImportModule } from './PrimeNgImportModule';

@NgModule({
  declarations: [
    ObserverComponent,
    TraceTableComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    PrimeNgImportModule,
    EventProxyLibModule,
  ],
  providers: [
    EventProxyLibService,
    ObserverAPI,
    {
      provide: APP_INITIALIZER,
      useFactory: OccupationServiceFactory,
      deps: [ ObserverService ],
      multi: false
    }
  ],
  entryComponents: [ObserverComponent]
})
export class ObserverModule {
  public constructor(private injector: Injector) { }

  public ngDoBootstrap(): void {
    const { injector } = this;

    const ngCustomElement2 = createCustomElement(ObserverComponent, { injector });

    if (!customElements.get('team-observer')) {
      customElements.define('team-observer', ngCustomElement2); }
  }
}
