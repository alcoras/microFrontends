import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './meterial-module';
import { TableComponent } from './table/table.component';
import { MapComponent } from './map/map.component';
import { ValidationComponent } from './validation/validation.component';

import { EventProxyLibModule } from '@uf-shared-libs/event-proxy-lib';

@NgModule({
  declarations: [
    AppComponent,
    TableComponent,
    MapComponent,
    ValidationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    BrowserAnimationsModule,
    EventProxyLibModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
