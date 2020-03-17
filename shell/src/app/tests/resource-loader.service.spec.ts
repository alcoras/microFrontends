import { TestBed } from '@angular/core/testing';

import { ResourceLoaderService } from '../services/resource-loader.service';
import { ResourceSheme } from '@uf-shared-events/helpers/ResourceSheme';

describe('ResourceLoaderService', () => {
  let service: ResourceLoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ ]
    });
    service = TestBed.inject(ResourceLoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load a script', async (done) => {
    const resource = new ResourceSheme();
    const envHolder = '__env';
    const elType = 'script';
    const attrToCheck = 'src';
    const source = 'assets/test.js';

    resource.Element = elType;
    resource.setAttribute(attrToCheck, source);

    await service.LoadResources(resource).then();

    expect(window[envHolder].test).toBe(true, 'Did not load script');
    expect(window[envHolder].number).toBe(42, 'Inncorret life\'s purpose');
    done();
  });
});
