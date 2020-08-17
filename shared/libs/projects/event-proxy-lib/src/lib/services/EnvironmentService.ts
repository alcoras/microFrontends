
/**
 * Environment service for reading global variables from window.__env
 */
export class EnvironmentService {

  /**
   * Main prefix in window for enviromental variables
   */
  private envPrefix = '__env';


  public get ConfigUrlList(): string[] {
    return window[this.envPrefix]['microfrontendConfigPathList'];
  }

  public set ConfigUrlList(value: string[]) {
    window[this.envPrefix]['microfrontendConfigPathList'] = value;
  }

  /**
   * Gets window[envPrefix] (window.__env)
   * @returns window[envPrefix]
   */
  // TODO: enable when I figure out how to add external models to angular library
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public Get(): unknown {
    return window[this.envPrefix];
  }

  /**
   * URL list for microfrontend configs
   * @returns array of strings to be loaded and parsed by shell
   */
  public get MicroFrontendConfigPathList(): string[] {
    return window[this.envPrefix]['microfrontendConfigPathList'];
  }

  public set MicroFrontendConfigPathList(value: string[]) {
    window[this.envPrefix]['microfrontendConfigPathList'] = value;
  }

  /**
   * Gets/sets one language boolean
   * @returns true if one language
   */
  public get OneLangauge(): boolean {
    return window[this.envPrefix]['oneLanguage'];
  }

  public set OneLanguage(value: boolean) {
    window[this.envPrefix]['oneLanguage'] = value;
  }

  /**
   * Gets/Sets local/remote url which is used to preload
   * micro frontends's scripts
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
   * @returns language abbreviation
   */
  public get Language(): string {
    return window[this.envPrefix]['lang'];
  }

  public set Language(value: string) {
    window[this.envPrefix]['lang'] = value;
  }

  /**
   * Gets/Sets authorization token
   * @returns token
   */
  public get AuthorizationToken(): string {
    return window[this.envPrefix]['authToken'];
  }

  public set AuthorizationToken(value: string) {
    window[this.envPrefix]['authToken'] = value;
  }

  /**
   * Gets/Sets token valid from date
   * @returns date ISO string
   */
  public get TokenBeginDate(): string {
    return window[this.envPrefix]['tokenBeginDate'];
  }

  public set TokenBeginDate(value: string) {
    window[this.envPrefix]['tokenBeginDate'] = value;
  }

  /**
   * Gets/Sets token valid to date
   * @returns date ISO string
   */
  public get TokenExpirationDate(): string {
    return window[this.envPrefix]['tokenExpirationDate'];
  }

  public set TokenExpirationDate(value: string) {
    window[this.envPrefix]['tokenExpirationDate'] = value;
  }

  /**
   * Gets micro frontend's settings preloaded by env.js
   * @returns Microfrontend list object
   */
  // TODO: enable when I figure out how to add external models to angular library
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public get UFList(): any {
    return window[this.envPrefix]['uf'];
  }
}
