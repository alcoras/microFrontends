import { TestBed } from '@angular/core/testing';
import {
  EventIds,
  EventProxyLibModule,
  EventProxyLibService,
  OccupationData,
  OccupationsReadResults,
  ValidationStatus } from 'event-proxy-lib-src';
import { BackendPort, BackendURL, genRandomNumber } from './Adds/helpers';
import { OccupationAPIService } from 'occupation-uf/services/OccupationAPI';
import { EventBusService } from 'occupation-uf/services/EventBusService';

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

    await eProxyService.ConfirmEventsAsync(sourceId, [], true).toPromise();
  });

  afterEach(async () => {
    eProxyService.EndListeningToBackend();
    await eProxyService.ConfirmEventsAsync(sourceId, [], true).toPromise();
  });

  /**
   * sends events to event bus
   * @param res response to propogate
   */
  function propogateEvent(res: ValidationStatus): void {

  // ignoring empty responses
    if (!res.HttpResult.body) return;

    res.HttpResult.body.Events.forEach(element => {
      if (element.EventId === EventIds.OccupationsRead) {
        eventBusService.EventBus.next(element);
        eProxyService.ConfirmEventsAsync(sourceId, [element.AggregateId]).toPromise();
      }
    });
  }

  it('test service creation', () => {
    expect(service).toBeTruthy();
    expect(eProxyService).toBeTruthy();
    expect(eventBusService).toBeTruthy();
  });

  describe('Get', () => {

    it('should throw if page is less than 1', async (done) => {
      service.Get(0, 1)
        .then( () => fail() )
        .catch( (data) => { expect(data).toBeTruthy(); done(); } );
    });

    it('should throw if limit is less than 1', async (done) => {
      service.Get(1, 0)
      .then( () => fail() )
      .catch( (data) => { expect(data).toBeTruthy(); done(); } );
    });

    it('should get events after Occupation query', async (done) => {
      // Start listenting to events
      eProxyService.InitializeConnectionToBackend(sourceId).subscribe(
        (res: ValidationStatus) => {
          propogateEvent(res);
        }
      );

      // Send OccupationReadDataQuery event
      const page = 1;
      const limit = 3;
      service.Get(page, limit).then(
        (res: OccupationsReadResults) => {
          expect(res.OccupationDataList.length).toBeLessThanOrEqual(limit);
          res.OccupationDataList.forEach(element => {
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
      // Start listenting to events
      eProxyService.InitializeConnectionToBackend(sourceId).subscribe(
        (res: ValidationStatus) => {
          propogateEvent(res);
      });

      // Get current length and id
      let currentLen: number;
      let id: number;

      await service.Get(1, 1).then(
        (res: OccupationsReadResults) => {
          id = res.OccupationDataList[0].OccupationAggregateIdHolderId;
          currentLen = res.TotalRecordsAmount;
        }
      );

      // create new occupation entry
      await service.Create(newEntry);

      await service.Get(1, 1000).then(
        (res: OccupationsReadResults) => {
          expect(res.TotalRecordsAmount).toBeGreaterThan(currentLen);
        }
      );

      //  delete an entry
      await service.Delete(id);

      await service.Get(1, 1).then(
        (res: OccupationsReadResults) => {
          expect(res.TotalRecordsAmount).toEqual(currentLen);
          done();
        }
      );
    }, 6000);
  });

  describe('Update', () => {

    it('should update existing Occupation entry', async (done) => {

      // Start listenting to events
      eProxyService.InitializeConnectionToBackend(sourceId).subscribe(
        (res: ValidationStatus) => {
          propogateEvent(res);
      });

      let entryToUpdate: OccupationData;
      // Get entry
      await service.Get(1, 1).then(
        (res: OccupationsReadResults) => {
          if (res.TotalRecordsAmount === 0) {
            done.fail('no entries found');
          }
          entryToUpdate = res.OccupationDataList[0];
      });

      // change name
      const newName = `new Name (${genRandomNumber(100)})`;
      entryToUpdate.Name = newName;
      entryToUpdate.DocReestratorId = 1; // TODO: for demo purposes
      await service.Update(entryToUpdate);

      // compare entry
      await service.Get(1, 5).then(
        (res: OccupationsReadResults) => {
          for (const iterator of res.OccupationDataList) {
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

      // Start listenting to events
      eProxyService.InitializeConnectionToBackend(sourceId).subscribe(
        (res: ValidationStatus) => {
          propogateEvent(res);
      });

      // Get current length
      let currentLen: number;

      await service.Get(1, 1).then(
        (res: OccupationsReadResults) => {
          currentLen = res.TotalRecordsAmount;
      });

      // create new occupation entry
      await service.Create(newOccupationData).then(() => {
        // compare length
        service.Get(1, 1).then(
          (res: OccupationsReadResults) => {
            expect(res.TotalRecordsAmount).toBeGreaterThan(currentLen);
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

