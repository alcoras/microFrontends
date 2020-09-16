const URL = 'http://localhost';
const APIGATEWAYURL = URL;

export const environment = {
  production: false,
  enableLogin: false,
  oneLanguage: false,
  version: '1.0.1',
  defaultLanguage: 'en',
  url: URL,
  apiGatewayUrl : APIGATEWAYURL,
  apiGatewayPort : '8001',

  loggedIn : false,
  authToken : null,
  tokenBeginDate : null,
  tokenExpirationDate : null,

  microfrontendConfigPathList : [
    'menu/en/scripts/conf.js',            // Menu
    'personnel/scripts/conf.js',     // Personnel
    'occupations/scripts/conf.js',     // Occupation
    'materialReceipts/scripts/conf.js',     // MaterialReceipts
    // '<porject_name>/scripts/conf.js'   //Template
    // '${URL}:3006/scripts/conf.js'      // Observer
  ],
}
