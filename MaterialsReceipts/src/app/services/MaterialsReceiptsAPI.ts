import { Injectable } from '@angular/core';
import {
  EventProxyLibService,
  LocationsData,
  MaterialsReceiptsLocationsAddRemove,
  MaterialsReceiptsLocationsAddRemoveFlag,
  MaterialsReceiptsLocationsReadListQuery,
  MaterialsReceiptsLocationsReadListResults,
  MaterialsReceiptsMaterialsAtLocationsReadListQuery,
  MaterialsReceiptsMaterialsAtLocationsReadListResults,
  MaterialsReceiptsMaterialsReadListQuery,
  MaterialsReceiptsMaterialsReadListResults,
  MaterialsReceiptsReadListQuery,
  MaterialsReceiptsReadListResults,
  MaterialsReceiptsScanTableAddRemove,
  MaterialsReceiptsScanTableAddRemoveFlag,
  MaterialsReceiptsScanTableReadListQuery,
  MaterialsReceiptsScanTableReadListResults,
  MaterialsReceiptsTablePartReadListQuery,
  MaterialsReceiptsTablePartReadListResults,
  MicroFrontendParts,
  ValidationStatus,
  ScanTableData,
  BackendToFrontendEvent,
  CoreEvent,
  MaterialsData,
  MaterialsReceiptsMaterials,
  MaterialsReceiptsMaterialsAddRemoveFlag,
  OrchestratorTeam1BarCodeDetailsQuery,
  OrchestratorTeam1BarCodeDetailsResult,
  EventIds,
  MaterialsReceiptsMaterialsQueryListIds
} from 'event-proxy-lib-src';
import { EventBusService } from './EventBusService';
import { ReadListQueryParams } from '../Adds/ReadListQueryParams';
import { ScanTableQueryParams } from '../Adds/ScanTableQueryParams';

@Injectable({
  providedIn: 'root',
})
export class MaterialsReceiptsAPI {
  private sourceInfo = MicroFrontendParts.MaterialsReceipts;

  public constructor(private eventProxyService: EventProxyLibService, private eventBusService: EventBusService) { }
  
  /**
   * Gets existing barcodes from all entries in specified Materials Receipts 
   * @param materialReceiptId MaterialsReceiptsList Id
   * @returns ValidationStatus with OrchestratorTeam1BarCodeDetailsResult
   */
  public async BarCodesByMaterialReceiptQueryAsync(materialReceiptId: number): Promise<ValidationStatus<OrchestratorTeam1BarCodeDetailsResult>> {
    const event = new OrchestratorTeam1BarCodeDetailsQuery(this.sourceInfo, materialReceiptId);
    event.SubscribeToChildren = true;
    event.SubscribeToChildrenEventIds = [ EventIds.OrchestratorTeam1BarCodeDetailsResult ];

    const request = await this.eventProxyService.DispatchEventAsync(event);

    return this.waitForResults<OrchestratorTeam1BarCodeDetailsResult>(request);
  }

  /**
   * Query multiple Material elements
   * @param materialIdList List of MaterialElement ids
   */
  public async MaterialsQueryByListAsync(materialIdList: number[]): Promise<ValidationStatus<MaterialsReceiptsMaterialsReadListResults>> {
    const event = new MaterialsReceiptsMaterialsQueryListIds(this.sourceInfo, materialIdList);
    event.SubscribeToChildren = true;

    const request = await this.eventProxyService.DispatchEventAsync(event);

    return this.waitForResults<MaterialsReceiptsMaterialsReadListResults>(request);
  }

  /**
   * Query materials
   * @param materialId id
   * @param barCode material's barcode
   * @param page which page to query
   * @param limit limit of entries per page
   * @returns ValidationStatus with MaterialsReceiptsMaterialsReadListResults
   */
  public async MaterialsQueryAsync(materialId?: number, barCode?: string, page?: number, limit?: number): Promise<ValidationStatus<MaterialsReceiptsMaterialsReadListResults>> {

    const event = new MaterialsReceiptsMaterialsReadListQuery(
      this.sourceInfo, materialId, barCode, page, limit);
    event.SubscribeToChildren = true;

    const request = await this.eventProxyService.DispatchEventAsync(event);

    if (request.HasErrors()) return Promise.reject(request.ErrorList.toString());

    const uniqueId = request.Result.Ids[0];

    const responsePromise = new Promise<MaterialsReceiptsMaterialsReadListResults>((resolve) => {
      this.eventBusService.EventBus.subscribe((data: MaterialsReceiptsMaterialsReadListResults) => {
        if (data.ParentId == uniqueId) resolve(data);
      });
    })

    return this.eventProxyService.RacePromiseAsync(responsePromise);
  }

  /**
   * Creates a material
   * @param materialsData MaterialsElement representation
   * @returns Promise with ReponseStatus
   */
  public MaterialCreateAsync(materialsData: MaterialsData): Promise<ValidationStatus<BackendToFrontendEvent>> {
    const event = new MaterialsReceiptsMaterials(this.sourceInfo, materialsData, MaterialsReceiptsMaterialsAddRemoveFlag.Create);
    return this.eventProxyService.DispatchEventAsync(event);
  }
  
  /**
   * Deletes a material by id
   * @param materialsData MaterialsElement representation
   * @returns Promise with ReponseStatus
   */
  public MaterialDeleteAsync(materialsData: MaterialsData): Promise<ValidationStatus<BackendToFrontendEvent>> {
    const event = new MaterialsReceiptsMaterials(this.sourceInfo, materialsData, MaterialsReceiptsMaterialsAddRemoveFlag.Delete);
    return this.eventProxyService.DispatchEventAsync(event);
  }

  /**
   * Get material receipt associated list of entries
   * @param materialsReceiptId material receipt id
   * @param page page
   * @param limit limit
   * @returns ValidationStatus with MaterialsReceiptsTablePartReadListResults
   */
  public async MaterialsReceiptsTableQueryAsync(materialsReceiptId?: number, page?: number, limit?: number): Promise<ValidationStatus<MaterialsReceiptsTablePartReadListResults>> {
    const event = new MaterialsReceiptsTablePartReadListQuery(
      this.sourceInfo, materialsReceiptId, page, limit);
    event.SubscribeToChildren = true;
    const request = await this.eventProxyService.DispatchEventAsync(event);

    return this.waitForResults<MaterialsReceiptsTablePartReadListResults>(request);
  }

  /**
   * Creates new location
   * @param data new location data
   * @returns ReponseStatus
   */
  public LocationCreateAsync(data: LocationsData): Promise<ValidationStatus<BackendToFrontendEvent>> {
    const event = new MaterialsReceiptsLocationsAddRemove(
      this.sourceInfo,
      data,
      MaterialsReceiptsLocationsAddRemoveFlag.Create);

    return this.eventProxyService.DispatchEventAsync(event);
  }

  /**
   * Creates new material scan
   * @param data MaterialsReceiptsScanTable
   * @returns ValidationStatus
   */
  public ScanTableCreateAsync(data: ScanTableData): Promise<ValidationStatus<BackendToFrontendEvent>> {
    const event = new MaterialsReceiptsScanTableAddRemove(
      this.sourceInfo,
      data,
      MaterialsReceiptsScanTableAddRemoveFlag.Create);

    return this.eventProxyService.DispatchEventAsync(event);
  }

  /**
   * Deletes location
   * @param locationData location information
   * @returns ValidationStatus
   */
  public LocationDeleteAsync(locationData: LocationsData): Promise<ValidationStatus<BackendToFrontendEvent>> {
    const event = new MaterialsReceiptsLocationsAddRemove(
      this.sourceInfo,
      locationData,
      MaterialsReceiptsLocationsAddRemoveFlag.Delete);

    return this.eventProxyService.DispatchEventAsync(event);
  }

  /**
   * Deletes material scan
   * @param data MaterialsReceiptsScanTable
   * @returns ValidationStatus
   */
  public ScanTableDeleteAsync(data: ScanTableData): Promise<ValidationStatus<BackendToFrontendEvent>> {
    const event = new MaterialsReceiptsScanTableAddRemove(
      this.sourceInfo,
      data,
      MaterialsReceiptsScanTableAddRemoveFlag.Delete);

    return this.eventProxyService.DispatchEventAsync(event);
  }

  /**
   *
   * @param page which page to query
   * @param limit limit of entries per page
   * @param materialsId material's id
   * @param locationId location's id
   * @returns ValidationStatus
   */
  public async MaterialsAtLocationQueryAsync(page: number, limit: number, materialsId?: number, locationId?: number): Promise<ValidationStatus<MaterialsReceiptsMaterialsAtLocationsReadListResults>> {

    const event = new MaterialsReceiptsMaterialsAtLocationsReadListQuery(
      this.sourceInfo, materialsId, locationId, page, limit);
    event.SubscribeToChildren = true;
    const request = await this.eventProxyService.DispatchEventAsync(event);

    return this.waitForResults<MaterialsReceiptsMaterialsAtLocationsReadListResults>(request);
  }

  /**
   * Query locations
   * @param locationId location id
   * @param page which page to query
   * @param limit limit of entries per page
   * @returns ValidationStatus with MaterialsReceiptsLocationsReadListResults if čiki-piki
   */
  public async LocationsQueryAsync(locationId: number, page?: number, limit?: number): Promise<ValidationStatus<MaterialsReceiptsLocationsReadListResults>> {
    const event = new MaterialsReceiptsLocationsReadListQuery(
      this.sourceInfo, locationId, page, limit);
    event.SubscribeToChildren = true;
    const request = await this.eventProxyService.DispatchEventAsync(event);

    if (request.HasErrors()) return Promise.reject(request.ErrorList.toString());

    const uniqueId = request.Result.Ids[0];

    const responsePromise = new Promise<MaterialsReceiptsLocationsReadListResults>((resolve) => {
      this.eventBusService.EventBus.subscribe((data: MaterialsReceiptsLocationsReadListResults) => {
        if (data.ParentId === uniqueId) resolve(data);
      });
    })

    return this.eventProxyService.RacePromiseAsync(responsePromise);
  }

  /**
   * Queries scan table
   * @param queryParams scan table query params
   * @returns Promise with MaterialsReceiptsScanTableReadListResults
   */
  public async ScanTableQueryAsync(queryParams: ScanTableQueryParams): Promise<ValidationStatus<MaterialsReceiptsScanTableReadListResults>> {
    const event = new MaterialsReceiptsScanTableReadListQuery(
      this.sourceInfo,
      queryParams.ScanTableId,
      queryParams.MaterialsId,
      queryParams.MaterialReceiptsListId,
      queryParams.MaterialReceiptsTableId,
      queryParams.Page,
      queryParams.Limit);
    event.SubscribeToChildren = true;

    const request = await this.eventProxyService.DispatchEventAsync(event);

    if (request.HasErrors()) return Promise.reject(request.ErrorList.toString());

    const uniqueId = request.Result.Ids[0];

    const responsePromise = new Promise<MaterialsReceiptsScanTableReadListResults>((resolve) => {
      this.eventBusService.EventBus.subscribe((data: MaterialsReceiptsScanTableReadListResults) => {
        if (data.ParentId === uniqueId) { resolve(data);}
      });
    })

    return this.eventProxyService.RacePromiseAsync(responsePromise);
  }

  /**
   * Queries Material Receipt List
   * @param queryParams Query Class params
   * @returns Http Response
   */
  public async MaterialsReceiptsListQueryAsync(queryParams: ReadListQueryParams): Promise<ValidationStatus<MaterialsReceiptsReadListResults>> {
    const event = new MaterialsReceiptsReadListQuery(
      this.sourceInfo,
      queryParams.DateFrom,
      queryParams.DateUntil,
      queryParams.Signed,
      queryParams.Page,
      queryParams.Limit);
    event.SubscribeToChildren = true;
    const request = await this.eventProxyService.DispatchEventAsync(event);

    if (request.HasErrors()) return Promise.reject(request.ErrorList.toString());

    const uniqueId = request.Result.Ids[0];

    const responsePromise = new Promise<MaterialsReceiptsReadListResults>((resolve) => {
      this.eventBusService.EventBus.subscribe((data: MaterialsReceiptsReadListResults) => {
        if (data.ParentId === uniqueId) resolve(data);
      });
    })

    return this.eventProxyService.RacePromiseAsync(responsePromise);
  }

  /**
   * Experimental wrapper for requests, not sure if it's good idea to use it as it adds layer of complexity and it is easier to read simple longer code than complex few-liners
   * @param request request which returns id (currently only one)
   * @returns Promise of ValidationStatus with T which is event that extends CoreEvent
   */
  private async waitForResults<T extends CoreEvent>(request: ValidationStatus<BackendToFrontendEvent>): Promise<ValidationStatus<T>> {
    if (request.HasErrors()) return Promise.reject(request.ErrorList.toString());

    const uniqueId = request.Result.Ids[0];

    const responsePromise = new Promise<T>((resolve) => {
      this.eventBusService.EventBus.subscribe((data: CoreEvent) => {
        if (data.ParentId === uniqueId) resolve(<T>data);
      });
    })

    return this.eventProxyService.RacePromiseAsync(responsePromise);
  }
}
