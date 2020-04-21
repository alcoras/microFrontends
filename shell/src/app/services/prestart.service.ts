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
  constructor(
    private langService: LanguageService,
    private eProxyService: EventProxyLibService,
    private resourceLoader: ResourceLoaderService
  ) { }

  /**
   * Initialize language
   */
  public InitLanguage() {
    return this.langService.getLang().toPromise().then(
      (res) => {
        if (res.status !== 200) {
          throw new Error('Failure on getting language');
        }
        this.setUpLanguage(res);
      },
      (reject) => {
        console.log('prestart.service could not get language, setting default (en)', reject);
        this.setUpLanguage(null);
      });
  }

  /**
   * Inits scripts
   * @param urls list of scripts' urls to load
   */
  public InitScripts(urls: string[]): Promise<any> {
    return this.preloadScripts(urls);
  }

  /**
   * Sets up language by setting global environment paramater
   * @param response HttpResponse with lang data
   */
  private setUpLanguage(response: HttpResponse<ILanguageSettings> | null) {
    if (!response) {
      this.eProxyService.env.Language = 'en';
      return;
    }
    this.eProxyService.env.Language = response.body.lang;
  }

  /**
   * Preloads scripts for every microservice
   * @returns Promises for every script
   */
  private async preloadScripts(urlList: string[]) {
    const promises: any[] = [];

    urlList.forEach(url => {
      const resource = new ResourceSheme();
      resource.Element = 'script';
      resource.setAttribute('src', url);

      promises.push(this.resourceLoader.LoadResources(resource));
    });

    return Promise.all(promises);
  }
}
