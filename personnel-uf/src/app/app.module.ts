import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, Injector, APP_INITIALIZER } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';

import { EventProxyLibModule, EventProxyLibService } from '@uf-shared-libs/event-proxy-lib/';

import { AppComponent } from './app.component';
import { MaterialModule } from './meterial-module';
import { PersonnelTableComponent } from './personnel-table/personnel-table.component';
import { NewPersonnelComponent } from './new-personnel/new-personnel.component';
import { EventBusService } from './services/EventBus.service';
import { PersonnelAPIService } from './services/PersonnelAPI.service';
import { PersonnelComponent } from './personnel/personnel.component';
import { PersonnelComponentFactory } from './personnel/personnel.factory';

@NgModule({
  declarations: [
    AppComponent,
    PersonnelTableComponent,
    NewPersonnelComponent
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
    PersonnelComponent,
    { provide: APP_INITIALIZER, useFactory: PersonnelComponentFactory, deps: [PersonnelComponent], multi: false}
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(
    private injector: Injector) {
  }

  // tslint:disable-next-line: member-access
  ngDoBootstrap(): void {
    const { injector } = this;

    const ngCustomElement2 = createCustomElement(PersonnelComponent, { injector });

    if (!customElements.get('team-personnel-2')) {
      customElements.define('team-personnel-2', ngCustomElement2); }
  }
}
