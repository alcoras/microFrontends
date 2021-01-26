import { Injectable } from "@angular/core";
import {
  BackendToFrontendEvent,
  CoreEvent,
  EventIds,
  EventProxyLibService,
  MicroFrontendParts,
  ObserverSnapshotResult,
  ObserverSnapshowQuery,
  ValidationStatus } from "event-proxy-lib-src";
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

  public ResetSnapshot(): Promise<ValidationStatus<BackendToFrontendEvent>> {
    class Temp extends CoreEvent {}
    const event: Temp = new Temp();
    event.SourceId = this.sourceInfo.SourceId;
    event.SourceName = this.sourceInfo.SourceName;

    event.EventId = EventIds.ObserverSnapshotReset;

    return this.eventProxyService.DispatchEventAsync(event);
  }

  public async RequestSnapshotAsync(): Promise<ValidationStatus<ObserverSnapshotResult>> {
    const request = await this.requestSnapshotAsync();

    if (request.HasErrors()) return Promise.reject(request.ErrorList.toString());

    const uniqueId = request.Result.Ids[0];

    const responsePromise = new Promise<ObserverSnapshotResult>((resolve) => {
      this.eventBusService.EventBus.subscribe((data: ObserverSnapshotResult) => {
        if (data.ParentId === uniqueId) resolve(data);
      });
    })

    return this.eventProxyService.RacePromiseAsync(responsePromise);
  }

  private requestSnapshotAsync(): Promise<ValidationStatus<BackendToFrontendEvent>> {
    const e = new ObserverSnapshowQuery(this.sourceInfo);
    e.SubscribeToChildren = true;
    return this.eventProxyService.DispatchEventAsync(e);
  }
}
