import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, Injector, NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

import { EnvironmentService, EventProxyLibModule, EventProxyLibService } from 'event-proxy-lib';

import { AppComponent } from './app.component';
import { TranslatePipe } from './pipes/translate.pipe';

import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';

import { ProductService } from './services/ProductService';
import { createCustomElement } from '@angular/elements';

import { MaterialReceiptsService } from './services/MaterialReceiptsService';
import { MaterialsReceiptsAPI } from './services/MaterialsReceiptsAPI';
import { MaterialsReceiptsAPIMock } from './services/mocks/MaterialReceiptsAPIMock';
import { TableComponent } from './table/TableComponent';
import { EventBusService } from './services/EventBus.service';
import { IMaterialsReceiptsAPI } from './interfaces/IMaterialsReceiptsAPI';
import { EnvironmentTypes } from 'src/environments/EnvironmentTypes';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { EventProxyLibServiceMock } from './services/mocks/EventProxyLibServiceMock';
import { TabViewModule } from 'primeng/tabview';

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
function MaterialReceiptsInitializeFactory(provider: MaterialReceiptsService): Promise<void> {
  if (environment.EnvironmentTypes == EnvironmentTypes.Solo)
    return Promise.resolve();

  return new Promise( (res) => {
    provider.InitAsync().then( () => {
      provider.StartQNA();
      res();
    });
  });
}

@NgModule({
  declarations: [
    AppComponent,
    TableComponent,
    TranslatePipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    TableModule,
    FormsModule,
    DialogModule,
    TabViewModule,
    ButtonModule,
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
      deps: [MaterialReceiptsService],
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
