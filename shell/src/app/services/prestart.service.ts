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
        console.log('prestart.service failed with error: ', reject);
        throw new Error();
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
  private setUpLanguage(response: HttpResponse<any>): string {
    const lang: ILanguageSettings = response.body;
    this.eProxyService.env.Language = lang.lang;
    return lang.lang;
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
