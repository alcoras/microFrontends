import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  MaterialsReceiptsReadListQuery,
  MaterialsReceiptsReadListResults
} from '@uf-shared-events/index';
import { APIGatewayResponse, UParts } from '@uf-shared-models/index';
import { EventProxyLibService } from 'event-proxy-lib';
import { Observable } from 'rxjs';
import { GetMaterialsList } from '../interfaces/GetMaterialsList';
import { EventBusService } from './EventBus.service';
import { ReadListQueryParams } from '../helpers/ReadListQueryParams';

@Injectable({
  providedIn: 'root',
})
export class MaterialsReceiptsAPI {
  private sourceInfo = UParts.MaterialsReceipts;

  public constructor(
    private eventProxyService: EventProxyLibService,
    private eventBusService: EventBusService) { }

  public Get(queryParams: ReadListQueryParams): Promise<GetMaterialsList> {
    if (queryParams.Page < 1 || queryParams.Limit < 1) {
      throw new Error('page or pagesize is less than 1');
    }

    return new Promise<GetMaterialsList>((resolve, reject) => {

        const getResponse = this.get(queryParams).toPromise();

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
  }


  /**
   * Gets Material Lists
   * @param queryParams Query Class params
   * @returns Http Response
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private get(queryParams: ReadListQueryParams)
    :Observable<HttpResponse<APIGatewayResponse>> {
      const event = new MaterialsReceiptsReadListQuery(
        this.sourceInfo,
        queryParams.DateFrom,
        queryParams.DateUntil,
        queryParams.Signed,
        queryParams.Page,
        queryParams.Limit);

      return this.eventProxyService.DispatchEvent(event);
  }
}
