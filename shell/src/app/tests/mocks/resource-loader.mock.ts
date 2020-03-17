import { ResourceLoaderService } from 'src/app/services/resource-loader.service';
import { ResourceSheme } from '@uf-shared-events/';

export let resourceLoaderMock: Partial<ResourceLoaderService>;

resourceLoaderMock = {
  LoadResources(...resources: ResourceSheme[]) {
    return new Promise( () => {} );
  }
};
