import { HttpResponse, } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { EventBusService } from './EventBus.service';
import {
  BackendToFrontendEvent,
  CreateUpdatePersonData,
  EventProxyLibService,
  MicroFrontendParts,
  PersonData,
  PersonDataCreateUpdateFlag,
  PersonDataRead,
  ReadPersonDataQuery,
  RemoveEnterpisePersonData,
  ValidationStatus } from 'event-proxy-lib-src';

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
  private sourceId = MicroFrontendParts.Personnel.SourceId;

  /**
   * Source name of personnel apiservice
   */
  private sourceName = MicroFrontendParts.Personnel.SourceName;

  public constructor(
    private eventProxyService: EventProxyLibService,
    private eventBusService: EventBusService) { }

  /**
   * Deletes personnel entry
   * @param personDataId PersonDataId to remove by
   * @returns Promise
   */
  public Delete(personDataId: number): Promise<HttpResponse<BackendToFrontendEvent>> {
    return new Promise( (resolve, reject) => {
      this.delete(personDataId).toPromise().then( (val: ValidationStatus) => {
        if (val.HttpResult.status === 200) {
          resolve(val.HttpResult);
        } else {
          reject(val);
        }
      });
    });
  }

  /**
   * Craetes new personnel entry
   * @param personnel PersonData
   * @returns Promise
   */
  public Create(personnel: PersonData): Promise<HttpResponse<BackendToFrontendEvent>> {
    return new Promise( (resolve, reject) => {
      // tslint:disable-next-line: no-identical-functions
      this.create(personnel).toPromise().then( (val: ValidationStatus) => {
        if (val.HttpResult.status === 200) {
          resolve(val.HttpResult);
        } else {
          reject(val);
        }
      });
    });
  }

  /**
   * Craetes new personnel entry
   * @param personnel PersonData
   * @returns Promise
   */
  public Update(personnel: PersonData): Promise<HttpResponse<BackendToFrontendEvent>> {
    return new Promise( (resolve, reject) => {
      // tslint:disable-next-line: no-identical-functions
      this.update(personnel).toPromise().then( (val: ValidationStatus) => {
        if (val.HttpResult.status === 200) {
          resolve(val.HttpResult);
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
  public Get(multiSorting: string[], page: number, pageSize: number): Promise<PersonDataRead> {

    if (page < 1 || pageSize < 1) {
      throw new Error('page or pagesize was less than 1');
    }

    return new Promise<PersonDataRead>((resolve) => {
        this.get(multiSorting, page, pageSize)
        .toPromise()
        .then( (response: ValidationStatus) => {
          if (response.HttpResult.status !== 200) {
            return new Error('Failed to retrieve data');
          }

          const uniqueId = response.HttpResult.body.Ids[0];

          this.eventBusService.EventBus.subscribe(async (data: PersonDataRead) => {
              if (data.ParentId === uniqueId) {
                resolve(data);
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
  private get(multiSorting: string[], page: number, pageSize: number): Observable<ValidationStatus> {
    const e = new ReadPersonDataQuery(this.sourceId, multiSorting, page, pageSize);
    e.SourceName = this.sourceName;
    e.SubscribeToChildren = true;
    return this.eventProxyService.DispatchEventAsync(e);
  }

  /**
   * Update existing PersonData entry
   * @param personnel PersonData
   * @returns Observable with HttpResponse
   */
  private update(personnel: PersonData): Observable<ValidationStatus> {
    const e = new CreateUpdatePersonData(
      this.sourceId,
      PersonDataCreateUpdateFlag.Update,
      personnel);
    e.SourceName = this.sourceName;
    return this.eventProxyService.DispatchEventAsync(e);
  }

  /**
   * Creates new PersonData entry
   * @param personnel PersonData
   * @returns Observable with HttpResponse
   */
  private create(personnel: PersonData): Observable<ValidationStatus> {
    const e = new CreateUpdatePersonData(
      this.sourceId,
      PersonDataCreateUpdateFlag.Create,
      personnel);
    e.SourceName = this.sourceName;
    return this.eventProxyService.DispatchEventAsync(e);
  }

  /**
   * Deletes personnel entry
   * @param personDataId PersonDataId to remove
   * @returns Observable with HttpResponse
   */
  private delete(personDataId: number): Observable<ValidationStatus> {
    const e = new RemoveEnterpisePersonData(this.sourceName, personDataId);
    e.SourceName = this.sourceName;
    return this.eventProxyService.DispatchEventAsync(e);
  }
}
