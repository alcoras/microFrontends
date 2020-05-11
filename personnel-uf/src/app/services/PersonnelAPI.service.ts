import { HttpResponse, } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { EventBusService } from './EventBus.service';
import { IPersonnel, APIGatewayResponse, PersonDataRead, UParts } from '@uf-shared-models/index';
import {
  ReadPersonDataQuery,
  CreateUpdatePersonData,
  PersonDataCreateUpdateFlag,
  RemoveEnterpisePersonData } from '@uf-shared-events/index';
import { EventProxyLibService } from '@uf-shared-libs/event-proxy-lib/';
import { IGetResponse } from './interfaces/IGetResponse';

/**
 * Personnel API service for CRUD operations
 */
@Injectable({
  providedIn: 'root',
})
export class PersonnelAPIService {

  /**
   * Source id of personnel apiservice
   */
  private sourceId = UParts.Personnel.SourceId;

  /**
   * Source name of personnel apiservice
   */
  private sourceName = UParts.Personnel.SourceName;

  public constructor(
    private eventProxyService: EventProxyLibService,
    private eventBusService: EventBusService) { }

  /**
   * Deletes personnel entry
   * @param personDataId PersonDataId to remove by
   * @returns Promise
   */
  public Delete(personDataId: number): Promise<HttpResponse<APIGatewayResponse>> {
    return new Promise( (resolve, reject) => {
      this.delete(personDataId).toPromise().then( (val: HttpResponse<APIGatewayResponse>) => {
        if (val.status === 200) {
          resolve(val);
        } else {
          reject(val);
        }
      });
    });
  }

  /**
   * Craetes new personnel entry
   * @param personnel IPersonnel
   * @returns Promise
   */
  public Create(personnel: IPersonnel): Promise<HttpResponse<APIGatewayResponse>> {
    return new Promise( (resolve, reject) => {
      // tslint:disable-next-line: no-identical-functions
      this.create(personnel).toPromise().then( (val: HttpResponse<APIGatewayResponse>) => {
        if (val.status === 200) {
          resolve(val);
        } else {
          reject(val);
        }
      });
    });
  }

  /**
   * Craetes new personnel entry
   * @param personnel IPersonnel
   * @returns Promise
   */
  public Update(personnel: IPersonnel): Promise<HttpResponse<APIGatewayResponse>> {
    return new Promise( (resolve, reject) => {
      // tslint:disable-next-line: no-identical-functions
      this.update(personnel).toPromise().then( (val: HttpResponse<APIGatewayResponse>) => {
        if (val.status === 200) {
          resolve(val);
        } else {
          reject(val);
        }
      });
    });
  }

  /**
   * Gets personnel data @see ReadPersonDataQuery
   * @param multiSorting multi sorting
   * @param page page to receive
   * @param pageSize page size
   * @returns Promise with Personnel data
   */
  // TODO: add timeout and reject
  public Get(multiSorting: string[], page: number, pageSize: number): Promise<IGetResponse> {
    if (page < 1 || pageSize < 1) {
      throw new Error('page or pagesize was less than 1');
    }
    return new Promise<IGetResponse>(
      (resolve) => {
        this.get(multiSorting, page, pageSize).toPromise().then( (response: HttpResponse<APIGatewayResponse>) => {
          if (response.status !== 200) {
            return new Error('Failed to retrieve data');
          }

          const uniqueId = response.body.Ids[0];

          this.eventBusService.EventBus.subscribe(
            (data: PersonDataRead) => {
              if (data.ParentSourceEventUniqueId === uniqueId) {
                this.eventProxyService.ConfirmEvents(this.sourceId, [data.AggregateId]).toPromise();
                resolve({
                  items: data.ListOutputEnterprisePersonData,
                  total: data.CommonNumberRecords
                });
              }
            }
          );
        });
      }
    );
  }

  /**
   * Sends event ReadPersonDataQuery to backend
   * @param multiSorting multi sorting
   * @param page page to receive
   * @param pageSize page size
   * @returns Observable with HttpResponse
   */
  private get(multiSorting: string[], page: number, pageSize: number): Observable<HttpResponse<APIGatewayResponse>> {
    const e = new ReadPersonDataQuery(this.sourceId, multiSorting, page, pageSize);
    e.SourceName = this.sourceName;
    return this.eventProxyService.DispatchEvent(e);
  }

  /**
   * Update existing PersonData entry
   * @param personnel IPersonnel
   * @returns Observable with HttpResponse
   */
  private update(personnel: IPersonnel): Observable<HttpResponse<APIGatewayResponse>> {
    const e = new CreateUpdatePersonData(
      this.sourceId,
      PersonDataCreateUpdateFlag.Update,
      personnel);
    e.SourceName = this.sourceName;
    return this.eventProxyService.DispatchEvent(e);
  }

  /**
   * Creates new PersonData entry
   * @param personnel IPersonnel
   * @returns Observable with HttpResponse
   */
  private create(personnel: IPersonnel): Observable<HttpResponse<APIGatewayResponse>> {
    const e = new CreateUpdatePersonData(
      this.sourceId,
      PersonDataCreateUpdateFlag.Create,
      personnel);
    e.SourceName = this.sourceName;
    return this.eventProxyService.DispatchEvent(e);
  }

  /**
   * Deletes personnel entry
   * @param personDataId PersonDataId to remove
   * @returns Observable with HttpResponse
   */
  private delete(personDataId: number): Observable<HttpResponse<APIGatewayResponse>> {
    const e = new RemoveEnterpisePersonData(this.sourceName, personDataId);
    e.SourceName = this.sourceName;
    return this.eventProxyService.DispatchEvent(e);
  }
}
