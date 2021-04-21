import { Injectable } from "@angular/core";

import {
  EventProxyLibService,
  ValidationStatus,
  MicroFrontendParts,
  OccupationCreateUpdateFlag,
  OccupationData,
  OccupationsCreateUpdate,
  OccupationsDeleteEvent,
  OccupationsReadQuery,
  OccupationsReadResults,
  BackendToFrontendEvent
} from "event-proxy-lib-src";

import { EventBusService } from "./EventBusService";

/**
 * Occupation API service for CRUD operations
 */
@Injectable({
  providedIn: "root",
})
export class OccupationAPIService {

  private sourceInfo = MicroFrontendParts.Occupations;

  public constructor(
    private eventProxyService: EventProxyLibService,
    private eventBusService: EventBusService) { }

  /**
   * Deletes occupation entry
   * @param id Occupation to remove by
   * @returns Promise
   */
  public DeleteAsync(id: number): Promise<ValidationStatus<BackendToFrontendEvent>> {
    const event = new OccupationsDeleteEvent(this.sourceInfo.SourceId, id);
    event.SourceName = this.sourceInfo.SourceName;

    return this.eventProxyService.DispatchEventAsync(event);
  }

  /**
   * Craetes occupation entry
   * @param occupationData new OccupationData
   * @returns Promise
   */
  public CreateAsync(occupationData: OccupationData): Promise<ValidationStatus<BackendToFrontendEvent>> {
    occupationData.DocReestratorId = 1; // TODO: for Demo purpose
    const event = new OccupationsCreateUpdate(
      this.sourceInfo.SourceId,
      OccupationCreateUpdateFlag.Create,
      new Date().toISOString(),
      occupationData);

    event.SourceName = this.sourceInfo.SourceName;

    return this.eventProxyService.DispatchEventAsync(event);
  }

  /**
   * Updates occupation entry
   * @param occupationData OccupationData
   * @returns Promise
   */
  public UpdateAsync(occupationData: OccupationData): Promise<ValidationStatus<BackendToFrontendEvent>> {
    const event = new OccupationsCreateUpdate(
      this.sourceInfo.SourceId,
      OccupationCreateUpdateFlag.Update,
      new Date().toISOString(),
      occupationData);

    event.SourceName = this.sourceInfo.SourceName;

    return this.eventProxyService.DispatchEventAsync(event);
  }

  /**
   * Queries for occupation data
   *
   * @param page page to get
   * @param pageSize entries" limit
   * @returns Promise with response
   */
  public async GetAsync(page: number, pageSize: number): Promise<ValidationStatus<OccupationsReadResults>> {

    const event = new OccupationsReadQuery(this.sourceInfo.SourceId, new Date().toISOString(), page, pageSize);
    event.SourceName = this.sourceInfo.SourceName;
    event.SubscribeToChildren = true;

    const request = await this.eventProxyService.DispatchEventAsync(event);

    if (request.HasErrors()) return Promise.reject(request.ErrorList.toString());

    const uniqueId = request.Result.Ids[0];

    const responsePromise = new Promise<OccupationsReadResults>((resolve) => {
      this.eventBusService.EventBus.subscribe((data: OccupationsReadResults) => {
        if (data.ParentId === uniqueId) resolve(data);
      });
    });

    return this.eventProxyService.RacePromiseAsync(responsePromise);
  }
}
