import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, Injector, APP_INITIALIZER } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';

import { EventProxyLibModule, EventProxyLibService } from '@uf-shared-libs/event-proxy-lib/';

import { AppComponent } from './app.component';
import { MaterialModule } from './meterial-module';
import { NewPersonnelComponent } from './new-personnel/new-personnel.component';
import { EventBusService } from './services/EventBus.service';
import { PersonnelAPIService } from './services/PersonnelAPI.service';
import { PersonnelComponent } from './personnel/personnel.component';
import { PersonnelComponentFactory } from './personnel/personnel.factory';
import { PersonnelTable2Component } from './personnel-table-2/personnel-table.component';

@NgModule({
  declarations: [
    AppComponent,
    PersonnelTable2Component,
    NewPersonnelComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    EventProxyLibModule,
  ],
  providers: [
    EventProxyLibService,
    EventBusService,
    PersonnelAPIService,
    { provide: APP_INITIALIZER, useFactory: PersonnelComponentFactory, deps: [PersonnelComponent], multi: false}
  ],
  entryComponents: [AppComponent],
})
export class AppModule {
  public constructor(private injector: Injector) {
  }

  public ngDoBootstrap(): void {
    const { injector } = this;

    const ngCustomElement2 = createCustomElement(AppComponent, { injector });

    if (!customElements.get('team-personnel-2')) {
      customElements.define('team-personnel-2', ngCustomElement2); }
  }
}
