import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';
import { createCustomElement } from '@angular/elements';

import { EventProxyLibModule } from '@uf-shared-libs/event-proxy-lib';
import { ScriptLoaderComponent } from './script-loader/script-loader.component';
import { UFManagerComponent } from './uf-manager/uf-manager.component';
import { MessageService } from './msg.service';

@NgModule({
  declarations: [
    ScriptLoaderComponent,
    UFManagerComponent
  ],
  imports: [
    BrowserModule,
    EventProxyLibModule
  ],
  providers: [ MessageService ],
  bootstrap: [],
  entryComponents: [ScriptLoaderComponent, UFManagerComponent]
})

export class AppModule {
  constructor(private injector: Injector) {}

  ngDoBootstrap(): void {
    const { injector } = this;

    const ngCustomElement1 = createCustomElement(UFManagerComponent, { injector });
    const ngCustomElement2 = createCustomElement(ScriptLoaderComponent, { injector });

    customElements.define('uf-manager', ngCustomElement1);
    customElements.define('script-loader', ngCustomElement2);
  }
}
