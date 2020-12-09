import { TestBed } from '@angular/core/testing';
import {
  EventIds,
  EventProxyLibModule,
  EventProxyLibService,
  ResponseStatus } from 'event-proxy-lib-src';
import { BackendPort, BackendURL, delay, genRandomNumber } from './helpers/helpers';
import { MaterialsReceiptsAPI } from 'materialsReceipts-uf/services/MaterialsReceiptsAPI';
import { EventBusService } from 'materialsReceipts-uf/services/EventBus.service';
import {
  MaterialsList,
  MaterialsListDTO,
  MaterialsListTablePart,
  MaterialsTableListDTO,
  ReadListQueryParams,
  ScanTableData,
  ScanTableQueryParams} from 'materialsReceipts-uf/Models';
import { MaterialsReceiptsScanTableReadListResults } from 'materialsReceipts-uf/Models/BackendEvents';

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

fdescribe('MaterialsReceipts API service', () => {
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
      // Start listenting to events
      eventProxyService.InitializeConnectionToBackend(sourceId).subscribe(
        (res: ResponseStatus) => propogateEvent(res)
      );

      // Sending query
      const page = 1;
      const limit = 3;
      // TODO: real id should be got
      const materialsReceiptId = 11;

      service.MaterialsReceiptsTableQuery(materialsReceiptId, page, limit)
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

  describe('Material Receipt ScanTable', () => {

    it('Creating/Deleting scan, event: MaterialsReceiptsScanTable(Add/Remove)', async (done) => {
      // Start listening to events
        eventProxyService.InitializeConnectionToBackend(sourceId).subscribe(
        (res: ResponseStatus) => propogateEvent(res)
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

      service.ScanTableCreate(newScan).toPromise();
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

      service.ScanTableQuery(queryParams)
      .then((response: MaterialsReceiptsScanTableReadListResults) => {

        expect(response.ScanTableDataList.length).toBeGreaterThan(0);
        expect(response.ScanTableDataList[0].Quantity).toBe(randomQuantity);
        expect(response.ScanTableDataList[0].Unit).toBe(unit);
      });

      // deleting that entry
      service.ScanTableDelete(newScan).toPromise();
      await delay(1000);

      // checking it does not exist no more
      service.ScanTableQuery(queryParams)
      .then((response: MaterialsReceiptsScanTableReadListResults) => {

        expect(response.ScanTableDataList.length).toBe(0);
        done();
      });

    });

    it('Getting some data, event: MaterialsReceiptsScanTableReadList(Query/Results)', async (done) => {
      // Start listening to events
      eventProxyService.InitializeConnectionToBackend(sourceId).subscribe(
        (res: ResponseStatus) => propogateEvent(res)
      );

      // Sending query
      // TODO: real id should be got
      const limit = 3;
      const queryParams: ScanTableQueryParams = {
        Page: 1,
        Limit: limit,
        MaterialReceiptsListId: 20,
      };

      service.ScanTableQuery(queryParams)
      .then((response: MaterialsReceiptsScanTableReadListResults) => {
        console.log(response);
        expect(response.ScanTableDataList.length).toBeLessThanOrEqual(limit);

        const expectedFields = Object.getOwnPropertyNames(tempScanDataTable);
        const gotFields = Object.getOwnPropertyNames(response.ScanTableDataList[0]);

        for (let i = 0; i < expectedFields.length; i++) {
          expect(gotFields).toContain(expectedFields[i]);
        }

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

      service.MaterialsReceiptsListQuery(queryParams).then((response: MaterialsListDTO) => {
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
