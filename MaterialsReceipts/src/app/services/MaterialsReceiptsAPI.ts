import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  EventProxyLibService,
  ResponseStatus,
  MicroFrontendParts
} from 'event-proxy-lib-src'
;

import {
  MaterialsReceiptsReadListQuery,
  MaterialsReceiptsReadListResults,
  MaterialsReceiptsScanTableAddRemove,
  MaterialsReceiptsScanTableAddRemoveFlag,
  MaterialsReceiptsScanTableReadListQuery,
  MaterialsReceiptsScanTableReadListResults,
  MaterialsReceiptsTablePartReadListQuery,
  MaterialsReceiptsTablePartReadListResults
} from '../Models/BackendEvents/index';

import {
  MaterialsListDTO,
  MaterialsReceiptsScanTable,
  MaterialsTableListDTO,
  ReadListQueryParams,
  ScanTableQueryParams} from '../Models/index';

import { EventBusService } from './EventBus.service';

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
  public GetMaterialsReceiptsTable(
    materialsReceiptId?: number,
    page?: number,
    limit?: number): Promise<MaterialsTableListDTO> {
      if (page < 1 || limit < 1) {
        throw new Error('page or pagesize is less than 1');
      }

      return new Promise<MaterialsTableListDTO>((resolve, reject) => {

          const getResponse =
            this.getMaterialsReceiptsTable(materialsReceiptId, page, limit).toPromise();

          getResponse.then( (responseStatus: ResponseStatus) => {
            if (responseStatus.Failed) {
              reject('Failed to retrieve data');
            }

            const uniqueId = responseStatus.HttpResult.body.Ids[0];

            this.eventBusService.EventBus.subscribe(
              async (data: MaterialsReceiptsTablePartReadListResults) => {
                if (data.ParentSourceEventUniqueId === uniqueId) {

                  resolve({
                    Items: data.MaterialsDataTablePartList,
                    Total: data.TotalRecordsAmount
                  });
                }
              }
            );

          });
        }
      );
  }

  public ScanTableQuery(queryParams: ScanTableQueryParams)
    : Promise<MaterialsReceiptsScanTableReadListResults> {

      if (queryParams.Page < 1 || queryParams.Limit < 1) {
        throw new Error('page or pagesize is less than 1');
      }

      return new Promise<MaterialsReceiptsScanTableReadListResults>((resolve, reject) => {
        const getResponse = this.scanDataQuery(queryParams).toPromise();

        getResponse.then( (responseStatus: ResponseStatus) => {
          if (responseStatus.Failed) reject('Failed to retrieve data');

          const uniqueId = responseStatus.HttpResult.body.Ids[0];

          this.eventBusService.EventBus.subscribe(
            (data: MaterialsReceiptsScanTableReadListResults) => {
              if (data.ParentSourceEventUniqueId === uniqueId)
                resolve(data);
            }
          );

        })
      });
  }

  /**
   * Gets Material Receipt List
   * @param queryParams Query Class params
   * @returns Http Response
   */
  public GetMaterialsReceiptsList(queryParams: ReadListQueryParams): Promise<MaterialsListDTO> {
    if (queryParams.Page < 1 || queryParams.Limit < 1) {
      throw new Error('page or pagesize is less than 1');
    }

    return new Promise<MaterialsListDTO>((resolve, reject) => {

        const getResponse = this.getMaterialsReceiptsList(queryParams).toPromise();

        getResponse.then( (responseStatus: ResponseStatus) => {
          if (responseStatus.Failed) {
            reject('Failed to retrieve data');
          }

          const uniqueId = responseStatus.HttpResult.body.Ids[0];

          this.eventBusService.EventBus.subscribe(
            async (data: MaterialsReceiptsReadListResults) => {
              if (data.ParentSourceEventUniqueId === uniqueId) {

                resolve({
                  Items: data.MaterialsDataList,
                  Total: data.TotalRecordsAmount
                });
              }
            }
          );

        });
      }
    );
  }


  /**
   * Gets Material Receipt List
   * @param queryParams Query Class params
   * @returns Http Response
   */
  private getMaterialsReceiptsList(queryParams: ReadListQueryParams)
    : Observable<ResponseStatus> {

      const event = new MaterialsReceiptsReadListQuery(
        this.sourceInfo,
        queryParams.DateFrom,
        queryParams.DateUntil,
        queryParams.Signed,
        queryParams.Page,
        queryParams.Limit);

      return this.eventProxyService.DispatchEvent(event);
  }

  /**
   * Get material receipt associated list of entries
   * @param materialsReceiptId material receipt id
   * @param page page
   * @param limit limit
   * @returns ResponseStatus
   */
  private getMaterialsReceiptsTable(
    materialsReceiptId?: number,
    page?: number,
    limit?: number): Observable<ResponseStatus> {

      const event = new MaterialsReceiptsTablePartReadListQuery(
        this.sourceInfo, materialsReceiptId, page, limit);

      return this.eventProxyService.DispatchEvent(event);
  }

  /**
   * Queries scam
   * @param queryParams query parameteres
   * @returns ResponseStatus
   */
  private scanDataQuery(queryParams: ScanTableQueryParams): Observable<ResponseStatus> {

      const event = new MaterialsReceiptsScanTableReadListQuery(
        this.sourceInfo,
        queryParams.ScanTableId,
        queryParams.MaterialsId,
        queryParams.MaterialReceiptsListId,
        queryParams.MaterialReceiptsTableId,
        queryParams.Page,
        queryParams.Limit);

      return this.eventProxyService.DispatchEvent(event);
  }

  /**
   * Add new material scan
   * @param data MaterialsReceiptsScanTable
   * @returns ResponseStatus
   */
  private scanDataAdd(data: MaterialsReceiptsScanTable): Observable<ResponseStatus> {

    const event = new MaterialsReceiptsScanTableAddRemove(
      this.sourceInfo,
      data,
      MaterialsReceiptsScanTableAddRemoveFlag.Add);

    return this.eventProxyService.DispatchEvent(event);
  }

  /**
   * Removes material scan
   * @param data MaterialsReceiptsScanTable
   * @returns ResponseStatus
   */
  private scanDataRemove(data: MaterialsReceiptsScanTable): Observable<ResponseStatus> {

    const event = new MaterialsReceiptsScanTableAddRemove(
      this.sourceInfo,
      data,
      MaterialsReceiptsScanTableAddRemoveFlag.Remove);

    return this.eventProxyService.DispatchEvent(event);
  }
}
