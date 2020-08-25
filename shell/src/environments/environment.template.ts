// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  enableLogin: true,
  oneLanguage: false,
  version: '1.0.0',
  defaultLanguage: 'en',
  url: 'http://localhost',
  apiGatewayUrl : 'http://localhost',
  apiGatewayPort : '54366',

  loggedIn : false,
  authToken : null,
  tokenBeginDate : null,
  tokenExpirationDate : null,

  microfrontendConfigPathList : [
    'http://localhost:802/en/scripts/conf.js',       // Menu
    'http://localhost:804/scripts/conf.js',    // Personnel
    'http://localhost:805/scripts/conf.js',    // Occupation
    // 'http://localhost:3002/:3006/scripts/conf.js'   // Observer
  ],
}

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error',  // Included with Angular CLI.

// CONVERT THIS file to environment.ts and environment.prod.ts and fill it out accordingly for dev and prod
