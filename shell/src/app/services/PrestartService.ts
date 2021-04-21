import { Injectable } from "@angular/core";
import { ResourceLoaderService } from "./ResourceLoaderService";
import { EnvironmentService, ResourceSheme } from "event-proxy-lib-src";

/**
 * Preloads default language and scripts
 */
@Injectable({
  providedIn: "root",
})
export class PrestartService {
  public constructor(
    private environmentService: EnvironmentService,
    private resourceLoader: ResourceLoaderService
  ) { }

  /**
   * Initialize language (DEMO)
   *
   * @returns Promise<void>
   */
  public async InitLanguage(): Promise<void> {
    throw new Error("Not implemented");
  }

  /**
   * Inits scripts
   *
   * @param urls - list of scripts
   * @returns - Promises
   */
  public InitScripts(urls: string[]): Promise<void[][]> {
    return this.preloadScripts(urls);
  }

  /**
   * Sets up language by setting global environment paramater
   */
  private setUpLanguage(): void {
    throw new Error("Not implemented");
  }

  /**
   * Preloads scripts for every microservice
   *
   * @param urlList - list of scripts
   * @returns Promises for every script
   */
  private async preloadScripts(urlList: string[]): Promise<void[][]> {
    const promises: Promise<void[]>[] = [];

    urlList.forEach(url => {
      const resource = new ResourceSheme();
      resource.Element = "script";
      resource.setAttribute("src", url);

      promises.push(this.resourceLoader.LoadResources(resource));
    });

    return Promise.all(promises);
  }
}
