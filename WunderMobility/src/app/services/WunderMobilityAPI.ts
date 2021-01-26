import { Injectable } from '@angular/core';
import {
  EventProxyLibService,
  MicroFrontendParts,
  ValidationStatus,
  WunderMobilityDoCheckout,
  WunderMobilityDoCheckoutResults,
  WunderMobilityProduct,
  WunderMobilityProductCreate,
  WunderMobilityProductDelete,
  WunderMobilityProductQuery,
  WunderMobilityProductQueryResults,
  WunderMobilityScannedProduct} from 'event-proxy-lib-src';
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
   * Do checkout
   * @param data list of scanned items
   * @returns Response with total price
   */
  public Checkout(data: WunderMobilityScannedProduct[])
  : Promise<WunderMobilityDoCheckoutResults> {
    return new Promise<WunderMobilityDoCheckoutResults>((resolve, reject) => {
      this.doCheckout(data)
      .toPromise()
      .then((responseStatus: ValidationStatus) => {
        if (responseStatus.Failed) reject("Failed to retrieve data");

        const uniqueId = responseStatus.HttpResult.body.Ids[0];

        this.eventBusService.EventBus.subscribe(
          (data: WunderMobilityDoCheckoutResults) => {
            if (data.ParentId === uniqueId) resolve(data);
          }
        )
      })
    })
  }

  /**
   * Create new product
   * @param data new product entry
   * @returns Observable of ValidationStatus
   */
  public ProductCreate(data: WunderMobilityProduct): Observable<ValidationStatus> {
    const event = new WunderMobilityProductCreate(
      this.sourceInfo, data);

    return this.eventProxyService.DispatchEventAsync(event);
  }

  /**
   * Deletes products by ids
   * @param ids List of entries to delete
   * @returns Observable of ValidationStatus
   */
  public ProductDelete(ids: number[]): Observable<ValidationStatus> {
    const event = new WunderMobilityProductDelete(this.sourceInfo, ids);

    return this.eventProxyService.DispatchEventAsync(event);
  }

  /**
   * Query all products
   * @returns Response with all products
   */
  public ProductsQuery(): Promise<WunderMobilityProductQueryResults> {
    return new Promise<WunderMobilityProductQueryResults>((resolve, reject) => {
      this.productsQuery()
      .toPromise()
      .then((responseStatus: ValidationStatus) => {
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
   * @returns Observable of ValidationStatus
   */
  private productsQuery(): Observable<ValidationStatus> {
    const event = new WunderMobilityProductQuery(this.sourceInfo);

    event.SubscribeToChildren = true;

    return this.eventProxyService.DispatchEventAsync(event);
  }

  /**
   * Sends data for checkout
   * @param data list of checkout items
   * @returns Observable of ValidationStatus
   */
  private doCheckout(data: WunderMobilityScannedProduct[]): Observable<ValidationStatus> {
    const event = new WunderMobilityDoCheckout(this.sourceInfo, data);

    event.SubscribeToChildren = true;

    return this.eventProxyService.DispatchEventAsync(event);
  }
}
