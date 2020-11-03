import { TestBed } from '@angular/core/testing';
import {
  EventIds,
  EventProxyLibModule,
  EventProxyLibService,
  ResponseStatus,
  SubscibeToEvent } from 'event-proxy-lib-src';
import { BackendPort, BackendURL } from './helpers/helpers';
import { MaterialsReceiptsAPI } from 'materialsReceipts-uf/services/MaterialsReceiptsAPI';
import { EventBusService } from 'materialsReceipts-uf/services/EventBus.service';
import {
  MaterialsList,
  MaterialsListDTO,
  MaterialsListTablePart,
  MaterialsTableListDTO,
  ReadListQueryParams } from 'materialsReceipts-uf/Models';

/**
 * Subscribe to event
 * @param sourceId source id
 * @param eProxyService event proxy service
 * @param eventId event id we want to subscribe to
 */
async function subscribeToEventAsync(
    sourceId: string,
    eProxyService: EventProxyLibService,
    eventId: EventIds): Promise<void> {

  const subEvent = new SubscibeToEvent(sourceId, [[eventId, 0, 0]]);
  await eProxyService.DispatchEvent(subEvent).toPromise();

}

const tempMaterialList: MaterialsList = {
  Id: 0,
  Number: 123,
  RegisterDateTime: "123",
  SignMark: true,
  SignPerson: "asdf"
}

const tempMaterialListTable: MaterialsListTablePart = {
  LineNumber: 0,
  NameSOne: "0",
  CodeSOne: 0,
  Type: "0",
  PersonMRP: "0",
  Quantity: 0,
  Unit: "0",
  Account: "0",
  MaterialsReceiptsListId: 0
}

const readingResultIds = [
  EventIds.MaterialsReceiptsReadListResults,
  EventIds.MaterialsReceiptsTablePartReadListResults ];

describe('MaterialsReceipts API service', () => {
  let service: MaterialsReceiptsAPI;
  let eventProxyService: EventProxyLibService;
  let eventBusService: EventBusService;
  const sourceId = 'e2eTests_MaterialReceipts';
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

    service = TestBed.inject(MaterialsReceiptsAPI);
    eventProxyService = TestBed.inject(EventProxyLibService);
    eventBusService = TestBed.inject(EventBusService);
    eventProxyService.ApiGatewayURL = backendURL;

    await eventProxyService.ConfirmEvents(sourceId, [], true).toPromise();

    readingResultIds.forEach(element => {
      subscribeToEventAsync(
        sourceId,
        eventProxyService,
        element);
    });
  });

  /**
   * sends events to event bus
   * @param res response to propogate
   */
  function propogateEvent(res: ResponseStatus): void {

    // ignoring empty responses
    if (!res.HttpResult.body) return;

    res.HttpResult.body.Events.forEach(element => {
      if (readingResultIds.includes(element.EventId)) {
        eventBusService.EventBus.next(element);
        eventProxyService.ConfirmEvents(sourceId, [element.AggregateId]).toPromise();
      }
    });
  }

  afterEach(async () => {
    eventProxyService.EndListeningToBackend();
    await eventProxyService.ConfirmEvents(sourceId, [], true).toPromise();
  });

  it('test service creation', () => {
    expect(service).toBeTruthy();
    expect(eventProxyService).toBeTruthy();
    expect(eventBusService).toBeTruthy();
  });

  describe('Material Receipt List Table', () => {

    it('Getting some data', async (done) => {
      // 1. Subscription happens before tests

      // 2. Start listenting to events
      eventProxyService.InitializeConnectionToBackend(sourceId).subscribe(
        (res: ResponseStatus) => propogateEvent(res)
      );

      // 3. Sending query
      const page = 1;
      const limit = 3;
      // TODO: real id should be got
      const materialsReceiptId = 11;

      service.GetMaterialsReceiptsTable(materialsReceiptId, page, limit)
      .then((response: MaterialsTableListDTO) => {
        expect(response.Items.length).toBeLessThanOrEqual(limit);

        const fields = Object.getOwnPropertyNames(tempMaterialListTable);

        response.Items.forEach(element => {
          expect(Object.getOwnPropertyNames(element)).toEqual(fields);
        });

        done();
      });

    });
  });

  describe('Material Receipt List', () => {

    it('Getting some data', async (done) => {
      // 1. Subscription happens before tests

      // 2. Start listenting to events
      eventProxyService.InitializeConnectionToBackend(sourceId).subscribe(
        (res: ResponseStatus) => propogateEvent(res)
      );

      // 3. Sending query
      const page = 1;
      const limit = 3;
      const queryParams: ReadListQueryParams = {
        Page: page,
        Limit: limit
      };

      service.Get(queryParams).then((response: MaterialsListDTO) => {
        expect(response.Items.length).toBeLessThanOrEqual(limit);

        const fields = Object.getOwnPropertyNames(tempMaterialList);

        response.Items.forEach(element => {
          expect(Object.getOwnPropertyNames(element)).toEqual(fields);
        });

        done();
      });

    }, 1000);

  })

})
