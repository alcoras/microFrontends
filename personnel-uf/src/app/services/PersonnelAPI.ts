import { Injectable } from "@angular/core";
import { EventBusService } from "./EventBus.service";
import {
  BackendToFrontendEvent,
  CreateUpdatePersonData,
  EventProxyLibService,
  MicroFrontendParts,
  PersonData,
  PersonDataCreateUpdateFlag,
  PersonDataRead,
  ReadPersonDataQuery,
  RemoveEnterpisePersonData,
  ValidationStatus } from "event-proxy-lib-src";

/**
 * Personnel API service for CRUD operations
 */
@Injectable({
  providedIn: "root",
})
export class PersonnelAPI {

  /**
   * Source id of personnel apiservice
   */
  private sourceId = MicroFrontendParts.Personnel.SourceId;

  /**
   * Source name of personnel apiservice
   */
  private sourceName = MicroFrontendParts.Personnel.SourceName;

  public constructor(
    private eventProxyService: EventProxyLibService,
    private eventBusService: EventBusService) { }

  /**
   * Deletes personnel entry
   * @param personDataId PersonDataId to remove by
   * @returns Promise
   */
  public DeleteAsync(personDataId: number): Promise<ValidationStatus<BackendToFrontendEvent>> {
    const event = new RemoveEnterpisePersonData(this.sourceId, personDataId);
    event.SourceName = this.sourceName;

    return this.eventProxyService.DispatchEventAsync(event);
  }

  /**
   * Craetes new personnel entry
   * @param personnel PersonData
   * @returns Promise
   */
  public CreateAsync(personnel: PersonData): Promise<ValidationStatus<BackendToFrontendEvent>> {
    const event = new CreateUpdatePersonData(
      this.sourceId,
      PersonDataCreateUpdateFlag.Create,
      personnel);
    event.SourceName = this.sourceName;

    return this.eventProxyService.DispatchEventAsync(event);
  }

  /**
   * Craetes new personnel entry
   * @param personnel PersonData
   * @returns Promise
   */
  public UpdateAsync(personnel: PersonData): Promise<ValidationStatus<BackendToFrontendEvent>> {
    const event = new CreateUpdatePersonData(
      this.sourceId,
      PersonDataCreateUpdateFlag.Update,
      personnel);
    event.SourceName = this.sourceName;

    return this.eventProxyService.DispatchEventAsync(event);
  }

  /**
   * Gets personnel data @see ReadPersonDataQuery
   * @param multiSorting multi sorting
   * @param page page to receive
   * @param pageSize page size
   * @returns Promise with Personnel data
   */
  public async GetAsync(multiSorting: string[], page: number, pageSize: number): Promise<ValidationStatus<PersonDataRead>> {

    const event = new ReadPersonDataQuery(this.sourceId, multiSorting, page, pageSize);
    event.SourceName = this.sourceName;
    event.SubscribeToChildren = true;

    const request = await this.eventProxyService.DispatchEventAsync(event);

    if (request.HasErrors()) return Promise.reject(request.ErrorList.toString());

    const uniqueId = request.Result.Ids[0];

    const responsePromise = new Promise<PersonDataRead>((resolve) => {
      this.eventBusService.EventBus.subscribe((data: PersonDataRead) => {
        if (data.ParentId === uniqueId) resolve(data);
      });
    });

    return this.eventProxyService.RacePromiseAsync(responsePromise);
  }
}
