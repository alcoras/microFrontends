import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector, APP_INITIALIZER } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';

import { EventProxyLibModule } from 'event-proxy-lib-src'
;
import { MaterialModule } from './material-modules';
import { MenuService } from './services/menu.service';
import { MenuServiceFactory } from './services/menu.factory';

@NgModule({
  declarations: [
    AppComponent
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
  entryComponents: [AppComponent]
})

export class AppModule {
  public constructor(private injector: Injector) { }

  public ngDoBootstrap(): void {
    const { injector } = this;

    const ngCustomElement = createCustomElement(AppComponent, { injector });

    if (!customElements.get('menu-team')) {
      customElements.define('menu-team', ngCustomElement); }
  }
}
