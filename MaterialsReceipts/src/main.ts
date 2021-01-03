import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { EnvironmentService, EnvironmentTypes } from 'event-proxy-lib-src';

import { MaterialsReceiptsModule } from './app/MaterialsReceiptsModule';
import { environment } from './environments/environment';

if (environment.EnvironmentTypes == EnvironmentTypes.Production) {
  enableProdMode();
}

/**
 * Sets up global environment for shell and the rest of micro frontends
 */
if (environment.EnvironmentTypes == EnvironmentTypes.Isolated) {
  const provider = new EnvironmentService();
  window['__env'] = window['__env'] || {};
  provider.Language = environment.defaultLanguage;
  provider.OneLanguage = environment.oneLanguage;
  provider.Url = environment.url;
  provider.APIGatewayUrl = environment.apiGatewayUrl;
  provider.APIGatewayPort = environment.apiGatewayPort;
  provider.AuthorizationToken = '';
  provider.TokenBeginDate = '';
  provider.TokenExpirationDate = '';
}

platformBrowserDynamic().bootstrapModule(MaterialsReceiptsModule)
  .catch(err => console.error(err));
