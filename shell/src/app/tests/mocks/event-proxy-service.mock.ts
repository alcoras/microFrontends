import { EventProxyLibService } from '@uf-shared-libs/event-proxy-lib';

export let eProxyServiceMock: Partial<EventProxyLibService>;
const currentLang = 'en';
const currentURL = 'localhost';

eProxyServiceMock = {
  env: {
    lang: currentLang,
    url: currentURL,
    apiGatewayUrl: currentURL,
    apiGatewayPort: 80,
    uf: {},
    loadConfig: () => {
      window['__env'] = window['__env'] || {};
      window['__env']['lang'] = currentLang;
    }}
};
