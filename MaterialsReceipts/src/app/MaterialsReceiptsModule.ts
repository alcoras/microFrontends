import { HttpClient } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, Injector, NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { createCustomElement } from '@angular/elements';

import {
  EnvironmentService,
  EnvironmentTypes,
  EventProxyLibModule,
  EventProxyLibService } from 'event-proxy-lib-src';

import { MaterialsReceiptsComponent } from './MaterialsReceiptsComponent';
import { TranslatePipe } from './Components/Pipes/TranslatePipe';
import { ScanTableComponent } from './Components/ScanTable/ScanTableComponent';

import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TabViewModule } from 'primeng/tabview';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CardModule } from 'primeng/card';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { InputNumberModule } from 'primeng/inputnumber';

import { ProductService } from './services/ProductService';
import { CastorAPI } from '@shared/services/CastorAPI';

import { MaterialsReceiptsService } from './services/MaterialsReceiptsService';
import { MaterialsReceiptsAPI } from './services/MaterialsReceiptsAPI';
import { EventProxyLibServiceMock } from './services/mocks/EventProxyLibServiceMock';
import { EventBusService } from './services/EventBusService';

import { MaterialsReceiptsTableComponent } from './Components/MaterialsReceiptsTable/MaterialsReceiptsTableComponent';
import { MaterialsReceiptsListComponent } from './Components/MaterialsReceiptsList/MaterialsReceiptsListComponent';
import { LocationsTableComponent } from './Components/LocationsTable/LocationsTableComponent';
import { MaterialsAtLocationComponent } from './Components/MaterialsAtLocation/MaterialsAtLocationComponent';
import { MaterialsTableComponent } from './Components/MaterialsTable/MaterialsTableComponent';
import { SelectMaterialDialog } from './Components/Dialogs/SelectMaterialDialog/SelectMaterialDialog';

import { environment } from 'src/environments/environment';

/**
 * Materials Receipts factory
 * @param eventProxyLibService env service
 * @param eventBusService event bus
 * @returns Mock or real
 */
const MaterialsReceiptsAPIFactory = (eventProxyLibService: EventProxyLibService, eventBusService: EventBusService) => {
  return new MaterialsReceiptsAPI(eventProxyLibService, eventBusService);
};

/**
 * Event Proxy Library factory
 * @param envService Env
 * @param httpClient http
 * @returns Mock or real
 */
const EventProxyLibFacotry = (envService: EnvironmentService, httpClient: HttpClient): unknown => {
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
    MaterialsReceiptsComponent,
    MaterialsReceiptsListComponent,
    TranslatePipe,
    MaterialsReceiptsTableComponent,
    ScanTableComponent,
    LocationsTableComponent,
    MaterialsAtLocationComponent,
    MaterialsTableComponent,
    SelectMaterialDialog
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    DynamicDialogModule,
    TableModule,
    FormsModule,
    DialogModule,
    CalendarModule,
    TabViewModule,
    ButtonModule,
    CheckboxModule,
    RadioButtonModule,
    InputTextModule,
    InputNumberModule,
    CardModule,
    EventProxyLibModule,
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
    },
    CastorAPI
  ],
  entryComponents: [MaterialsReceiptsComponent]
})
export class MaterialsReceiptsModule {
  public constructor(private injector: Injector) { }

  public ngDoBootstrap(): void {
    const { injector } = this;

    const ngCustomElement2 = createCustomElement(MaterialsReceiptsComponent, { injector });

    if (!customElements.get('material-receipts')) {
      customElements.define('material-receipts', ngCustomElement2);
    }
  }
}
