import { Injectable } from "@angular/core";
import {
  BackendToFrontendEvent,
  CastorCreateAndOthers,
  CastorCreateAndOthersType,
  CastTypes,
  EventProxyLibService,
  MicroFrontendParts,
  ValidationStatus } from "event-proxy-lib-src";
import { EventBusService } from "./EventBusService";

@Injectable({
  providedIn: 'root'
})
export class CastorAPI {
  private sourceInfo = MicroFrontendParts.MaterialsReceipts;

  public constructor(private eventBusService: EventBusService, private eventProxyService: EventProxyLibService) { }

  /**
   * Creating a relationship between two types
   * More info in README.md - Castor
   * @param firstType !
   * @param firstId !
   * @param secondType !
   * @param secondIds !
   * @param castType !
   * @returns Promise of ValidationStatus
   */
  public CreateCastorAsync(firstType: string, firstId: number, secondType: string, secondIds: number[], castType = CastTypes.OneToOne): Promise<ValidationStatus<BackendToFrontendEvent>> {
    const event = new CastorCreateAndOthers(
      this.sourceInfo,
      CastorCreateAndOthersType.Create,
      firstType, firstId, secondType, secondIds, castType);

    return this.eventProxyService.DispatchEventAsync(event);
  }

  public async CastorGetAsync(firstType: string, firstId: number, secondType: string): Promise<ValidationStatus<CastorCreateAndOthers>> {
    const event = new CastorCreateAndOthers(this.sourceInfo, CastorCreateAndOthersType.Get, firstType, firstId, secondType);
    event.SubscribeToChildren = true;

    const request = await this.eventProxyService.DispatchEventAsync(event);

    if (request.HasErrors()) return Promise.reject(request.ErrorList.toString());

    const uniqueId = request.Result.Ids[0];

    const responsePromise = new Promise<CastorCreateAndOthers>((resolve) => {
      this.eventBusService.EventBus.subscribe((data: CastorCreateAndOthers) => {
        if (data.ParentId === uniqueId) resolve(data);
      });
    })

    return this.eventProxyService.RacePromiseAsync(responsePromise);
  }
}
