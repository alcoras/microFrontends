import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { EventProxyLibModule } from "event-proxy-lib-src";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    EventProxyLibModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
