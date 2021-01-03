import { Injectable } from "@angular/core";
import {
  EventProxyLibService,
  MicroFrontendParts,
  ObserverSnapshotResult,
  ObserverSnapshowQuery,
  ResponseStatus } from "event-proxy-lib-src";
import { Observable } from "rxjs";
import { EventBusService } from "./EventBusService";

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

  public RequestSnapshot(): Promise<ObserverSnapshotResult> {
    return new Promise<ObserverSnapshotResult>(
      (resolve, reject) => {
        this.requestSnapshot().toPromise().then((response: ResponseStatus) => {
          if (response.Failed)
            reject('Failed to retrieve data');

          const uniqueId = response.HttpResult.body.Ids[0];

          this.eventBusService.EventBus.subscribe((data: ObserverSnapshotResult) => {
            if (data.ParentId === uniqueId)
              resolve(data);
          });

        });
      }
    );
  }

  private requestSnapshot(): Observable<ResponseStatus> {
    const e = new ObserverSnapshowQuery(this.sourceInfo.SourceId);
    e.SourceName = this.sourceInfo.SourceName;
    e.SubscribeToChildren = true;
    return this.eventProxyService.DispatchEvent(e);
  }
}
