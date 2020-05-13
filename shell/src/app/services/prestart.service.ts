import { Injectable } from '@angular/core';
import { LanguageService, ILanguageSettings } from './lang.service';
import { HttpResponse } from '@angular/common/http';
import { EventProxyLibService } from '@uf-shared-libs/event-proxy-lib';
import { ResourceSheme } from '@uf-shared-events/helpers/ResourceSheme';
import { ResourceLoaderService } from './resource-loader.service';

/**
 * Preloads default language and scripts
 */
@Injectable({
  providedIn: 'root',
})
export class PrestartService {
  public constructor(
    private languageService: LanguageService,
    private eventProxyService: EventProxyLibService,
    private resourceLoader: ResourceLoaderService
  ) { }

  /**
   * Initialize language (DEMO)
   *
   * @returns {Promise<void>}
   * @memberof PrestartService
   */
  public async InitLanguage(): Promise<void> {
    try {
      const res = await this.languageService.GetLang().toPromise();
      if (res.status !== 200) {
        throw new Error('Failure on getting language');
      }
      this.setUpLanguage(res);
    }
    catch (reject) {
      console.log('prestart.service could not get language, setting default (en)', reject);
      this.setUpLanguage(null);
    }
  }

  /**
   * Inits scripts
   *
   * @param {string[]} urls list of scripts
   * @returns {Promise<void[]>} Promises
   * @memberof PrestartService
   */
  public InitScripts(urls: string[]): Promise<void[][]> {
    return this.preloadScripts(urls);
  }

  /**
   * Sets up language by setting global environment paramater
   * @param response HttpResponse with lang data
   */
  private setUpLanguage(response: HttpResponse<ILanguageSettings> | null): void {
    if (!response) {
      this.eventProxyService.environmentService.Language = 'en';
      return;
    }
    this.eventProxyService.environmentService.Language = response.body.lang;
  }

  /**
   * Preloads scripts for every microservice
   *
   * @private
   * @param {string[]} urlList list of scripts
   * @returns Promises for every script
   * @memberof PrestartService
   */
  private async preloadScripts(urlList: string[]): Promise<void[][]> {
    const promises: Promise<void[]>[] = [];

    urlList.forEach(url => {
      const resource = new ResourceSheme();
      resource.Element = 'script';
      resource.setAttribute('src', url);

      promises.push(this.resourceLoader.LoadResources(resource));
    });

    return Promise.all(promises);
  }
}
