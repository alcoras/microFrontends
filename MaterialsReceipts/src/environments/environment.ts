import { EnvironmentTypes } from './EnvironmentTypes';

export const environment = {
  EnvironmentTypes: EnvironmentTypes.Solo,

  currentLanguage: 'en',

  oneLanguage: false,
  version: '1.0.0',
  defaultLanguage: 'en',
  url: 'http://localhost',
  apiGatewayUrl : 'http://localhost',
  apiGatewayPort : '7001',

  loggedIn : false,
  authToken : null,
  tokenBeginDate : null,
  tokenExpirationDate : null,
}
