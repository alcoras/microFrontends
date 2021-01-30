import { TestBed } from '@angular/core/testing';
import {
  BackendToFrontendEvent,
  EventIds,
  EventProxyLibModule,
  EventProxyLibService,
  MicroFrontendParts,
  OccupationData,
  ValidationStatus } from 'event-proxy-lib-src';
import { BackendPort, BackendURL, delay, genRandomNumber } from './Adds/helpers';
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

const readingResultIds = [
  EventIds.OccupationsRead,
];

describe('Occupation API service', () => {
  let service: OccupationAPIService;
  let eventProxyService: EventProxyLibService;
  let eventBusService: EventBusService;
  const sourceId = MicroFrontendParts.Occupations.SourceId;
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

  it('test service creation', () => {
    expect(service).toBeTruthy();
    expect(eventProxyService).toBeTruthy();
    expect(eventBusService).toBeTruthy();
  });

  describe('Get', () => {

    it('should get events after Occupation query', async () => {
      // Start listening to events
      eventProxyService.InitializeConnectionToBackend(sourceId).subscribe(
        (res: ValidationStatus<BackendToFrontendEvent>) => propogateEvent(res)
      );

      // Send OccupationReadDataQuery event
      const page = 1;
      const limit = 3;

      const res = await service.GetAsync(page, limit);

      expect(res.Result.OccupationDataList.length).toBeLessThanOrEqual(limit);
      res.Result.OccupationDataList.forEach(element => {
        expect(element.DocReestratorId).toBeDefined();
        expect(element.TariffCategory).toBeDefined();
        expect(element.Name).toBeDefined();
        expect(element.OccupationAggregateIdHolderId).toBeDefined();
      });

    });
  });

  describe('Combination', () => {
    it('should create and then delete entry', async () => {
      const newEntry = createOccupationEntry();
      // Start listening to events
      eventProxyService.InitializeConnectionToBackend(sourceId).subscribe(
        (res: ValidationStatus<BackendToFrontendEvent>) => propogateEvent(res)
      );

      // Get current length and id

      let response = await service.GetAsync(1, 1);
      expect(response.HasErrors()).toBeFalse();
      const id = response.Result.OccupationDataList[0].OccupationAggregateIdHolderId;
      const currentLen = response.Result.TotalRecordsAmount;

      // create new occupation entry
      await service.CreateAsync(newEntry);

      response = await service.GetAsync(1, 1000);
      expect(response.Result.TotalRecordsAmount).toBeGreaterThan(currentLen);

      //  delete an entry
      await service.DeleteAsync(id);

      response = await service.GetAsync(1, 1);
      expect(response.Result.TotalRecordsAmount).toEqual(currentLen);
    }, 6000);
  });

  describe('Update', () => {

    it('should update existing Occupation entry', async () => {

      // Start listening to events
      eventProxyService.InitializeConnectionToBackend(sourceId).subscribe(
        (res: ValidationStatus<BackendToFrontendEvent>) => propogateEvent(res)
      );

      // Get entry
      let response = await service.GetAsync(1, 1);
      expect(response.HasErrors()).toBeFalse();
      expect(response.Result.TotalRecordsAmount).toBeGreaterThan(0);
      const entryToUpdate = response.Result.OccupationDataList[0];

      // change name
      const newName = `new Name (${genRandomNumber(100)})`;
      entryToUpdate.Name = newName;
      entryToUpdate.DocReestratorId = 1; // TODO: for demo purposes
      await service.UpdateAsync(entryToUpdate);

      // compare entry
      response = await service.GetAsync(1, 5);

      for (const iterator of response.Result.OccupationDataList) {
        if (entryToUpdate.OccupationAggregateIdHolderId === iterator.OccupationAggregateIdHolderId) {
          expect(entryToUpdate.Name).toBe(newName);
        }
      }

    });
  });

  describe('Create', () => {

    for (let index = 0; index < 1; index++) {
    it('should create new Occupation entry', async () => {
      const newOccupationData = createOccupationEntry();

      // Start listening to events
      eventProxyService.InitializeConnectionToBackend(sourceId).subscribe(
        (res: ValidationStatus<BackendToFrontendEvent>) => propogateEvent(res)
      );

      // Get current length
      let response = await service.GetAsync(1, 1);
      const currentLen = response.Result.TotalRecordsAmount;

      // create new occupation entry
      await service.CreateAsync(newOccupationData);
      await delay(1000);

      response = await service.GetAsync(1, 1);
      expect(response.Result.TotalRecordsAmount).toBeGreaterThan(currentLen);
    });
  }

  });
});

