import { TestBed } from '@angular/core/testing';
import {
  EventIds,
  EventProxyLibModule,
  EventProxyLibService,
  MaterialsList,
  MaterialsListTablePart,
  ValidationStatus,
  ScanTableData,
  BackendToFrontendEvent,
  MicroFrontendParts} from 'event-proxy-lib-src';
import { BackendPort, BackendURL, delay, genRandomNumber } from './Adds/helpers';
import { MaterialsReceiptsAPI } from 'materialsReceipts-uf/services/MaterialsReceiptsAPI';
import { EventBusService } from 'materialsReceipts-uf/services/EventBusService';
import { ReadListQueryParams } from 'materialsReceipts-uf/Adds/ReadListQueryParams';
import { ScanTableQueryParams } from 'materialsReceipts-uf/Adds/ScanTableQueryParams';

const tempMaterialList: MaterialsList = {
  Id: 0,
  Number: 123,
  RegisterDateTime: "123",
  SignMark: true,
  SignPerson: "asdf",
  Blocked: false
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

const tempScanDataTable: ScanTableData = {
  MaterialsId: 0,
  MaterialsReceiptsListId: 0,
  MaterialsReceiptsTableId: 0,
  Quantity: 0,
  Unit: "",
};

const readingResultIds = [
  EventIds.MaterialsReceiptsReadListResults,
  EventIds.MaterialsReceiptsTablePartReadListResults,
  EventIds.MaterialsReceiptsScanTableReadListResults];

describe('MaterialsReceipts API service', () => {
  let service: MaterialsReceiptsAPI;
  let eventProxyService: EventProxyLibService;
  let eventBusService: EventBusService;
  const sourceId = MicroFrontendParts.MaterialsReceipts.SourceId;
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

  afterEach(async () => {
    eventProxyService.EndListeningToBackend();
    await eventProxyService.ConfirmEventsAsync(sourceId, [], true);
  });

  it('test service creation', () => {
    expect(service).toBeTruthy();
    expect(eventProxyService).toBeTruthy();
    expect(eventBusService).toBeTruthy();
  });

  describe('Material Receipt List Table', () => {

    it('Getting some data', async () => {
      // Start listenting to events
      eventProxyService.InitializeConnectionToBackend(sourceId).subscribe(
        (res: ValidationStatus<BackendToFrontendEvent>) => propogateEvent(res)
      );

      // Sending query
      const page = 1;
      const limit = 3;
      // TODO: real id should be taken
      const materialsReceiptId = 11;

      const response = await service.MaterialsReceiptsTableQueryAsync(materialsReceiptId, page, limit);

      expect(response.HasErrors()).toBeFalse();

      expect(response.Result.MaterialsDataTablePartList.length).toBeLessThanOrEqual(limit);

      const fields = Object.getOwnPropertyNames(tempMaterialListTable);

      response.Result.MaterialsDataTablePartList.forEach(element => {
        expect(Object.getOwnPropertyNames(element)).toEqual(fields);
      });
    });
  });

  describe('Material Receipt ScanTable', () => {

    it('Creating/Deleting scan, event: MaterialsReceiptsScanTable(Add/Remove)', async () => {
      // Start listening to events
      eventProxyService.InitializeConnectionToBackend(sourceId).subscribe(
        (res: ValidationStatus<BackendToFrontendEvent>) => propogateEvent(res)
      );

      // adding new scan
      const randomQuantity = genRandomNumber(100) + 1;
      const randomId = 99999 + genRandomNumber(100) + 1;
      const unit = "cm";

      const newScan: ScanTableData = {
        MaterialsReceiptsListId: randomId,
        MaterialsReceiptsTableId: randomId,
        MaterialsId: randomId,
        Quantity: randomQuantity,
        Unit: unit,
      };

      await service.ScanTableCreateAsync(newScan);
      await delay(1000);

      // checking wheter it was added
      const limit = 1;
      const queryParams: ScanTableQueryParams = {
        Page: 1,
        Limit: limit,
        MaterialReceiptsListId: randomId,
        MaterialReceiptsTableId: randomId,
        MaterialsId: randomId,
      };

      let response = await service.ScanTableQueryAsync(queryParams);
      expect(response.HasErrors()).toBeFalse();

      expect(response.Result.ScanTableDataList.length).toBeGreaterThan(0);
      expect(response.Result.ScanTableDataList[0].Quantity).toBe(randomQuantity);
      expect(response.Result.ScanTableDataList[0].Unit).toBe(unit);

      // deleting that entry
      await service.ScanTableDeleteAsync(newScan);
      await delay(1000);

      // checking if it still exists
      response = await service.ScanTableQueryAsync(queryParams);
      expect(response.HasErrors()).toBeFalse();
      expect(response.Result.ScanTableDataList.length).toBe(0);
    });

    it('Getting some data, event: MaterialsReceiptsScanTableReadList(Query/Results)', async () => {
      // Start listening to events
      eventProxyService.InitializeConnectionToBackend(sourceId).subscribe(
        (res: ValidationStatus<BackendToFrontendEvent>) => propogateEvent(res)
      );

      // Sending query
      // TODO: real id should be got
      const limit = 3;
      const queryParams: ScanTableQueryParams = {
        Page: 1,
        Limit: limit,
        MaterialReceiptsListId: 20,
      };

      const response = await service.ScanTableQueryAsync(queryParams);
      expect(response.Result.ScanTableDataList.length).toBeLessThanOrEqual(limit);

      const expectedFields = Object.getOwnPropertyNames(tempScanDataTable);
      const gotFields = Object.getOwnPropertyNames(response.Result.ScanTableDataList[0]);

      for (let i = 0; i < expectedFields.length; i++) {
        expect(gotFields).toContain(expectedFields[i]);
      }
    });
  });

  describe('Material Receipt List', () => {

    it('Getting some data', async () => {
      // 1. Subscription happens before tests

      // 2. Start listenting to events
      eventProxyService.InitializeConnectionToBackend(sourceId).subscribe(
        (res: ValidationStatus<BackendToFrontendEvent>) => propogateEvent(res)
      );

      // 3. Sending query
      const page = 1;
      const limit = 3;
      const queryParams: ReadListQueryParams = {
        Page: page,
        Limit: limit
      };

      const response = await service.MaterialsReceiptsListQueryAsync(queryParams);
      expect(response.Result.MaterialsDataList.length).toBeLessThanOrEqual(limit);

      const fields = Object.getOwnPropertyNames(tempMaterialList);

      response.Result.MaterialsDataList.forEach(element => {
        expect(Object.getOwnPropertyNames(element)).toEqual(fields);
      });

    });

  })

})
