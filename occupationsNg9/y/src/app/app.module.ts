import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';
import { createCustomElement } from '@angular/elements';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './meterial-module';
import { OccupTableComponent } from './occup-table/occup-table.component';
import { OccupTable2Component } from './occup-table2/occup-table2.component';
import { OccupTable3Component } from './occup-table3/occup-table3.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    OccupTableComponent,
    OccupTable2Component,
    OccupTable3Component
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule
  ],
  providers: [],
  entryComponents: [AppComponent]
})
export class AppModule {
  constructor(private injector: Injector) {}

  ngDoBootstrap(): void {
    const { injector } = this;

    const ngCustomElement = createCustomElement(AppComponent, { injector });

    customElements.define('team-occupation-ng9', ngCustomElement);
  }
}
