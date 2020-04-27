import { HttpResponse, } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { EventBusService } from './EventBus.service';
import { APIGatewayResponse, UParts, OccupationData, uEvent, uEventsIds } from '@uf-shared-models/index';
import { OccupationsCreateUpdate, OccupationCreateUpdateFlag, OccupationsReadQuery, OccupationsReadResults } from '@uf-shared-events/index';
import { EventProxyLibService } from '@uf-shared-libs/event-proxy-lib/';
import { IGetResponse } from './interfaces/IGetResponse';

/**
 * Event to delete occupation entry
 */
class OccupationDeleteEvent extends uEvent {
  /**
   * @param ObjectAggregateId Occupation id to delete
   */
  constructor(public ObjectAggregateId: number) {
    super();
    this.EventId = uEventsIds.OccupationsDelete;
  }
}

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

  constructor(
    private eProxyService: EventProxyLibService,
    private eventBusService: EventBusService) { }

  /**
   * Deletes occupation entry
   * @param id Occupation to remove by
   * @returns Promise
   */
  public Delete(id: number): Promise<HttpResponse<any>> {
    return new Promise( (resolve, reject) => {
      this.delete(id).toPromise().then( (val: HttpResponse<any>) => {
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
  public Create(occupationData: OccupationData): Promise<HttpResponse<any>> {
    return new Promise( (resolve, reject) => {
      // tslint:disable-next-line: no-identical-functions
      this.create(occupationData).toPromise().then( (val: HttpResponse<any>) => {
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
  public Update(occupationData: OccupationData, dateTimeValue: string): Promise<HttpResponse<any>> {
    return new Promise( (resolve, reject) => {
      // tslint:disable-next-line: no-identical-functions
      this.update(occupationData, dateTimeValue).toPromise().then( (val: HttpResponse<any>) => {
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
   * @param page page to get
   * @param pageSize limit per page
   */
  // TODO: add timeout and reject
  public Get(page: number, pageSize: number): Promise<IGetResponse> {
    return new Promise<IGetResponse>(
      (resolve, reject) => {
        this.get(page, pageSize).toPromise().then( (response: HttpResponse<APIGatewayResponse>) => {
          if (response.status !== 200) {
            return new Error('Failed to retrieve data');
          }

          const uniqueId = response.body.Ids[0];

          this.eventBusService.EventBus.subscribe(
            (data: OccupationsReadResults) => {
              if (data.ParentSourceEventUniqueId === uniqueId) {
                this.eProxyService.ConfirmEvents(this.sourceId, [data.AggregateId]).toPromise();
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
   * @param page page to get
   * @param pageSize limit per page
   */
  private get(page: number, pageSize: number): Observable<HttpResponse<APIGatewayResponse>> {
    const e = new OccupationsReadQuery(this.sourceId, new Date().toISOString(), page, pageSize);
    e.SourceName = this.sourceName;
    return this.eProxyService.DispatchEvent(e);
  }

  /**
   * Updates Occupation entry
   * @param occupationData OccupationData
   * @returns Observable with HttpResponse
   */
  private update(occupationData: OccupationData, dateTimeValue: string): Observable<HttpResponse<APIGatewayResponse>> {
    const e = new OccupationsCreateUpdate(
      this.sourceId,
      OccupationCreateUpdateFlag.Update,
      dateTimeValue,
      occupationData);

    e.SourceName = this.sourceName;
    return this.eProxyService.DispatchEvent(e);
  }

  /**
   * Creates new Occupation entry
   * @param occupationData OccupationData
   * @returns Observable with HttpResponse
   */
  private create(occupationData: OccupationData): Observable<HttpResponse<APIGatewayResponse>> {
    const e = new OccupationsCreateUpdate(
      this.sourceId,
      OccupationCreateUpdateFlag.Create,
      new Date().toISOString(),
      occupationData);

    e.SourceName = this.sourceName;
    return this.eProxyService.DispatchEvent(e);
  }

  /**
   * Deletes occupation entry
   * @param id Occupation id to remove
   * @returns Observable with HttpResponse
   */
  private delete(id: number): Observable<HttpResponse<APIGatewayResponse>> {
    const e = new OccupationDeleteEvent(id);
    e.SourceName = this.sourceName;
    return this.eProxyService.DispatchEvent(e);
  }
}
