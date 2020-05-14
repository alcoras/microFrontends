import { HttpResponse, } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { EventBusService } from './EventBus.service';
import { APIGatewayResponse, UParts, OccupationData } from '@uf-shared-models/index';
import {
  OccupationsDeleteEvent,
  OccupationsCreateUpdate,
  OccupationCreateUpdateFlag,
  OccupationsReadQuery,
  OccupationsReadResults } from '@uf-shared-events/index';
import { EventProxyLibService } from '@uf-shared-libs/event-proxy-lib/';
import { IGetResponse } from './interfaces/IGetResponse';

/**
 * Personnel API service for CRUD operations
 */
@Injectable({
  providedIn: 'root',
})
export class OccupationAPIService {

  /**
   * Source id of occupation microfrontend
   */
  private sourceId = UParts.Occupations.SourceId;

  /**
   * Source name of occupation microfrontend
   */
  private sourceName = UParts.Occupations.SourceName;

  public constructor(
    private eventProxyService: EventProxyLibService,
    private eventBusService: EventBusService) { }

  /**
   * Deletes occupation entry
   * @param id Occupation to remove by
   * @returns Promise
   */
  public Delete(id: number): Promise<HttpResponse<APIGatewayResponse>> {
    return new Promise( (resolve, reject) => {
      this.delete(id).toPromise().then( (val: HttpResponse<APIGatewayResponse>) => {
        if (val.status === 200) {
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
  public Create(occupationData: OccupationData): Promise<HttpResponse<APIGatewayResponse>> {
    return new Promise( (resolve, reject) => {
      // tslint:disable-next-line: no-identical-functions
      this.create(occupationData).toPromise().then( (val: HttpResponse<APIGatewayResponse>) => {
        if (val.status === 200) {
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
  public Update(occupationData: OccupationData): Promise<HttpResponse<APIGatewayResponse>> {
    return new Promise( (resolve, reject) => {
      // tslint:disable-next-line: no-identical-functions
      this.update(occupationData).toPromise().then( (val: HttpResponse<APIGatewayResponse>) => {
        if (val.status === 200) {
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
  // TODO: add reject and timeout
  public Get(page: number, pageSize: number): Promise<IGetResponse> {
    if (page < 1 || pageSize < 1) {
      throw new Error('page or pagesize was less than 1');
    }
    return new Promise<IGetResponse>(
      (resolve) => {
        this.get(page, pageSize).toPromise().then( (response: HttpResponse<APIGatewayResponse>) => {
          if (response.status !== 200) {
            return new Error('Failed to retrieve data');
          }
          const uniqueId = response.body.Ids[0];

          this.eventBusService.EventBus.subscribe(
            (data: OccupationsReadResults) => {
              if (data.ParentSourceEventUniqueId === uniqueId) {
                this.eventProxyService.ConfirmEvents(this.sourceId, [data.AggregateId]).toPromise();
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
  private get(page: number, pageSize: number): Observable<HttpResponse<APIGatewayResponse>> {
    const e = new OccupationsReadQuery(this.sourceId, new Date().toISOString(), page, pageSize);
    e.SourceName = this.sourceName;
    return this.eventProxyService.DispatchEvent(e);
  }

  /**
   * Updates Occupation entry
   * @param occupationData OccupationData
   * @returns Observable with HttpResponse
   */
  private update(occupationData: OccupationData): Observable<HttpResponse<APIGatewayResponse>> {
    const e = new OccupationsCreateUpdate(
      this.sourceId,
      OccupationCreateUpdateFlag.Update,
      new Date().toISOString(),
      occupationData);

    e.SourceName = this.sourceName;
    return this.eventProxyService.DispatchEvent(e);
  }

  /**
   * Creates new Occupation entry
   * @param occupationData OccupationData
   * @returns Observable with HttpResponse
   */
  private create(occupationData: OccupationData): Observable<HttpResponse<APIGatewayResponse>> {
    occupationData.DocReestratorId = 1; // TODO: for Demo purpose
    const e = new OccupationsCreateUpdate(
      this.sourceId,
      OccupationCreateUpdateFlag.Create,
      new Date().toISOString(),
      occupationData);

    e.SourceName = this.sourceName;
    return this.eventProxyService.DispatchEvent(e);
  }

  /**
   * Deletes occupation entry
   * @param id Occupation id to remove
   * @returns Observable with HttpResponse
   */
  private delete(id: number): Observable<HttpResponse<APIGatewayResponse>> {
    const e = new OccupationsDeleteEvent(this.sourceId, id);
    e.SourceName = this.sourceName;
    return this.eventProxyService.DispatchEvent(e);
  }
}
