import { Injectable } from '@angular/core';
import {
  BackendToFrontendEvent,
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
  public async CheckoutAsync(data: WunderMobilityScannedProduct[]): Promise<ValidationStatus<WunderMobilityDoCheckoutResults>> {

    const event = new WunderMobilityDoCheckout(this.sourceInfo, data);
    event.SubscribeToChildren = true;

    const request = await this.eventProxyService.DispatchEventAsync(event);

    if (request.HasErrors()) return Promise.reject(request.ErrorList.toString());

    const uniqueId = request.Result.Ids[0];

    const responsePromise = new Promise<WunderMobilityDoCheckoutResults>((resolve) => {
      this.eventBusService.EventBus.subscribe((data: WunderMobilityDoCheckoutResults) => {
        if (data.ParentId === uniqueId) resolve(data);
      });
    })

    return this.eventProxyService.RacePromiseAsync(responsePromise);
  }

  /**
   * Create new product
   * @param data new product entry
   * @returns Observable of ValidationStatus
   */
  public ProductCreateAsync(data: WunderMobilityProduct): Promise<ValidationStatus<BackendToFrontendEvent>> {
    const event = new WunderMobilityProductCreate(this.sourceInfo, data);

    return this.eventProxyService.DispatchEventAsync(event);
  }

  /**
   * Deletes products by ids
   * @param ids List of entries to delete
   * @returns Observable of ValidationStatus
   */
  public ProductDeleteAsync(ids: number[]): Promise<ValidationStatus<BackendToFrontendEvent>> {
    const event = new WunderMobilityProductDelete(this.sourceInfo, ids);

    return this.eventProxyService.DispatchEventAsync(event);
  }

  /**
   * Query all products
   * @returns Response with all products
   */
  public async ProductsQueryAsync(): Promise<ValidationStatus<WunderMobilityProductQueryResults>> {
    const event = new WunderMobilityProductQuery(this.sourceInfo);
    event.SubscribeToChildren = true;

    const request = await this.eventProxyService.DispatchEventAsync(event);

    if (request.HasErrors()) return Promise.reject(request.ErrorList.toString());

    const uniqueId = request.Result.Ids[0];

    const responsePromise = new Promise<WunderMobilityProductQueryResults>((resolve) => {
      this.eventBusService.EventBus.subscribe((data: WunderMobilityProductQueryResults) => {
        if (data.ParentId === uniqueId) resolve(data);
      });
    })

    return this.eventProxyService.RacePromiseAsync(responsePromise);
  }
}
