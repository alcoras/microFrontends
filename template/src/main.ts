import { enableProdMode } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { EnvironmentService, EnvironmentTypes } from "event-proxy-lib-src";

import { $project_name$Module } from "./app/$project_name$Module";
import { environment } from "./environments/environment";

if (environment.EnvironmentTypes == EnvironmentTypes.Production) {
  enableProdMode();
}
/**
 * Sets up global environment for shell and the rest of micro frontends
 */
if (environment.EnvironmentTypes == EnvironmentTypes.Isolated) {
  const provider = new EnvironmentService();
  window["__env"] = window["__env"] || {};
  provider.Language = environment.defaultLanguage;
  provider.OneLanguage = environment.oneLanguage;
  provider.Url = environment.url;
  provider.APIGatewayUrl = environment.apiGatewayUrl;
  provider.APIGatewayPort = environment.apiGatewayPort;
  provider.AuthorizationToken = "";
  provider.TokenBeginDate = "";
  provider.TokenExpirationDate = "";
}


platformBrowserDynamic().bootstrapModule($project_name$Module)
  .catch(err => console.error(err));
