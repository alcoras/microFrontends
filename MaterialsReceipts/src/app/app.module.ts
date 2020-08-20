import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, Injector, NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

import { EventProxyLibModule, EventProxyLibService } from 'event-proxy-lib';

import { AppComponent } from './app.component';
import { TranslatePipe } from './pipes/translate.pipe';

import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ProductService } from './services/ProductService';
import { createCustomElement } from '@angular/elements';

import { MaterialReceiptsInitializeFactory }
from './services/MaterialReceiptsFactory';

import { MaterialReceiptsService } from './services/MaterialReceiptsService';

@NgModule({
  declarations: [
    AppComponent,
    TranslatePipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ButtonModule,
    TableModule,
    FormsModule,
    EventProxyLibModule
  ],
  providers: [
    ProductService,
    EventProxyLibService,
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
