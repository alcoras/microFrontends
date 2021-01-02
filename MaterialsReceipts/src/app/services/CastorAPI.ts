import { Injectable } from "@angular/core";
import { CastorCreateAndOthers, CastorCreateAndOthersType, CastType } from "@shared/Models/BackendEvents";
import { EventProxyLibService, MicroFrontendParts, ResponseStatus } from "event-proxy-lib-src";
import { Observable } from "rxjs";
import { EventBusService } from "./EventBus.service";

@Injectable({
  providedIn: 'root'
})
export class CastorAPI {
  private sourceInfo = MicroFrontendParts.MaterialsReceipts;

  public constructor(
    private eventBusService: EventBusService,
    private eventProxyService: EventProxyLibService) { }

  /**
   * Creating a relationship between two types
   * More info in README.md - Castor
   * @param firstType !
   * @param firstId !
   * @param secondType !
   * @param secondIds !
   * @param castType !
   * @returns Observable of ResponseStatus
   */
  public CreateCastor(
    firstType: string,
    firstId: number,
    secondType: string,
    secondIds: number[],
    castType = CastType.OneToOne): Observable<ResponseStatus> {

    const event = new CastorCreateAndOthers(
      this.sourceInfo,
      CastorCreateAndOthersType.Create,
      firstType, firstId, secondType, secondIds, castType);

    return this.eventProxyService.DispatchEvent(event);
  }

  public CastorGet(firstType: string, firstId: number, secondType: string)
  : Promise<CastorCreateAndOthers> {

    return new Promise<CastorCreateAndOthers>((resolve, reject) => {
      this.castorGet(firstType, firstId, secondType)
      .toPromise()
      .then((responseStatus: ResponseStatus) => {
        if (responseStatus.Failed) reject('Failed to retrieve data');

        const uniqueId = responseStatus.HttpResult.body.Ids[0];

        this.eventBusService.EventBus.subscribe(
          (data: CastorCreateAndOthers) => {
            if (data.ParentId === uniqueId) resolve(data);
          }
        )
      })
    });

  }

  /**
   * Checking if there is a relationship
   * More info in README.md - Castor
   * @param firstType !
   * @param firstId !
   * @param secondType !
   * @returns Observable of ResponseStatus
   */
  private castorGet(firstType: string, firstId: number, secondType: string)
  : Observable<ResponseStatus> {
    const event = new CastorCreateAndOthers(
      this.sourceInfo,
      CastorCreateAndOthersType.Get,
      firstType, firstId, secondType);

    event.SubscribeToChildren = true;

    return this.eventProxyService.DispatchEvent(event);
  }

}
