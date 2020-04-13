
/**
 * Environment service for reading global variables from winndow.__env
 */
export class EnvironmentService {

  /**
   * Main prefix in window for enviromental variables
   */
  private envPrefix = '__env';

  /**
   * Gets window[envPrefix] (window.__env)
   * @returns window[envPrefix]
   */
  public Get() {
    return window[this.envPrefix];
  }

  /**
   * Gets/Sets local/remote url which is used to preload
   * micro frontends's scripts
   * @param url new url
   * @returns url (localhost)
   */
  public get Url(): string {
    return window[this.envPrefix]['url'];
  }

  public set Url(value: string) {
    window[this.envPrefix]['url'] = value;
  }

  /**
   * Gets/Sets apigateway url which is used for event communication
   * @param url new url
   * @returns apigateway url
   */
  public get APIGatewayUrl(): string {
    return window[this.envPrefix]['apiGatewayUrl'];
  }

  public set APIGatewayUrl(value: string) {
    window[this.envPrefix]['apiGatewayUrl'] = value;
  }

  /**
   * Gets/Sets apigateway url which is used for event communication
   * @param port new port
   * @returns apigateway url
   */
  public get APIGatewayPort(): string {
    return window[this.envPrefix]['apiGatewayPort'];
  }

  public set APIGatewayPort(value: string) {
    window[this.envPrefix]['apiGatewayPort'] = value;
  }

  /**
   * Gets/Sets default language
   * @param value new language (en, lt, ru, uk)
   * @returns language abbreviation
   */
  public get Language(): string {
    return window[this.envPrefix]['lang'];
  }

  public set Language(value: string) {
    window[this.envPrefix]['lang'] = value;
  }

  /**
   * Gets micro frontend's settings preloaded by env.js
   */
  public get UFList(): any {
    return window[this.envPrefix]['uf'];
  }
}
