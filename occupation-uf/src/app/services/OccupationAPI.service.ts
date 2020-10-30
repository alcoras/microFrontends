import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  EventProxyLibService,
  ResponseStatus,
  MicroFrontendParts
} from 'event-proxy-lib-src';

import {
  OccupationData,
  OccupationDataDTO } from '../Models/index';

import { EventBusService } from './EventBus.service';
import {
  OccupationsDeleteEvent,
  OccupationsCreateUpdate,
  OccupationCreateUpdateFlag,
  OccupationsReadQuery,
  OccupationsReadResults } from '../Models/BackendEvents/index';


/**
 * Occupation API service for CRUD operations
 */
@Injectable({
  providedIn: 'root',
})
export class OccupationAPIService {

  private sourceInfo = MicroFrontendParts.Occupations;

  public constructor(
    private eventProxyService: EventProxyLibService,
    private eventBusService: EventBusService) { }

  /**
   * Deletes occupation entry
   * @param id Occupation to remove by
   * @returns Promise
   */
  public Delete(id: number): Promise<ResponseStatus> {
    return new Promise( (resolve, reject) => {
      this.delete(id).toPromise().then( (val: ResponseStatus) => {
        if (!val.Failed) {
          resolve(val);
        } else {
          reject(val);
        }
      });
    });
  }

  /**
   * Craetes occupation entry
   * @param occupationData new OccupationData
   * @returns Promise
   */
  public Create(occupationData: OccupationData): Promise<ResponseStatus> {
    return new Promise( (resolve, reject) => {
      // tslint:disable-next-line: no-identical-functions
      this.create(occupationData).toPromise().then( (val: ResponseStatus) => {
        if (!val.Failed) {
          resolve(val);
        } else {
          reject(val);
        }
      });
    });
  }

  /**
   * Updates occupation entry
   * @param occupationData OccupationData
   * @returns Promise
   */
  public Update(occupationData: OccupationData): Promise<ResponseStatus> {
    return new Promise( (resolve, reject) => {
      // tslint:disable-next-line: no-identical-functions
      this.update(occupationData).toPromise().then( (val: ResponseStatus) => {
        if (!val.Failed) {
          resolve(val);
        } else {
          reject(val);
        }
      });
    });
  }

  /**
   * Queries for occupation data
   *
   * @param page page to get
   * @param pageSize entries' limit
   * @returns Promise with response
   */
  public Get(page: number, pageSize: number): Promise<OccupationDataDTO> {
    if (page < 1 || pageSize < 1) {
      throw new Error('page or pagesize was less than 1');
    }

    return new Promise<OccupationDataDTO>(
      (resolve, reject) => {
        this.get(page, pageSize).toPromise().then( (response: ResponseStatus) => {
          if (response.HttpResult.status !== 200) {
            reject('Failed to retrieve data');
          }

          const uniqueId = response.HttpResult.body.Ids[0];

          this.eventBusService.EventBus.subscribe(
            async (data: OccupationsReadResults) => {
              if (data.ParentSourceEventUniqueId === uniqueId) {
                resolve({
                  items: data.OccupationDataList,
                  total: data.TotalRecordsAmount
                });
              }
            }
          );

        });
      }
    );

  }

  /**
   * Queries for occupation data
   *
   * @param page page to get
   * @param pageSize entries' limit
   * @returns Observable with Http response
   */
  private get(page: number, pageSize: number): Observable<ResponseStatus> {
    const e = new OccupationsReadQuery(this.sourceInfo.SourceId, new Date().toISOString(), page, pageSize);
    e.SourceName = this.sourceInfo.SourceName;
    return this.eventProxyService.DispatchEvent(e);
  }

  /**
   * Updates Occupation entry
   * @param occupationData OccupationData
   * @returns Observable with HttpResponse
   */
  private update(occupationData: OccupationData): Observable<ResponseStatus> {
    const e = new OccupationsCreateUpdate(
      this.sourceInfo.SourceId,
      OccupationCreateUpdateFlag.Update,
      new Date().toISOString(),
      occupationData);

    e.SourceName = this.sourceInfo.SourceName;
    return this.eventProxyService.DispatchEvent(e);
  }

  /**
   * Creates new Occupation entry
   * @param occupationData OccupationData
   * @returns Observable with HttpResponse
   */
  private create(occupationData: OccupationData): Observable<ResponseStatus> {
    occupationData.DocReestratorId = 1; // TODO: for Demo purpose
    const e = new OccupationsCreateUpdate(
      this.sourceInfo.SourceId,
      OccupationCreateUpdateFlag.Create,
      new Date().toISOString(),
      occupationData);

    e.SourceName = this.sourceInfo.SourceName;
    return this.eventProxyService.DispatchEvent(e);
  }

  /**
   * Deletes occupation entry
   * @param id Occupation id to remove
   * @returns Observable with HttpResponse
   */
  private delete(id: number): Observable<ResponseStatus> {
    const e = new OccupationsDeleteEvent(this.sourceInfo.SourceId, id);
    e.SourceName = this.sourceInfo.SourceName;
    return this.eventProxyService.DispatchEvent(e);
  }
}
