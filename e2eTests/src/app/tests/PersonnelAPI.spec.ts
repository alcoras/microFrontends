import { TestBed } from '@angular/core/testing';
import {
  EventIds,
  EventProxyLibModule,
  EventProxyLibService,
  ResponseStatus,
  SubscibeToEvent } from 'event-proxy-lib-src';
import { BackendPort, BackendURL, genRandomNumber } from './helpers/helpers';
import { PersonnelAPIService } from 'personnel-uf/services/PersonnelAPI.service';
import { EventBusService } from 'personnel-uf/services/EventBus.service';
import { PersonData, PersonDataDTO } from 'personnel-uf/Models';
/**
 *
 * @param sourceId source id
 * @param eProxyService event proxy service
 */
async function subscribeToPersonDataRead(sourceId: string, eProxyService: EventProxyLibService): Promise<void> {
  const subEvent = new SubscibeToEvent(sourceId, [[EventIds.ReadPersonData, 0, 0]]);
  await eProxyService.DispatchEvent(subEvent).toPromise();
}

describe('PersonnelAPI service', () => {
  let service: PersonnelAPIService;
  let eProxyService: EventProxyLibService;
  let eventBusService: EventBusService;
  const sourceId = 'PersonnelAPI_testing';
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
    service = TestBed.inject(PersonnelAPIService);
    eProxyService = TestBed.inject(EventProxyLibService);
    eventBusService = TestBed.inject(EventBusService);
    eProxyService.ApiGatewayURL = backendURL;

    await eProxyService.ConfirmEvents(sourceId, [], true).toPromise();
    await subscribeToPersonDataRead(sourceId, eProxyService);
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

    if (!res.HttpResult.body) return;

    res.HttpResult.body.Events.forEach(element => {
      if (element.EventId === EventIds.ReadPersonData) {
        eventBusService.EventBus.next(element);
        eProxyService.ConfirmEvents(sourceId, [element.AggregateId]).toPromise();
      }
    });
  }

  /**
   * Creates Personnel entry for testing
   * @returns Personnel with filled random data
   */
  function createPersonnelEntry(): PersonData {
    return {
      PersonDataID: 0,
      DateValue: new Date().toISOString(),
      DocReestratorID: genRandomNumber(100),
      KodDRFO: genRandomNumber(100).toString(),
      Oklad: genRandomNumber(100),
      Stavka: genRandomNumber(100),
      PIP: genRandomNumber(100).toString(),
      DataPriyomu: new Date().toISOString(),
      Posada: genRandomNumber(100),
      PodatkovaPilga: genRandomNumber(100),
    };
  }

  describe('Update', () => {
    it('should update existing PersonData entry', async (done) => {
      // 1. Sub to ReadPersonData

      // 2. Start listenting to events
      eProxyService.InitializeConnectionToBackend(sourceId).subscribe(
        (res: ResponseStatus) => propogateEvent(res));

      // 3. Get entry
      let entryToUpdate: PersonData;

      await service.Get([], 1, 1000).then(
        (res: PersonDataDTO) => {
          if (res.total === 0) {
            done.fail('no entries found');
          }
          entryToUpdate = res.items[0];
        }
      );

      // 4. change something
      const newField = `new field (${genRandomNumber(100)})`;
      entryToUpdate.KodDRFO = newField;
      entryToUpdate.PIP = newField;
      await service.Update(entryToUpdate);

      // 5. compare entry
      await service.Get([], 1, 1000).then(
        (res: PersonDataDTO) => {
          for (const iterator of res.items) {
            if (entryToUpdate.PersonDataID === iterator.PersonDataID) {
              expect(entryToUpdate.KodDRFO).toBe(newField);
              expect(entryToUpdate.PIP).toBe(newField);
              done();
            }
          }
        }
      );
    }, 6000);
  });

  it('should create and delete Person data entry', async (done) => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 15 * 1000;
    const newPersonnelData = createPersonnelEntry();
    // 1. Subscription is happening before tests in beforeAll

    // 2. Start listenting to events
    eProxyService.InitializeConnectionToBackend(sourceId).subscribe(
      (res: ResponseStatus) => {
        propogateEvent(res);
    });

    // 3. Get current length
    let currentLen: number;
    let id: number;

    await service.Get([], 1, 1000).then(
      (res: PersonDataDTO) => {
        id = res.items[0].PersonDataID;
        currentLen = res.total;
      }
    );

    // 4. create new persondata
    await service.Create(newPersonnelData);

    await service.Get([], 1, 1000).then(
      (res: PersonDataDTO) => {
        expect(res.total).toBeGreaterThan(currentLen);
      }
    );

    // 5. delete an entry
    await service.Delete(id);

    await service.Get([], 1, 1000).then(
      (res: PersonDataDTO) => {
        expect(res.total).toEqual(currentLen);
        done();
      }
    );
  }, 6000);

  for (let index = 0; index < 1; index++) {
    it('should create new PersonData entry', async (done) => {
      const newPersonnelData = createPersonnelEntry();
      // 1. Subscription is happening before tests in beforeAll

      // 2. Start listenting to events
      eProxyService.InitializeConnectionToBackend(sourceId).subscribe(
        (res: ResponseStatus) => {
          propogateEvent(res);
        },
        (err) => { done.fail(err); },
      );

      // 3. Get current length
      let currentLen;
      await service.Get([], 1, 1000).then(
        (res: PersonDataDTO) => {
          currentLen = res.items.length;
        }
      );

      // 4. create new persondata
      await service.Create(newPersonnelData).then(() => {
          // 5. compare length
          service.Get([], 1, 1000).then(
            (res: PersonDataDTO) => {
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

  it('should get events after ReadPersonDataQuery', async (done) => {
    // 1. Subscription is happening before tests in beforeAll

    // 2. Start listenting to events
    eProxyService.InitializeConnectionToBackend(sourceId).subscribe(
      (res: ResponseStatus) => {
        propogateEvent(res);
    });

    // 3. Send ReadPersonDataQuery event
    service.Get([], 1, 5).then(
      (res: PersonDataDTO) => {
        res.items.forEach(element => {
          expect(element.PersonDataID).toBeDefined();
          expect(element.DataPriyomu).toBeDefined();
          expect(element.Oklad).toBeDefined();
        });
        done();
      }
    );

  });
});

