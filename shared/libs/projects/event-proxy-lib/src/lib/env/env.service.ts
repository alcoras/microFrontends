
// Micro frontend settings
class UfSettings {
  events: number[] = [];
  scripts: string[] = [];
  styles: string[] = [];
}

export class EnvService {

  // The values that are defined here are the default values that can
  // be overridden by env.js

  // API url
  public url = 'http://localhost';

  public apiGatewayUrl = this.url;
  public apiGatewayPort = 8080;

  public uf: { [id: number]: UfSettings } = {};

  constructor() {
  }

}
