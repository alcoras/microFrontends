import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';
import { createCustomElement } from '@angular/elements';

import { AppComponent } from './app.component';
import { ScriptLoaderComponent } from './script-loader/script-loader.component';

@NgModule({
  declarations: [
    AppComponent,
    ScriptLoaderComponent
  ],
  imports: [
    BrowserModule,
  ],
  providers: [],
  bootstrap: [],
  entryComponents: [AppComponent]
})

export class AppModule
{
  constructor(private injector: Injector) {}

  ngDoBootstrap(): void
  {
    const { injector } = this;

    const ngCustomElement = createCustomElement(AppComponent, { injector });

    customElements.define('main-channel', ngCustomElement);
  }
}
