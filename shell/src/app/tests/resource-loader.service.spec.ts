import { TestBed } from '@angular/core/testing';
import { ResourceSheme } from 'event-proxy-lib-src'
;

import { ResourceLoaderService } from '../services/resource-loader.service';

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
    const source = 'assets/FileUsedInTests.js';

    resource.Element = elType;
    resource.setAttribute(attrToCheck, source);

    await service.LoadResources(resource);

    expect(window[envHolder].test).toBe(true, 'Did not load script');
    expect(window[envHolder].number).toBe(42, 'Inncorret life\'s purpose');
    done();
  }, 1000);
});
