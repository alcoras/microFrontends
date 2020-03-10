
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
    // Create env
    // Read environment variables from browser window
    const browserWindow = window || {};
    const browserWindowEnv = browserWindow[placeHolder] || {};

    if (browserWindowEnv.hasOwnProperty(ufPH)) {
      this.uf = {...browserWindowEnv[ufPH] };
    }
    return browserWindowEnv;
  }

}
