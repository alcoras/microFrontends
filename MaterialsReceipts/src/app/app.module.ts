import { HttpClient } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, Injector, NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { createCustomElement } from '@angular/elements';

import { EnvironmentService, EnvironmentTypes, EventProxyLibModule, EventProxyLibService } from 'event-proxy-lib-src';

import { AppComponent } from './app.component';
import { TranslatePipe } from './pipes/TranslatePipe';

import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TabViewModule } from 'primeng/tabview';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';

import { ProductService } from './services/ProductService';
import { MaterialsReceiptsService } from './services/MaterialsReceiptsService';
import { MaterialsReceiptsAPI } from './services/MaterialsReceiptsAPI';
import { MaterialsReceiptsAPIMock } from './services/mocks/MaterialReceiptsAPIMock';
import { EventProxyLibServiceMock } from './services/mocks/EventProxyLibServiceMock';
import { EventBusService } from './services/EventBus.service';
import { IMaterialsReceiptsAPI } from './Models/index';

import { MaterialsReceiptsTableComponent } from './MaterialsReceiptsTable/MaterialsReceiptsTableComponent';
import { MaterialsReceiptsListComponent } from './MaterialsReceiptsList/MaterialsReceiptsListComponent';

import { environment } from 'src/environments/environment';

/**
 * Materials Receipts factory
 * @param eventProxyLibService env service
 * @param eventBusService event bus
 * @returns Mock or real
 */
const MaterialsReceiptsAPIFactory =
(eventProxyLibService: EventProxyLibService,
  eventBusService: EventBusService): IMaterialsReceiptsAPI => {
 if (environment.EnvironmentTypes == EnvironmentTypes.Solo) {
   return new MaterialsReceiptsAPIMock();
 } else {
   return new MaterialsReceiptsAPI(eventProxyLibService, eventBusService);
 }
};

/**
 * Event Proxy Library factory
 * @param envService Env
 * @param httpClient http
 * @returns Mock or real
 */
const EventProxyLibFacotry =
(envService: EnvironmentService,
  httpClient: HttpClient): unknown => {
  if (environment.EnvironmentTypes == EnvironmentTypes.Solo) {
    return new EventProxyLibServiceMock();
  } else {
    return new EventProxyLibService(envService, httpClient);
  }
}

/**
 * Service factory
 * @param provider Class/Service/Component to create
 * @returns Promise
 */
function MaterialReceiptsInitializeFactory(provider: MaterialsReceiptsService): Promise<void> {
  if (environment.EnvironmentTypes == EnvironmentTypes.Solo)
    return Promise.resolve();

  return new Promise( (res) => {
    provider.InitAsync().then( () => {
      provider.InitializeConnectionWithBackend();
      res();
    });
  });
}

@NgModule({
  declarations: [
    AppComponent,
    MaterialsReceiptsListComponent,
    TranslatePipe,
    MaterialsReceiptsTableComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    TableModule,
    FormsModule,
    DialogModule,
    CalendarModule,
    TabViewModule,
    ButtonModule,
    CheckboxModule,
    RadioButtonModule,
    InputTextModule,
    EventProxyLibModule
  ],
  providers: [
    ProductService,
    {
      provide: EventProxyLibService,
      useFactory: EventProxyLibFacotry,
      deps: [ EnvironmentService, HttpClient],
      multi: false
    },
    {
      provide: MaterialsReceiptsAPI,
      useFactory: MaterialsReceiptsAPIFactory,
      deps: [ EventProxyLibService, EventBusService],
      multi: false
    },
    {
      provide: APP_INITIALIZER,
      useFactory: MaterialReceiptsInitializeFactory,
      deps: [MaterialsReceiptsService],
      multi: false
    }
  ],
  entryComponents: [AppComponent]
})
export class AppModule {
  public constructor(private injector: Injector) { }

  public ngDoBootstrap(): void {
    const { injector } = this;

    const ngCustomElement2 = createCustomElement(AppComponent, { injector });

    if (!customElements.get('material-receipts')) {
      customElements.define('material-receipts', ngCustomElement2); }
  }
}
