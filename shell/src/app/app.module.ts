import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';
import { createCustomElement } from '@angular/elements';

import { EventProxyLibModule } from '@uf-shared-libs/event-proxy-lib';

import { UFManagerComponent } from './uf-manager/uf-manager.component';
import { PrestartService } from './services/prestart.service';
import { ResourceLoaderService } from './services/resource-loader.service';

@NgModule({
  declarations: [
    UFManagerComponent
  ],
  imports: [
    BrowserModule,
    EventProxyLibModule
  ],
  providers: [ PrestartService, ResourceLoaderService],
  bootstrap: [],
  entryComponents: [UFManagerComponent]
})

export class AppModule {
  constructor(private injector: Injector) {}
  /**
   * do bootstrap for our micro frontends as custom elements
   */
  ngDoBootstrap(): void {
    const { injector } = this;

    const ngCustomElement1 = createCustomElement(UFManagerComponent, { injector });

    if (!customElements.get('uf-manager')) {
      customElements.define('uf-manager', ngCustomElement1); }
  }
}
