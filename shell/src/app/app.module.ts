import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';

import { EventProxyLibModule } from '@uf-shared-libs/event-proxy-lib';

import { UFManagerComponent } from './uf-manager/uf-manager.component';
import { PrestartService } from './services/prestart.service';
import { ResourceLoaderService } from './services/resource-loader.service';
import { UFManagerFactory } from './uf-manager/uf-manager.factory';
import { AppComponent } from './app.component';

/**
 * Entry point module
 */
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
}
