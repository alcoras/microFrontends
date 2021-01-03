import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, Injector, APP_INITIALIZER } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';

import { EventProxyLibModule, EventProxyLibService } from 'event-proxy-lib-src';

import { PersonnelComponent } from './PersonnelComponent';
import { MaterialModule } from './meterial-module';
import { NewPersonnelComponent } from './new-personnel/new-personnel.component';
import { EventBusService } from './services/EventBus.service';
import { PersonnelAPIService } from './services/PersonnelAPI.service';
import { PersonnelService } from './services/PersonnelService';
import { PersonnelServiceFactory } from './services/PersonnelFactory';
import { PersonnelTable2Component } from './personnel-table-2/personnel-table.component';

@NgModule({
  declarations: [
    PersonnelComponent,
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
    {
      provide: APP_INITIALIZER,
      useFactory: PersonnelServiceFactory,
      deps: [PersonnelService],
      multi: false
    }
  ],
  entryComponents: [PersonnelComponent],
})
export class PersonnelModule {
  public constructor(private injector: Injector) { }

  public ngDoBootstrap(): void {
    const { injector } = this;

    const ngCustomElement2 = createCustomElement(PersonnelComponent, { injector });

    if (!customElements.get('team-personnel-2')) {
      customElements.define('team-personnel-2', ngCustomElement2); }
  }
}
