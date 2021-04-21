import { BrowserModule } from "@angular/platform-browser";
import { APP_INITIALIZER, Injector, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule } from "@angular/forms";

import { EventProxyLibModule, EventProxyLibService } from "event-proxy-lib-src";

import { createCustomElement } from "@angular/elements";

import { $project_name$Component } from "./$project_name$Component";
import { $project_name$Service } from "./$project_name$Service";

/**
 * Service factory used to prepare event-proxy-lib interface before connecting
 * @param provider Class/Service/Component to create
 * @returns Promise
 */
function $project_name$Factory(provider: $project_name$Service): Promise<void> {
  return new Promise( (res) => {
    provider.InitAsync().then( () => {
      provider.InitializeConnectionWithBackend();
      res();
    });
  });
}

@NgModule({
  declarations: [
    $project_name$Component,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    CommonModule,
    BrowserAnimationsModule,
    EventProxyLibModule
  ],
  providers: [
    EventProxyLibService,
    {
      provide: APP_INITIALIZER,
      useFactory: $project_name$Factory,
      deps: [ $project_name$Service ],
      multi: false
    }
  ],
  entryComponents: [$project_name$Component]
})
export class $project_name$Module {
  public constructor(private injector: Injector) { }

  public ngDoBootstrap(): void {
    const { injector } = this;

    const ngCustomElement2 = createCustomElement($project_name$Component, { injector });

    if (!customElements.get("$project_name_html$")) {
      customElements.define("$project_name_html$", ngCustomElement2); }
  }
}
