import { Injectable } from "@angular/core";
import {
  CoreEvent,
  EventIds,
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

  public ResetSnapshot(): Observable<ResponseStatus> {
    class Temp extends CoreEvent {}
    const event: Temp = new Temp();
    event.SourceId = this.sourceInfo.SourceId;
    event.SourceName = this.sourceInfo.SourceName;

    event.EventId = EventIds.ObserverSnapshotReset;

    return this.eventProxyService.DispatchEvent(event);
  }

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
