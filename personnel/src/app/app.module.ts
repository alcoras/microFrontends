import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';
import { createCustomElement } from '@angular/elements';

import { AppComponent } from './app.component';
import { MagicComponent } from './magic/magic.component';
import { EventProxyLibModule } from '@uf-shared-libs/event-proxy-lib';

@NgModule({
  declarations: [
    AppComponent,
    MagicComponent
  ],
  imports: [
    BrowserModule,
    EventProxyLibModule
  ],
  providers: [],
  bootstrap: [],
  entryComponents: [AppComponent, MagicComponent]
})

export class AppModule
{
  constructor(private injector: Injector) {}

  ngDoBootstrap(): void
  {
    const { injector } = this;

    const ngCustomElement = createCustomElement(AppComponent, { injector });
    const ngCustomElement2 = createCustomElement(MagicComponent, { injector });

    customElements.define('team-personnel', ngCustomElement);
    customElements.define('team-personnel-2', ngCustomElement2);
  }
}
