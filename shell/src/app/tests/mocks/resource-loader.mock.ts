import { ResourceLoaderService } from 'src/app/services/resource-loader.service';
import { ResourceSheme } from '@uf-shared-events/';

export const resourceLoaderMock: Partial<ResourceLoaderService> = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  LoadResources(...resources: ResourceSheme[]) {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return new Promise( () => {} );
  }
};
