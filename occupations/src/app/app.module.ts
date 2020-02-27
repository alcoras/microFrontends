import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, Injector } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';

import { MaterialModule } from "./meterial-module";

import { AppComponent } from './app.component';
import { MagicComponent } from './magic/magic.component';

@NgModule({
  declarations: [
    AppComponent,
    MagicComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
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

    customElements.define('team-occupations', ngCustomElement);
    customElements.define('team-occupations-2', ngCustomElement2);
  }
}
