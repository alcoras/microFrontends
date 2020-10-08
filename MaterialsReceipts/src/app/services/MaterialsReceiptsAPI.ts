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
  MaterialsReceiptsTablePartReadListQuery,
  MaterialsReceiptsTablePartReadListResults
} from '../Models/BackendEvents/index';

import {
  MaterialsListDTO,
  MaterialsTableListDTO,
  ReadListQueryParams } from '../Models/index';

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

  /**
   * Gets Material Receipt List
   * @param queryParams Query Class params
   * @returns Http Response
   */
  public Get(queryParams: ReadListQueryParams): Promise<MaterialsListDTO> {
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
    :Observable<ResponseStatus> {
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
   * @returns Http Response
   */
  private getMaterialsReceiptsTable(
    materialsReceiptId?: number,
    page?: number,
    limit?: number): Observable<ResponseStatus> {
      const event = new MaterialsReceiptsTablePartReadListQuery(
        this.sourceInfo, materialsReceiptId, page, limit);

      return this.eventProxyService.DispatchEvent(event);
  }
}
