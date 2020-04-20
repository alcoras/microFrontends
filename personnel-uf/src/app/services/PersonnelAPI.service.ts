import { HttpResponse, } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { EventBusService } from './EventBus.service';
import { IPersonnel, APIGatewayResponse, PersonDataRead, UParts } from '@uf-shared-models/index';
import { ReadPersonDataQuery, CreateUpdateEnterpisePersonData, RemoveEnterpisePersonData } from '@uf-shared-events/index';
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

  constructor(
    private eProxyService: EventProxyLibService,
    private eventBusService: EventBusService) { }

  /**
   * Deletes personnel entry
   * @param personDataId PersonDataId to remove by
   * @returns Promise
   */
  public Delete(personDataId: number): Promise<HttpResponse<any>> {
    return new Promise( (resolve, reject) => {
      this.delete(personDataId).toPromise().then( (val: HttpResponse<any>) => {
        if (val.status === 200) {
          resolve(val);
        } else {
          reject(val);
        }
      });
    });
  }

  /**
   * Craetes or updates personnel entry (if PersonnelId is defined it will update)
   * @param personnel IPersonnel
   * @returns Promise
   */
  public CreateUpdate(personnel: IPersonnel): Promise<HttpResponse<any>> {
    return new Promise( (resolve, reject) => {
      // tslint:disable-next-line: no-identical-functions
      this.createUpdate(personnel).toPromise().then( (val: HttpResponse<any>) => {
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
    return new Promise<IGetResponse>(
      (resolve, reject) => {
        this.get(multiSorting, page, pageSize).toPromise().then( (response: HttpResponse<APIGatewayResponse>) => {
          if (response.status !== 200) {
            return new Error('Failed to retrive data');
          }

          const uniqueId = response.body.Ids[0];

          this.eventBusService.EventBus.subscribe(
            (data: PersonDataRead) => {
              if (data.ParentSourceEventUniqueId === uniqueId) {
                this.eProxyService.ConfirmEvents(this.sourceId, [data.AggregateId]).toPromise();
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
    return this.eProxyService.DispatchEvent(e);
  }

  /**
   * Creates new PersonData entry
   * @param personnel IPersonnel
   * @returns Observable with HttpResponse
   */
  private createUpdate(personnel: IPersonnel): Observable<HttpResponse<APIGatewayResponse>> {
    const e = new CreateUpdateEnterpisePersonData(this.sourceId, personnel);
    e.SourceName = this.sourceName;
    return this.eProxyService.DispatchEvent(e);
  }

  /**
   * Deletes personnel entry
   * @param personDataId PersonDataId to remove
   * @returns Observable with HttpResponse
   */
  private delete(personDataId: number): Observable<HttpResponse<APIGatewayResponse>> {
    const e = new RemoveEnterpisePersonData(this.sourceName, personDataId);
    e.SourceName = this.sourceName;
    return this.eProxyService.DispatchEvent(e);
  }
}
