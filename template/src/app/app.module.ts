import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, Injector, NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

import { EventProxyLibModule, EventProxyLibService } from 'event-proxy-lib-src';

import { AppComponent } from './app.component';
import { createCustomElement } from '@angular/elements';

import { <project_name>Factory } from './services/<project_name>Factory';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    EventProxyLibModule
  ],
  providers: [
    EventProxyLibService,
    {
      provide: APP_INITIALIZER,
      useFactory: <project_name>Factory,
      deps: [ <project_name>Service],
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

    if (!customElements.get('<project_name>')) {
      customElements.define('<project_name>', ngCustomElement2); }
  }
}
