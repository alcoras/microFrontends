import { TestBed } from '@angular/core/testing';
import {
  EventIds,
  EventProxyLibModule,
  EventProxyLibService,
  ResponseStatus,
  SubscibeToEvent } from 'event-proxy-lib-src';
import { BackendPort, BackendURL, genRandomNumber } from './helpers/helpers';
import { OccupationData, OccupationDataDTO } from 'occupation-uf/Models';
import { OccupationAPIService } from 'occupation-uf/services/OccupationAPI.service';
import { EventBusService } from 'occupation-uf/services/EventBus.service';

/**
 *
 * @param sourceId source id
 * @param eProxyService event proxy service
 */
async function subscribeToOccupationsRead(sourceId: string, eProxyService: EventProxyLibService): Promise<void> {
  const subEvent = new SubscibeToEvent(sourceId, [[EventIds.OccupationsRead, 0, 0]]);
  await eProxyService.DispatchEvent(subEvent).toPromise();
}

/**
 * @returns new occupation entry for testing
 */
function createOccupationEntry(): OccupationData {
  return {
    Name: `random Name ${genRandomNumber(1000)}`,
    DocReestratorId: genRandomNumber(100),
    TariffCategory: genRandomNumber(10)
  };
}

describe('Occupation API service', () => {
  let service: OccupationAPIService;
  let eProxyService: EventProxyLibService;
  let eventBusService: EventBusService;
  const sourceId = 'OccupationAPI_testing';
  const backendURL = BackendURL;
  const backendPort = BackendPort;

  beforeEach(async () => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10 * 1000;
    window['__env'] = window['__env'] || {};

    // eslint-disable-next-line @typescript-eslint/camelcase
    window['__env'].one_language = false;
    // API url
    window['__env'].url = 'http://' + backendURL;
    window['__env'].apiGatewayUrl = window['__env'].url;
    window['__env'].apiGatewayPort = backendPort;

    TestBed.configureTestingModule({
      imports: [EventProxyLibModule],
      providers: [
        EventProxyLibService,
        EventBusService,
      ]
    });

    service = TestBed.inject(OccupationAPIService);
    eProxyService = TestBed.inject(EventProxyLibService);
    eventBusService = TestBed.inject(EventBusService);
    eProxyService.ApiGatewayURL = backendURL;

    await eProxyService.ConfirmEvents(sourceId, [], true).toPromise();
    await subscribeToOccupationsRead(sourceId, eProxyService);
  });

  afterEach(async () => {
    eProxyService.EndListeningToBackend();
    await eProxyService.ConfirmEvents(sourceId, [], true).toPromise();
  });

  /**
   * sends events to event bus
   * @param res response to propogate
   */
  function propogateEvent(res: ResponseStatus): void {

  // ignoring empty responses
    if (!res.HttpResult.body) return;

    res.HttpResult.body.Events.forEach(element => {
      if (element.EventId === EventIds.OccupationsRead) {
        eventBusService.EventBus.next(element);
        eProxyService.ConfirmEvents(sourceId, [element.AggregateId]).toPromise();
      }
    });
  }

  it('test service creation', () => {
    expect(service).toBeTruthy();
    expect(eProxyService).toBeTruthy();
    expect(eventBusService).toBeTruthy();
  });

  describe('Get', () => {

    it('should throw if page is less than 1', () => {
      expect( () => service.Get(0, 1).then() ).toThrow();
    });

    it('should throw if limit is less than 1', () => {
      expect( () => service.Get(1, 0).then() ).toThrow();
    });

    it('should get events after Occupation query', async (done) => {
      // 1. Subscription happens before tests

      // 2. Start listenting to events
      eProxyService.InitializeConnectionToBackend(sourceId).subscribe(
        (res: ResponseStatus) => {
          propogateEvent(res);
        }
      );

      // 3. Send OccupationReadDataQuery event
      const page = 1;
      const limit = 3;
      service.Get(page, limit).then(
        (res: OccupationDataDTO) => {
          expect(res.items.length).toBeLessThanOrEqual(limit);
          res.items.forEach(element => {
            expect(element.DocReestratorId).toBeDefined();
            expect(element.TariffCategory).toBeDefined();
            expect(element.Name).toBeDefined();
            expect(element.OccupationAggregateIdHolderId).toBeDefined();
          });
          done();
        }
      );
    }, 1000);
  });

  describe('Combination', () => {
    it('should create and then delete entry', async (done) => {
      const newEntry = createOccupationEntry();
      // 1. Subscription happens before tests

      // 2. Start listenting to events
      eProxyService.InitializeConnectionToBackend(sourceId).subscribe(
        (res: ResponseStatus) => {
          propogateEvent(res);
      });

      // 3. Get current length and id
      let currentLen: number;
      let id: number;

      await service.Get(1, 1000).then(
        (res: OccupationDataDTO) => {
          id = res.items[0].OccupationAggregateIdHolderId;
          currentLen = res.total;
        }
      );

      // 4. create new occupation entry
      await service.Create(newEntry);

      await service.Get(1, 1000).then(
        (res: OccupationDataDTO) => {
          expect(res.total).toBeGreaterThan(currentLen);
        }
      );

      // 5. delete an entry
      await service.Delete(id);

      await service.Get(1, 1000).then(
        (res: OccupationDataDTO) => {
          expect(res.total).toEqual(currentLen);
          done();
        }
      );
    }, 6000);
  });

  describe('Update', () => {

    it('should update existing Occupation entry', async (done) => {

      // 1. Subscription happens before tests

      // 2. Start listenting to events
      eProxyService.InitializeConnectionToBackend(sourceId).subscribe(
        (res: ResponseStatus) => {
          propogateEvent(res);
      });

      let entryToUpdate: OccupationData;
      // 3. Get entry
      await service.Get(1, 1000).then(
        (res: OccupationDataDTO) => {
          if (res.total === 0) {
            done.fail('no entries found');
          }
          entryToUpdate = res.items[0];
      });

      // 4. change name
      const newName = `new Name (${genRandomNumber(100)})`;
      entryToUpdate.Name = newName;
      entryToUpdate.DocReestratorId = 1; // TODO: for demo purposes
      await service.Update(entryToUpdate);

      // 5. compare entry
      await service.Get(1, 1000).then(
        (res: OccupationDataDTO) => {
          for (const iterator of res.items) {
            if (entryToUpdate.OccupationAggregateIdHolderId === iterator.OccupationAggregateIdHolderId) {
              expect(entryToUpdate.Name).toBe(newName);
              done();
            }
          }
      });
    }, 6000);
  });

  describe('Create', () => {

    for (let index = 0; index < 1; index++) {
    it('should create new Occupation entry', async (done) => {
      const newOccupationData = createOccupationEntry();

      // 1. Subscription happens before tests

      // 2. Start listenting to events
      eProxyService.InitializeConnectionToBackend(sourceId).subscribe(
        (res: ResponseStatus) => {
          propogateEvent(res);
      });

      // 3. Get current length
      let currentLen: number;

      await service.Get(1, 1000).then(
        (res: OccupationDataDTO) => {
          currentLen = res.total;
      });

      // 4. create new occupation entry
      await service.Create(newOccupationData).then(() => {
        // 5. compare length
        service.Get(1, 1000).then(
          (res: OccupationDataDTO) => {
            expect(res.total).toBeGreaterThan(currentLen);
            done();
          }
        );
      },
      (rejected) => {
        done.fail(rejected);
      }
    );

    }, 6000);
  }

  });
});

