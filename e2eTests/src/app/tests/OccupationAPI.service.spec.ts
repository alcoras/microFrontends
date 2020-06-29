import { OccupationAPIService } from '@occupation-services/OccupationAPI.service';
import { EventProxyLibService, EventProxyLibModule } from '@uf-shared-libs/event-proxy-lib';
import { EventBusService } from '@occupation-services/EventBus.service';
import { TestBed } from '@angular/core/testing';
import { OccupationData, uEventsIds, EventResponse } from '@uf-shared-models/index';
import { genRandomNumber } from './helpers/helpers';
import { SubscibeToEvent } from '@uf-shared-events/index';
import { HttpResponse } from '@angular/common/http';
import { IGetResponse } from '@occupation-services/interfaces/IGetResponse';

/**
 * retruns new occupation entry for testing
 */
function createOccupationEntry(): OccupationData {
  return {
    Name: `random Name ${genRandomNumber(1000)}`,
    DocReestratorId: genRandomNumber(100),
    TariffCategory: genRandomNumber(10)
  };
}

// tslint:disable-next-line: no-big-function
describe('Occupation API service', () => {
  let service: OccupationAPIService;
  let eProxyService: EventProxyLibService;
  let eventBusService: EventBusService;
  const sourceId = 'OccupationAPI_testing';
  const backendURL = 'http://localhost:54366';
  const backendPort = '54366';

  beforeAll(async () => {
    const subEvent = new SubscibeToEvent(sourceId, [[uEventsIds.OccupationsRead, 0, 0]]);
    await eProxyService.DispatchEvent(subEvent).toPromise();
  });

  beforeEach(async () => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10 * 1000;
    window['__env'] = window['__env'] || {};

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
  });

  afterEach(async () => {
    eProxyService.EndQNA();
    await eProxyService.ConfirmEvents(sourceId, [], true).toPromise();
  });

  // tslint:disable-next-line: completed-docs
  function propogateEvent(res: HttpResponse<EventResponse>) {
    if (res.body) {
      res.body.Events.forEach(element => {
        if (element.EventId === uEventsIds.OccupationsRead) {
          eventBusService.EventBus.next(element);
          eProxyService.ConfirmEvents(sourceId, [element.AggregateId]).toPromise();
        }
      });
    }
  }

  fit('test service creation', () => {
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
      eProxyService.StartQNA(sourceId).subscribe(
        (res: HttpResponse<any>) => {
          propogateEvent(res);
        }
      );

      // 3. Send OccupationReadDataQuery event
      const page = 1;
      const limit = 3;
      service.Get(page, limit).then(
        (res: IGetResponse) => {
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
    }, 6000);
  });

  describe('Combination', () => {
    it('should create and then delete entry', async (done) => {
      const newEntry = createOccupationEntry();
      // 1. Subscription happens before tests

      // 2. Start listenting to events
      eProxyService.StartQNA(sourceId).subscribe(
        (res: HttpResponse<EventResponse>) => {
          propogateEvent(res);
      });

      // 3. Get current length and id
      let currentLen: number;
      let id: number;

      await service.Get(1, 1000).then(
        (res: IGetResponse) => {
          id = res.items[0].OccupationAggregateIdHolderId;
          currentLen = res.total;
        }
      );

      // 4. create new occupation entry
      await service.Create(newEntry);

      await service.Get(1, 1000).then(
        (res: IGetResponse) => {
          expect(res.total).toBeGreaterThan(currentLen);
        }
      );

      // 5. delete an entry
      await service.Delete(id);

      await service.Get(1, 1000).then(
        (res: IGetResponse) => {
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
      eProxyService.StartQNA(sourceId).subscribe(
        (res: HttpResponse<EventResponse>) => {
          propogateEvent(res);
      });

      let entryToUpdate: OccupationData;
      // 3. Get entry
      await service.Get(1, 1000).then(
        (res: IGetResponse) => {
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
        (res: IGetResponse) => {
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
      eProxyService.StartQNA(sourceId).subscribe(
        (res: HttpResponse<EventResponse>) => {
          propogateEvent(res);
      });

      // 3. Get current length
      let currentLen: number;

      await service.Get(1, 1000).then(
        (res: IGetResponse) => {
          currentLen = res.total;
      });

      // 4. create new occupation entry
      await service.Create(newOccupationData).then(() => {
        // 5. compare length
        service.Get(1, 1000).then(
          (res: IGetResponse) => {
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