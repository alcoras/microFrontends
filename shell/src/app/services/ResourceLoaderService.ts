import { Injectable } from "@angular/core";
import { ResourceSheme } from "event-proxy-lib-src";

/**
 * Script and link loader service
 */
@Injectable({
  providedIn: "root"
})
export class ResourceLoaderService {

  /**
   * Loads resources like script or link to DOM just to wrap
   * @param resources ResourceScheme
   * @returns Promises for every load
   */
  public async LoadResources(resources: ResourceSheme | ResourceSheme[]): Promise<void[]> {
    const promises = [];

    const resourceList = [].concat(resources);

    resourceList.forEach(e => {
      promises.push(this.loadResource(e));
    });

    return Promise.all(promises);
  }

  /**
   * Loads resource into DOM
   * @param resource Resource Scheme
   * @returns Promises for every load
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private loadResource(resource: ResourceSheme): Promise<any> {

    let domResources = [];
    let attrToCheck: string;
    let el: HTMLElement;

    switch (resource.Element) {
      case "script":
          domResources = Array
            .from( document.querySelectorAll("script") )
            .map( src => src.src );
          attrToCheck = "src";
          el = document.createElement("script");
          break;

      case "link":
          domResources = Array
            .from( document.querySelectorAll("link") )
            .map( src => src.href );
          attrToCheck = "href";
          el = document.createElement("link");
          break;
    }

    // check if it's loaded
    if (domResources.includes(resource.Attributes[attrToCheck])) {
      return Promise.resolve({ resource });
    }

    return new Promise((resolve, reject) => {
      el.onerror = reject;
      el.onload = resolve;

      for (const key in resource.Attributes) {
        if (Object.prototype.hasOwnProperty.call(resource.Attributes, key)) {
          el.setAttribute(key, resource.Attributes[key]);
        }
      }

      document.body.appendChild(el);
    });
  }
}
