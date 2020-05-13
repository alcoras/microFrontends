import { TestBed } from '@angular/core/testing';

import { PrestartService } from '../services/prestart.service';
import { LanguageService } from '../services/lang.service';
import { langServiceMock } from './mocks/lang.mock';
import { EventProxyLibService } from '@uf-shared-libs/event-proxy-lib';
import { eventProxyServiceMock } from './mocks/event-proxy-service.mock';
import { ResourceLoaderService } from '../services/resource-loader.service';
import { resourceLoaderMock } from './mocks/resource-loader.mock';

describe('PrestartService', () => {
  let service: PrestartService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        { provide: LanguageService, useValue: langServiceMock },
        { provide: EventProxyLibService, useValue: eventProxyServiceMock},
        { provide: ResourceLoaderService, useValue: resourceLoaderMock}
      ]
    });
    service = TestBed.inject(PrestartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set up scripts', async (done) => {
    spyOn(resourceLoaderMock, 'LoadResources');
    service.InitScripts(['gg']);

    expect(resourceLoaderMock.LoadResources).toHaveBeenCalled();
    done();
  });
});
