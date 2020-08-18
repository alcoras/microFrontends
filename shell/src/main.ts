import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { EnvironmentService } from '@uf-shared-libs/event-proxy-lib';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

/**
 * Sets up global environment for shell and the rest of micro frontends
 */
{
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
  provider.ConfigUrlList = environment.microfrontendConfigPathList;
  console.log(`Environment prepared (Production?): ${environment.production} `);
}


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
