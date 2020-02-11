import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';

import { MaterialModule } from "./meterial-module";
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
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

    customElements.define('menu-team', ngCustomElement);
  }
}
