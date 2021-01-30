import { TestBed } from '@angular/core/testing';
import {
  BackendToFrontendEvent,
  EventIds,
  EventProxyLibModule,
  EventProxyLibService,
  MicroFrontendParts,
  PersonData,
  PersonDataRead,
  ValidationStatus } from 'event-proxy-lib-src';
import { BackendPort, BackendURL, delay, genRandomNumber } from './Adds/helpers';
import { PersonnelAPI } from 'personnel-uf/services/PersonnelAPI';
import { EventBusService } from 'personnel-uf/services/EventBus.service';

describe('PersonnelAPI service', () => {
  let service: PersonnelAPI;
  let eventProxyService: EventProxyLibService;
  let eventBusService: EventBusService;
  const sourceId = MicroFrontendParts.Personnel.SourceId;
  const backendURL = BackendURL;
  const backendPort = BackendPort;

  const readingResultIds = [
    EventIds.ReadPersonData,
  ];

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
    service = TestBed.inject(PersonnelAPI);
    eventProxyService = TestBed.inject(EventProxyLibService);
    eventBusService = TestBed.inject(EventBusService);
    eventProxyService.ApiGatewayURL = backendURL;

    await eventProxyService.ConfirmEventsAsync(sourceId, [], true);
  });

  afterEach(async () => {
    eventProxyService.EndListeningToBackend();
    await eventProxyService.ConfirmEventsAsync(sourceId, [], true);
  });

  /**
   * sends events to event bus
   * @param res response to propogate
   */
  function propogateEvent(res: ValidationStatus<BackendToFrontendEvent>): void {

    // ignoring empty responses
    if (res.Result == null) return;

    res.Result.Events.forEach(async element => {
      if (readingResultIds.includes(element.EventId)) {
        eventBusService.EventBus.next(element);
        await eventProxyService.ConfirmEventsAsync(sourceId, [element.AggregateId]);
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
    it('should update existing PersonData entry', async () => {
      // Sub to ReadPersonData

      // Start listenting to events
      eventProxyService.InitializeConnectionToBackend(sourceId).subscribe(
        (res: ValidationStatus<BackendToFrontendEvent>) => propogateEvent(res)
      );

      // Get entry
      let response = await service.GetAsync([], 1, 5);
      expect(response.Result.CommonNumberRecords).toBeGreaterThan(0);
      const entryToUpdate = response.Result.ListOutputEnterprisePersonData[0];

      // change something
      const newField = `new field (${genRandomNumber(100)})`;
      entryToUpdate.KodDRFO = newField;
      entryToUpdate.PIP = newField;
      await service.UpdateAsync(entryToUpdate);

      // compare entry
      response = await service.GetAsync([], 1, 5);
      for (const iterator of response.Result.ListOutputEnterprisePersonData) {
        if (entryToUpdate.PersonDataID === iterator.PersonDataID) {
          expect(entryToUpdate.KodDRFO).toBe(newField);
          expect(entryToUpdate.PIP).toBe(newField);
        }
      }
    });
  });

  it('should create and delete Person data entry', async () => {
    const newPersonnelData = createPersonnelEntry();
    // 1. Subscription is happening before tests in beforeAll

    // 2. Start listenting to events
    eventProxyService.InitializeConnectionToBackend(sourceId).subscribe(
      (res: ValidationStatus<BackendToFrontendEvent>) => propogateEvent(res)
    );

    // 3. Get current length
    let response = await service.GetAsync([], 1, 5);
    const id = response.Result.ListOutputEnterprisePersonData[0].PersonDataID;
    const currentLen = response.Result.CommonNumberRecords;

    // 4. create new persondata
    await service.CreateAsync(newPersonnelData);
    await delay(500);

    response = await service.GetAsync([], 1, 5);
    expect(response.Result.CommonNumberRecords).toBeGreaterThan(currentLen);

    // 5. delete an entry
    await service.DeleteAsync(id);
    await delay(500);

    response = await service.GetAsync([], 1, 5);
    expect(response.Result.CommonNumberRecords).toEqual(currentLen);
  });


  for (let index = 0; index < 1; index++) {
    it('should create new PersonData entry', async () => {
      const newPersonnelData = createPersonnelEntry();

      // Start listenting to events
      eventProxyService.InitializeConnectionToBackend(sourceId).subscribe(
        (res: ValidationStatus<BackendToFrontendEvent>) => propogateEvent(res)
      );

      // Get current length
      let response = await service.GetAsync([], 1, 1);
      const currentLen = response.Result.CommonNumberRecords;

      // 4. create new persondata
      await service.CreateAsync(newPersonnelData);
      await delay(500);

      // 5. compare length
      response = await service.GetAsync([], 1, 10);
      expect(response.Result.CommonNumberRecords).toBeGreaterThan(currentLen);

    });
  }

  it('should get events after ReadPersonDataQuery', async () => {
    // Start listenting to events
    eventProxyService.InitializeConnectionToBackend(sourceId).subscribe(
      (res: ValidationStatus<BackendToFrontendEvent>) => propogateEvent(res)
    );

    // Send ReadPersonDataQuery event
    const response = await service.GetAsync([], 1, 5);

    response.Result.ListOutputEnterprisePersonData.forEach(element => {
      expect(element.PersonDataID).toBeDefined();
      expect(element.DataPriyomu).toBeDefined();
      expect(element.Oklad).toBeDefined();
    });
  });
});

