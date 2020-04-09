import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { EventProxyLibModule } from '@uf-shared-libs/event-proxy-lib/public-api';

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
