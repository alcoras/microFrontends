import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, Injector, NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

import { EventProxyLibModule, EventProxyLibService } from 'event-proxy-lib-src';

import { AppComponent } from './app.component';
import { createCustomElement } from '@angular/elements';

import { WunderMobilityFactory } from './services/WunderMobilityFactory';
import { WunderMobilityService } from './services/WunderMobilityService';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    EventProxyLibModule
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
  entryComponents: [AppComponent]
})
export class AppModule {
  public constructor(private injector: Injector) { }

  public ngDoBootstrap(): void {
    const { injector } = this;

    const ngCustomElement2 = createCustomElement(AppComponent, { injector });

    if (!customElements.get('wunder-mobility')) {
      customElements.define('wunder-mobility', ngCustomElement2); }
  }
}
