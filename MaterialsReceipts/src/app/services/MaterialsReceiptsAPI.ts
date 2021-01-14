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
  ResponseStatus,
  ScanTableData
} from 'event-proxy-lib-src';
import { Observable } from 'rxjs';
import { EventBusService } from './EventBusService';
import { ReadListQueryParams } from '../Adds/ReadListQueryParams';
import { ScanTableQueryParams } from '../Adds/ScanTableQueryParams';

@Injectable({
  providedIn: 'root',
})
export class MaterialsReceiptsAPI {
  private sourceInfo = MicroFrontendParts.MaterialsReceipts;

  public constructor(
    private eventProxyService: EventProxyLibService,
    private eventBusService: EventBusService) { }

  /**
   * Get material receipt associated list of entries
   * @param materialsReceiptId material receipt id
   * @param page page
   * @param limit limit
   * @returns Http Response
   */
  public MaterialsReceiptsTableQuery(
    materialsReceiptId?: number,
    page?: number,
    limit?: number): Promise<MaterialsReceiptsTablePartReadListResults> {
      if (page < 1 || limit < 1) {
        throw new Error('page or pagesize is less than 1');
      }

      return new Promise<MaterialsReceiptsTablePartReadListResults>((resolve, reject) => {

        this.materialsReceiptsTableQuery(materialsReceiptId, page, limit)
        .toPromise()
        .then( (responseStatus: ResponseStatus) => {
          if (responseStatus.Failed) {
            reject('Failed to retrieve data');
          }

          const uniqueId = responseStatus.HttpResult.body.Ids[0];

          this.eventBusService.EventBus.subscribe(
            async (data: MaterialsReceiptsTablePartReadListResults) => {
              if (data.ParentId === uniqueId) resolve(data);
            }
          );

          });
        }
      );
  }

  /**
   * Creates new location
   * @param data !
   * @returns ReponseStatus
   */
  public LocationCreate(data: LocationsData): Observable<ResponseStatus> {
    const event = new MaterialsReceiptsLocationsAddRemove(
      this.sourceInfo,
      data,
      MaterialsReceiptsLocationsAddRemoveFlag.Create);

    return this.eventProxyService.DispatchEvent(event);
  }

  /**
   * Creates new material scan
   * @param data MaterialsReceiptsScanTable
   * @returns ResponseStatus
   */
  public ScanTableCreate(data: ScanTableData): Observable<ResponseStatus> {

    const event = new MaterialsReceiptsScanTableAddRemove(
      this.sourceInfo,
      data,
      MaterialsReceiptsScanTableAddRemoveFlag.Create);

    return this.eventProxyService.DispatchEvent(event);
  }

  /**
   * Deletes location
   * @param locationData !
   * @returns ResponseStatus
   */
  public LocationDelete(locationData: LocationsData): Observable<ResponseStatus> {
    const event = new MaterialsReceiptsLocationsAddRemove(
      this.sourceInfo,
      locationData,
      MaterialsReceiptsLocationsAddRemoveFlag.Delete);

    return this.eventProxyService.DispatchEvent(event);
  }

  /**
   * Deletes material scan
   * @param data MaterialsReceiptsScanTable
   * @returns ResponseStatus
   */
  public ScanTableDelete(data: ScanTableData): Observable<ResponseStatus> {
    const event = new MaterialsReceiptsScanTableAddRemove(
      this.sourceInfo,
      data,
      MaterialsReceiptsScanTableAddRemoveFlag.Delete);

    return this.eventProxyService.DispatchEvent(event);
  }

  public MaterialsAtLocationQuery(
    page: number,
    limit: number,
    materialsId?: number,
    locationId?: number)
    : Promise<MaterialsReceiptsMaterialsAtLocationsReadListResults> {

    if (page < 1 || limit < 1) {
      throw new Error('page or pagesize is less than 1');
    }

    return new Promise<MaterialsReceiptsMaterialsAtLocationsReadListResults>((resolve, reject)=> {
      this.materialsAtLocationsQuery(materialsId, locationId, page, limit)
      .toPromise()
      .then((responseStatus: ResponseStatus) => {
        if (responseStatus.Failed) reject('Failed to retrive data');

        const uniqueId = responseStatus.HttpResult.body.Ids[0];

        this.eventBusService.EventBus.subscribe(
          (data: MaterialsReceiptsMaterialsAtLocationsReadListResults) => {
            if (data.ParentId === uniqueId) resolve(data);
          })
      })
    });
  }

  public MaterialsQuery(materialId: number, barCode: string, page?: number, limit?: number)
  : Promise<MaterialsReceiptsMaterialsReadListResults> {
    if (page < 1 || limit < 1) {
      throw new Error('page or pagesize is less than 1');
    }

    return new Promise<MaterialsReceiptsMaterialsReadListResults>((resolve, reject) => {
      this.materialsQuery(materialId, barCode, page, limit)
      .toPromise()
      .then( (responseStatus: ResponseStatus) => {
        if (responseStatus.Failed) reject('Failed to retrive data');

        const uniqueId = responseStatus.HttpResult.body.Ids[0];

        this.eventBusService.EventBus.subscribe(
          (data: MaterialsReceiptsMaterialsReadListResults) => {
            if (data.ParentId === uniqueId) resolve(data);
          }
        );

      })
    });
  }

  public LocationsQuery(locationId: number, page: number, limit: number)
  : Promise<MaterialsReceiptsLocationsReadListResults> {
    if (page < 1 || limit < 1) {
      throw new Error('page or pagesize is less than 1');
    }

    return new Promise<MaterialsReceiptsLocationsReadListResults>((resolve, reject) => {
      this.locationsQuery(locationId, page, limit).toPromise()
      .then((responseStatus: ResponseStatus) => {
        if (responseStatus.Failed) reject('Failed to retrive data');

        const uniqueId = responseStatus.HttpResult.body.Ids[0];

        this.eventBusService.EventBus.subscribe(
          (data: MaterialsReceiptsLocationsReadListResults) => {
            if (data.ParentId === uniqueId) resolve(data);
          }
        );

      })
    });
  }

  /**
   * Queries scan table
   * @param queryParams scan table query params
   * @returns Promise with MaterialsReceiptsScanTableReadListResults
   */
  public ScanTableQuery(queryParams: ScanTableQueryParams)
  : Promise<MaterialsReceiptsScanTableReadListResults> {

      if (queryParams.Page < 1 || queryParams.Limit < 1) {
        throw new Error('page or pagesize is less than 1');
      }

      return new Promise<MaterialsReceiptsScanTableReadListResults>((resolve, reject) => {
        const getResponse = this.scanTableQuery(queryParams).toPromise();

        getResponse.then( (responseStatus: ResponseStatus) => {
          if (responseStatus.Failed) reject('Failed to retrieve data');

          const uniqueId = responseStatus.HttpResult.body.Ids[0];

          this.eventBusService.EventBus.subscribe(
            (data: MaterialsReceiptsScanTableReadListResults) => {
              if (data.ParentId === uniqueId)
                resolve(data);
            }
          );

        })
      });
  }

  /**
   * Queries Material Receipt List
   * @param queryParams Query Class params
   * @returns Http Response
   */
  public MaterialsReceiptsListQuery(queryParams: ReadListQueryParams): Promise<MaterialsReceiptsReadListResults> {
    if (queryParams.Page < 1 || queryParams.Limit < 1) {
      throw new Error('page or pagesize is less than 1');
    }

    return new Promise<MaterialsReceiptsReadListResults>((resolve, reject) => {

        const getResponse = this.materialsReceiptsListQuery(queryParams).toPromise();

        getResponse.then( (responseStatus: ResponseStatus) => {
          if (responseStatus.Failed) {
            reject('Failed to retrieve data');
          }

          const uniqueId = responseStatus.HttpResult.body.Ids[0];

          this.eventBusService.EventBus.subscribe(
            async (data: MaterialsReceiptsReadListResults) => {
              if (data.ParentId === uniqueId) resolve(data);
            });

        });
      }
    );
  }

  /**
   * Gets Material Receipt List
   * @param queryParams Query Class params
   * @returns Http Response
   */
  private materialsReceiptsListQuery(queryParams: ReadListQueryParams)
    : Observable<ResponseStatus> {

    const event = new MaterialsReceiptsReadListQuery(
      this.sourceInfo,
      queryParams.DateFrom,
      queryParams.DateUntil,
      queryParams.Signed,
      queryParams.Page,
      queryParams.Limit);

    event.SubscribeToChildren = true;

    return this.eventProxyService.DispatchEvent(event);
  }

  /**
   * Get material receipt associated list of entries
   * @param materialsReceiptId material receipt id
   * @param page page
   * @param limit limit
   * @returns ResponseStatus
   */
  private materialsReceiptsTableQuery(
    materialsReceiptId?: number,
    page?: number,
    limit?: number): Observable<ResponseStatus> {

    const event = new MaterialsReceiptsTablePartReadListQuery(
      this.sourceInfo, materialsReceiptId, page, limit);

    event.SubscribeToChildren = true;

    return this.eventProxyService.DispatchEvent(event);
  }

  /**
   * Queries scan table
   * @param queryParams query parameteres
   * @returns ResponseStatus
   */
  private scanTableQuery(queryParams: ScanTableQueryParams): Observable<ResponseStatus> {

    const event = new MaterialsReceiptsScanTableReadListQuery(
      this.sourceInfo,
      queryParams.ScanTableId,
      queryParams.MaterialsId,
      queryParams.MaterialReceiptsListId,
      queryParams.MaterialReceiptsTableId,
      queryParams.Page,
      queryParams.Limit);

    event.SubscribeToChildren = true;

    return this.eventProxyService.DispatchEvent(event);
  }

  /**
   * Queries location
   * @param locationsId location id
   * @param page !
   * @param limit !
   * @returns ResponseStatus
   */
  private locationsQuery(locationsId?: number, page?: number, limit?: number): Observable<ResponseStatus> {
    const event = new MaterialsReceiptsLocationsReadListQuery(
      this.sourceInfo, locationsId, page, limit);

    event.SubscribeToChildren = true;

    return this.eventProxyService.DispatchEvent(event);
  }

  /**
   * Queries materials
   * @param materialsId !
   * @param barCode !
   * @param page !
   * @param limit !
   * @returns Observable of Response Status
   */
  private materialsQuery(materialsId?: number, barCode?: string, page?: number, limit?: number)
  : Observable<ResponseStatus> {
    const event = new MaterialsReceiptsMaterialsReadListQuery(
      this.sourceInfo, materialsId, barCode, page, limit);

    event.SubscribeToChildren = true;

    return this.eventProxyService.DispatchEvent(event);
  }

  /**
   * Queries materials at location
   * @param materialsId !
   * @param locationId !
   * @param page !
   * @param limit !
   * @returns Observable of ResponseStatus
   */
  private materialsAtLocationsQuery(
    materialsId?: number,
    locationId?: number,
    page?: number,
    limit?: number): Observable<ResponseStatus> {
    const event = new MaterialsReceiptsMaterialsAtLocationsReadListQuery(
      this.sourceInfo, materialsId, locationId, page, limit);

    event.SubscribeToChildren = true;

    return this.eventProxyService.DispatchEvent(event);
  }
}
