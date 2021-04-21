import { BrowserModule } from "@angular/platform-browser";
import { APP_INITIALIZER, Injector, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule } from "@angular/forms";

import { EventProxyLibModule, EventProxyLibService } from "event-proxy-lib-src";

import { PrimeNgModules } from "./PrimeNgModules";

import { createCustomElement } from "@angular/elements";

import { WunderMobilityFactory } from "./Services/WunderMobilityFactory";
import { WunderMobilityService } from "./Services/WunderMobilityService";

import { WunderMobilityComponent } from "./Components/WunderMobilityComponent";
import { ProductsTableComponent } from "./Components/ProductsTable/ProductsTableComponent";
import { WunderMobilityAPI } from "./Services/WunderMobilityAPI";
import { BuyTableComponent } from "./Components/BuyTable/BuyTableComponent";

@NgModule({
  declarations: [
    WunderMobilityComponent,
    ProductsTableComponent,
    BuyTableComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    CommonModule,
    BrowserAnimationsModule,
    EventProxyLibModule,
    PrimeNgModules
  ],
  providers: [
    EventProxyLibService,
    WunderMobilityAPI,
    {
      provide: APP_INITIALIZER,
      useFactory: WunderMobilityFactory,
      deps: [ WunderMobilityService ],
      multi: false
    }
  ],
  entryComponents: [WunderMobilityComponent]
})
export class WunderMobilityModule {
  public constructor(private injector: Injector) { }

  public ngDoBootstrap(): void {
    const { injector } = this;

    const ngCustomElement2 = createCustomElement(WunderMobilityComponent, { injector });

    if (!customElements.get("wunder-mobility")) {
      customElements.define("wunder-mobility", ngCustomElement2); }
  }
}
