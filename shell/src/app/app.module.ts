import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector, APP_INITIALIZER } from '@angular/core';
import { createCustomElement } from '@angular/elements';

import { EventProxyLibModule } from '@uf-shared-libs/event-proxy-lib';

import { UFManagerComponent } from './uf-manager/uf-manager.component';
import { PrestartService } from './services/prestart.service';
import { ResourceLoaderService } from './services/resource-loader.service';
import { UFManagerFactory } from './uf-manager/uf-manager.factory';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    EventProxyLibModule
  ],
  providers: [
    PrestartService,
    ResourceLoaderService,
    UFManagerComponent,
    { provide: APP_INITIALIZER, useFactory: UFManagerFactory, deps: [UFManagerComponent], multi: false}
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
  constructor() {}
  /**
   * do bootstrap for our micro frontends as custom elements
   */
  // ngDoBootstrap(): void {
  //    const { injector } = this;

  //    const ngCustomElement1 = createCustomElement(UFManagerComponent, { injector });

  //    if (!customElements.get('uf-manager')) {
  //      customElements.define('uf-manager', ngCustomElement1); }
  //  }
}
