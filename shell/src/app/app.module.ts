import { BrowserModule } from "@angular/platform-browser";
import { NgModule, APP_INITIALIZER } from "@angular/core";

import {  EventProxyLibModule } from "event-proxy-lib-src";

import { UFManagerService } from "./services/UFManagerService";
import { PrestartService } from "./services/PrestartService";
import { ResourceLoaderService } from "./services/ResourceLoaderService";
import { UFManagerServiceFactory } from "./services/UFManagerFactory";
import { AppComponent } from "./app.component";
import { AuthenticationService } from "./services/AuthenticationService";

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
    UFManagerService,
    AuthenticationService,
    {
      provide: APP_INITIALIZER,
      useFactory: UFManagerServiceFactory,
      deps: [UFManagerService],
      multi: false
    }
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
}
