// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // if isolated is true, micro frontend will be able to work alone with backend
  isolated: true,

  currentLanguage: 'en',

  oneLanguage: false,
  version: '1.0.0',
  defaultLanguage: 'en',
  url: 'http://localhost',
  apiGatewayUrl : 'http://localhost',
  apiGatewayPort : '8001',

  loggedIn : false,
  authToken : null,
  tokenBeginDate : null,
  tokenExpirationDate : null,
}

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error',  // Included with Angular CLI.
