import { HttpResponse, } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { EventBusService } from './EventBus.service';
import { IPersonnel, APIGatewayResponse, PersonDataRead, uParts } from '@uf-shared-models/index';
import { ReadPersonDataQuery, CreateUpdateEnterpisePersonData } from '@uf-shared-events/index';
import { EventProxyLibService } from '@uf-shared-libs/event-proxy-lib/';

function delay(ms: number) {
  return new Promise( resolve => setTimeout(resolve, ms) );
}

@Injectable({
  providedIn: 'root',
})
export class PersonnelAPIService {

  private sourceId = uParts.Personnel;

  constructor(
    private eProxyService: EventProxyLibService,
    private eventBusService: EventBusService) { }

  /**
   * Craetes or updates personnel entry (if PersonnelId is defined it will update)
   * @param personnel IPersonnel
   * @returns resolve if successfull, otherwise reject with HttpResponse
   */
  public CreateUpdate(personnel: IPersonnel): Promise<any> {
    return new Promise( (resolve, reject) => {
      this.createUpdate(personnel).toPromise().then( (val: HttpResponse<any>) => {
        if (val.status === 200) {
          resolve();
        } else {
          reject(val);
        }
      });
    });
  }

  /**
   * Gets personnel data
   * @param sort sort by given field
   * @param order order (asc, dsc)
   * @param page page to receive
   * @param pageSize page size
   * @returns Promise with Personnel data
   */
  public Get(sort: string, order: string, page: number, pageSize: number): Promise<IPersonnel[]> {
    return new Promise<IPersonnel[]>(
      resolve => {
        this.get(sort, order, page, pageSize).toPromise().then( (response: HttpResponse<APIGatewayResponse>) => {
          if (response.status !== 200) {
            return new Error('Failed to retrive data');
          }

          const uniqueId = response.body.Ids[0];

          this.eventBusService.EventBus.subscribe(
            (data: PersonDataRead) => {
              if (data.ParentSourceEventUniqueId === uniqueId) {
                resolve(data.ListOutputEnterprisePersonData);
              }
            }
          );
        });
      }
    );
  }

  private get(sort: string, order: string, page: number, pageSize: number): Observable<HttpResponse<any>> {
    const e = new ReadPersonDataQuery(sort, order, page, pageSize);
    e.SourceId = this.sourceId;
    return this.eProxyService.dispatchEvent(e);
  }

  private createUpdate(personnel: IPersonnel) {
    const e = new CreateUpdateEnterpisePersonData(this.sourceId, personnel);
    return this.eProxyService.dispatchEvent(e);
  }
}
