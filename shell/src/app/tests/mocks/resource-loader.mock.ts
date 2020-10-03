import { ResourceSheme } from 'event-proxy-lib-src'
;
import { ResourceLoaderService } from 'src/app/services/resource-loader.service';

export const resourceLoaderMock: Partial<ResourceLoaderService> = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  LoadResources(...resources: ResourceSheme[]) {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return new Promise( () => {} );
  }
};
