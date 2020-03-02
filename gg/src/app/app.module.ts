import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';
import { createCustomElement } from '@angular/elements';

import { AppComponent } from './app.component';
import { ScriptLoaderComponent } from './script-loader/script-loader.component';
import { EventProxyLibModule } from '@uf-shared-libs/event-proxy-lib';

@NgModule({
  declarations: [
    AppComponent,
    ScriptLoaderComponent
  ],
  imports: [
    BrowserModule,
    EventProxyLibModule
  ],
  providers: [],
  bootstrap: [],
  entryComponents: [AppComponent, ScriptLoaderComponent]
})

export class AppModule {
  constructor(private injector: Injector) {}

  ngDoBootstrap(): void {
    const { injector } = this;

    const ngCustomElement = createCustomElement(AppComponent, { injector });
    const ngCustomElement2 = createCustomElement(ScriptLoaderComponent, { injector });

    customElements.define('main-channel', ngCustomElement);
    customElements.define('script-loader', ngCustomElement2);
  }
}
