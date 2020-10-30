import { Injectable } from "@angular/core";
import { EventProxyLibService, MicroFrontendParts, ResponseStatus } from "event-proxy-lib-src";
import { Observable } from "rxjs";
import { ObserverSnapshowQuery } from "../models/BackendEvents/ObserverSnapshotQuery";
import { ObserverSnapshotResultDTO } from "../models/DTOs/ObserverSnapshotResultDTO";
import { EventBusService } from "./EventBus.service";

/**
 * Observer API service
 */
@Injectable({
  providedIn: 'root',
})
export class ObserverAPI {
  private sourceInfo = MicroFrontendParts.Observer;

  public constructor(
    private eventProxyService: EventProxyLibService,
    private eventBusService: EventBusService) { }

  public RequestSnapshot(): Promise<ObserverSnapshotResultDTO> {
    return new Promise<ObserverSnapshotResultDTO>(
      (resolve, reject) => {
        this.requestSnapshot().toPromise().then((response: ResponseStatus) => {
          if (response.Failed)
            reject('Failed to retrieve data');

          const uniqueId = response.HttpResult.body.Ids[0];

          this.eventBusService.EventBus.subscribe((data: ObserverSnapshotResultDTO) => {
            if (data.ParentSourceEventUniqueId === uniqueId)
              resolve(data);
          });

        });
      }
    );
  }

  private requestSnapshot(): Observable<ResponseStatus> {
    const e = new ObserverSnapshowQuery(this.sourceInfo.SourceId);
    e.SourceName = this.sourceInfo.SourceName;
    return this.eventProxyService.DispatchEvent(e);
  }
}
