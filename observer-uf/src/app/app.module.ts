import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, Injector, NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { EventProxyLibModule, EventProxyLibService } from 'event-proxy-lib-src';

import { AppComponent } from './app.component';
import { createCustomElement } from '@angular/elements';

import { OccupationServiceFactory } from './services/ObserverFactory';
import { ObserverService } from './services/ObserverService';
import { ObserverAPI } from './services/ObserverAPI';
import { TraceTableComponent } from './TraceTable/TraceTableComponent';
import { PrimeNgImportModule } from './PrimeNgImportModule';
import { MapComponent } from './Map/MapComponent';


@NgModule({
  declarations: [
    AppComponent,
    TraceTableComponent,
    MapComponent
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
  entryComponents: [AppComponent]
})
export class AppModule {
  public constructor(private injector: Injector) { }

  public ngDoBootstrap(): void {
    const { injector } = this;

    const ngCustomElement2 = createCustomElement(AppComponent, { injector });

    if (!customElements.get('team-observer')) {
      customElements.define('team-observer', ngCustomElement2); }
  }
}
