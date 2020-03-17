
// TODO: find a way to import it from @uf-shared..
// Micro frontend settings
class ResourceSheme {
  public Element: string|undefined;
  public Attributes: {
      [attrName: string]: string;
  } = {};
  public setAttribute(attr: string, value: string) {
      this.Attributes[attr] = value;
  }
}

class UFData {
  public events: number[] = [];
  public resources: ResourceSheme[] = [];
}

export class EnvService {

  // The values that are defined here are the default values that can
  // be overridden by env.js

  // API url
  public lang = 'en';
  public url = 'http://localhost';

  public apiGatewayUrl = this.url;
  public apiGatewayPort = 8080;

  public uf: { [id: number]: UFData } = {};

  constructor() {
    this.loadConfig();
  }

  public loadConfig() {
    const placeHolder = '__env';
    const ufPH = 'uf';
    const langH = 'lang';
    const urlH = 'url';
    const apiGatewayUrlH = 'apiGatewayUrl';
    const apiGatewayPortH = 'apiGatewayPort';
    // Create env
    // Read environment variables from browser window
    const browserWindow = window || {};
    const browserWindowEnv = browserWindow[placeHolder] || {};

    if (browserWindowEnv.hasOwnProperty(ufPH)) {
      this.uf = {...browserWindowEnv[ufPH] };
    }

    if (browserWindowEnv.hasOwnProperty(langH)) {
      this.lang = browserWindowEnv[langH];
    }

    if (browserWindowEnv.hasOwnProperty(urlH)) {
      this.url = browserWindowEnv[urlH];
    }

    if (browserWindowEnv.hasOwnProperty(apiGatewayUrlH)) {
      this.apiGatewayUrl = browserWindowEnv[apiGatewayUrlH];
    }

    if (browserWindowEnv.hasOwnProperty(apiGatewayPortH)) {
      this.apiGatewayPort = browserWindowEnv[apiGatewayPortH];
    }

    return browserWindowEnv;
  }

}
