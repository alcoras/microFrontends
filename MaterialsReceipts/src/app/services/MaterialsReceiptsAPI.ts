import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import {
  MaterialsReceiptsReadListQuery,
  MaterialsReceiptsReadListResults } from '@uf-shared-events/index';
import { APIGatewayResponse, MaterialsList, UParts } from '@uf-shared-models/index';
import { EventProxyLibService } from 'event-proxy-lib';
import { Observable } from 'rxjs';
import { EventBusService } from './EventBus.service';
import { GetMaterialsList } from '../interfaces/GetMaterialsList';
import { ProductService } from './ProductService';

@Injectable({
  providedIn: 'root',
})
export class MaterialsReceiptsAPI {
  private sourceInfo = UParts.MaterialsReceipts;

  private timeoutForRequestsInMiliseconds = 5000;

  private data: MaterialsList[];

  public constructor(
    private eventProxyService: EventProxyLibService,
    private eventBusService: EventBusService) {
      this.data = [];

      for (let index = 0; index < 1000; index++) {
        const temp: MaterialsList = {
          Number: ProductService.generateQuantity(),
          RegisterDateTime: ProductService.generateName(),
          SignMark: true,
          SignPerson: ProductService.generateName()
        }
        this.data.push(temp);
      }
    }

  public MockGet(page: number, pageSize: number): Promise<GetMaterialsList> {

    const items = this.data.slice(page, (page + pageSize));
    return Promise.resolve({Items: items, Total: this.data.length})
  }

  public Get(page: number, limit: number): Promise<GetMaterialsList> {
    if (page < 1 || limit < 1) {
      throw new Error('page or pagesize is less than 1');
    }

    const getResponsePromise = new Promise<GetMaterialsList>(
      (resolve, reject) => {

        const getResponse = this.get(page, limit).toPromise();

        getResponse.then( (response: HttpResponse<APIGatewayResponse>) => {
          if (response.status !== 200) {
            reject('Failed to retrieve data');
          }

          const uniqueId = response.body.Ids[0];

          this.eventBusService.EventBus.subscribe(
            async (data: MaterialsReceiptsReadListResults) => {
              if (data.ParentSourceEventUniqueId === uniqueId) {

                await this.eventProxyService.ConfirmEvents(
                  this.sourceInfo.SourceId, [data.AggregateId]).toPromise();

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

    return new Promise((resolve, reject) => {
      const race = this.promiseTimeout(
        this.timeoutForRequestsInMiliseconds, getResponsePromise);

      race.then((response: GetMaterialsList) => {
        resolve(response);
      })

      race.catch((error) => {
        reject(error);
      })
    })
  }
  /**
   * Quaries for MaterialsReceipts Data
   * @param page page to get
   * @param limit entries's limit
   * @returns Observable with Http response from API gateway
   */
  private get(page: number, limit: number)
    :Observable<HttpResponse<APIGatewayResponse>> {
      const event = new MaterialsReceiptsReadListQuery(
        this.sourceInfo,
        null, null, null, page, limit);

      return this.eventProxyService.DispatchEvent(event);
  }

  private promiseTimeout(timeoutMiliseconds: number, promise: Promise<unknown>)
    :Promise<unknown> {
    const timeout = new Promise((resolve, reject) => {
      const id = setTimeout(() => {
        clearTimeout(id);
        reject("Timeout in " + timeoutMiliseconds);
      }, timeoutMiliseconds);
    })

    return Promise.race([promise, timeout]);
  }
}
