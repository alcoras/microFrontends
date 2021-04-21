import { BrowserModule } from "@angular/platform-browser";
import { NgModule, Injector, APP_INITIALIZER } from "@angular/core";
import { createCustomElement } from "@angular/elements";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { MenuComponent } from "./MenuComponent";
import { FormsModule, ReactiveFormsModule} from "@angular/forms";

import { EventProxyLibModule } from "event-proxy-lib-src";
import { MaterialModule } from "./material-modules";
import { MenuService } from "./services/MenuService";
import { MenuServiceFactory } from "./services/MenuFactory";

@NgModule({
  declarations: [
    MenuComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    EventProxyLibModule,
  ],
  providers:[
    { provide: APP_INITIALIZER, useFactory: MenuServiceFactory, deps: [MenuService], multi: false}
  ],
  entryComponents: [MenuComponent]
})

export class MenuModule {
  public constructor(private injector: Injector) { }

  public ngDoBootstrap(): void {
    const { injector } = this;

    const ngCustomElement = createCustomElement(MenuComponent, { injector });

    if (!customElements.get("menu-team")) {
      customElements.define("menu-team", ngCustomElement); }
  }
}
