import { TestBed } from '@angular/core/testing';
import {
  EventIds,
  EventProxyLibModule,
  EventProxyLibService,
  PersonData,
  PersonDataRead,
  ValidationStatus } from 'event-proxy-lib-src';
import { BackendPort, BackendURL, genRandomNumber } from './Adds/helpers';
import { PersonnelAPIService } from 'personnel-uf/services/PersonnelAPI.service';
import { EventBusService } from 'personnel-uf/services/EventBus.service';

describe('PersonnelAPI service', () => {
  let service: PersonnelAPIService;
  let eProxyService: EventProxyLibService;
  let eventBusService: EventBusService;
  const sourceId = 'PersonnelAPI_testing';
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
    service = TestBed.inject(PersonnelAPIService);
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

    if (!res.HttpResult.body) return;

    res.HttpResult.body.Events.forEach(element => {
      if (element.EventId === EventIds.ReadPersonData) {
        console.log(element);
        eProxyService.ConfirmEventsAsync(sourceId, [element.AggregateId]).toPromise();
        eventBusService.EventBus.next(element);
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
      // Sub to ReadPersonData

      // Start listenting to events
      eProxyService.InitializeConnectionToBackend(sourceId).subscribe(
        (res: ValidationStatus) => propogateEvent(res));

      // Get entry
      let entryToUpdate: PersonData;

      await service.Get([], 1, 5).then(
        (res: PersonDataRead) => {
          if (res.CommonNumberRecords === 0) {
            done.fail('no entries found');
          }
          entryToUpdate = res.ListOutputEnterprisePersonData[0];
        }
      );

      // change something
      const newField = `new field (${genRandomNumber(100)})`;
      entryToUpdate.KodDRFO = newField;
      entryToUpdate.PIP = newField;
      await service.Update(entryToUpdate);

      // 5. compare entry
      await service.Get([], 1, 5).then(
        (res: PersonDataRead) => {
          for (const iterator of res.ListOutputEnterprisePersonData) {
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
      (res: ValidationStatus) => {
        propogateEvent(res);
    });

    // 3. Get current length
    let currentLen: number;
    let id: number;

    await service.Get([], 1, 5).then(
      (res: PersonDataRead) => {
        id = res.ListOutputEnterprisePersonData[0].PersonDataID;
        currentLen = res.CommonNumberRecords;
      }
    );

    // 4. create new persondata
    await service.Create(newPersonnelData);

    await service.Get([], 1, 5).then(
      (res: PersonDataRead) => {
        expect(res.CommonNumberRecords).toBeGreaterThan(currentLen);
      }
    );

    // 5. delete an entry
    await service.Delete(id);

    await service.Get([], 1, 5).then(
      (res: PersonDataRead) => {
        expect(res.CommonNumberRecords).toEqual(currentLen);
        done();
      }
    );
  }, 6000);

  for (let index = 0; index < 1; index++) {
    it('should create new PersonData entry', async (done) => {
      const newPersonnelData = createPersonnelEntry();

      // Start listenting to events
      eProxyService.InitializeConnectionToBackend(sourceId).subscribe(
        (res: ValidationStatus) => {
          propogateEvent(res);
        },
        (err) => { done.fail(err); },
      );

      // Get current length
      let currentLen: number;
      await service.Get([], 1, 1).then(
        (res: PersonDataRead) => {
          currentLen = res.CommonNumberRecords;
        }
      );

      // 4. create new persondata
      await service.Create(newPersonnelData).then(() => {
          // 5. compare length
          service.Get([], 1, 10).then(
            (res: PersonDataRead) => {
              expect(res.CommonNumberRecords).toBeGreaterThan(currentLen);
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
    // Start listenting to events
    eProxyService.InitializeConnectionToBackend(sourceId).subscribe(
      (res: ValidationStatus) => {
        propogateEvent(res);
    });

    // Send ReadPersonDataQuery event
    service.Get([], 1, 5).then(
      (res: PersonDataRead) => {
        res.ListOutputEnterprisePersonData.forEach(element => {
          expect(element.PersonDataID).toBeDefined();
          expect(element.DataPriyomu).toBeDefined();
          expect(element.Oklad).toBeDefined();
        });
        done();
      }
    );

  }, 5000);
});

