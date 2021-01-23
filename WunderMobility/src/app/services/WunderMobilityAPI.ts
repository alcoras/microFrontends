import { Injectable } from '@angular/core';
import { EventProxyLibService, MicroFrontendParts, ResponseStatus, WunderMobilityProduct, WunderMobilityProductCreate, WunderMobilityProductDelete, WunderMobilityProductQuery, WunderMobilityProductQueryResults } from 'event-proxy-lib-src';
import { Observable } from 'rxjs';
import { EventBusService } from './EventBusService';

@Injectable({
  providedIn: 'root',
}) export class WunderMobilityAPI {
  private sourceInfo = MicroFrontendParts.WunderMobility;

  public constructor(
    private eventProxyService: EventProxyLibService,
    private eventBusService: EventBusService) {
  }


  /**
   * Create new product
   * @param data new product entry
   * @returns Observable of ResponseStatus
   */
  public ProductCreate(data: WunderMobilityProduct): Observable<ResponseStatus> {
    const event = new WunderMobilityProductCreate(
      this.sourceInfo, data);

    return this.eventProxyService.DispatchEvent(event);
  }

  /**
   * Deletes products by ids
   * @param ids List of entries to delete
   * @returns Observable of ResponseStatus
   */
  public ProductDelete(ids: number[]): Observable<ResponseStatus> {
    const event = new WunderMobilityProductDelete(this.sourceInfo, ids);

    return this.eventProxyService.DispatchEvent(event);
  }

  /**
   * Query all products
   * @returns Response with all products
   */
  public ProductsQuery(): Promise<WunderMobilityProductQueryResults> {
    return new Promise<WunderMobilityProductQueryResults>((resolve, reject) => {
      this.productsQuery()
      .toPromise()
      .then((responseStatus: ResponseStatus) => {
        if (responseStatus.Failed) reject("Failed to retrieve data");

        const uniqueId = responseStatus.HttpResult.body.Ids[0];

        this.eventBusService.EventBus.subscribe(
          (data: WunderMobilityProductQueryResults) => {
            if (data.ParentId === uniqueId) resolve(data);
          }
        )
      })
    })
  }

  /**
   * Queries all products
   * @returns Observable of ResponseStatus
   */
  private productsQuery(): Observable<ResponseStatus> {
    const event = new WunderMobilityProductQuery(this.sourceInfo);

    event.SubscribeToChildren = true;

    return this.eventProxyService.DispatchEvent(event);
  }
}
