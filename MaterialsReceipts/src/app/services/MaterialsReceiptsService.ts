import { Injectable } from '@angular/core';

import {
  EventProxyLibService,
  SubscibeToEvent,
  CoreEvent,
  ResponseStatus,
  IMicroFrontend,
  EventButtonPressed,
  MicroFrontendInfo,
  MicroFrontendParts,
  EventIds,
  UnsubscibeToEvent} from 'event-proxy-lib-src';

import { EventBusService } from './EventBus.service';

@Injectable({
  providedIn: 'root'
})
export class MaterialsReceiptsService implements IMicroFrontend {

  public SourceInfo: MicroFrontendInfo = MicroFrontendParts.MaterialsReceipts;

  /**
   * Element to place dictionary
   */
  private elToPlace: { [id: number]: string } = {};

  public constructor(
    private eventBus: EventBusService,
    private eventProxyService: EventProxyLibService) {}

  public async InitAsync(): Promise<void> {
    // await this.SubscribeToEventsAsync();
    this.preparePlacements();
  }

  /**
   * Initialize Connection to backend (API gateway)
   */
  public InitializeConnectionWithBackend(): void {

    this.eventProxyService.InitializeConnectionToBackend(this.SourceInfo.SourceId).subscribe(
      (response: ResponseStatus) => {
        if (this.eventProxyService.PerformResponseCheck(response)) {
          this.ParseNewEventAsync(response.HttpResult.body.Events);
        }
      },
      (error: ResponseStatus) => {
        this.eventProxyService.EndListeningToBackend();
        throw new Error(error.Error);
      }
    );

  }

  public async ParseNewEventAsync(eventList: CoreEvent[]): Promise<void> {
    for (const event of eventList) {
      switch (event.EventId) {
        case EventIds.MaterialsReceiptsButtonPressed:
          if (this.processButtonPressed(event)) {
            await this.eventProxyService.ConfirmEvents(this.SourceInfo.SourceId, [event.AggregateId]).toPromise();
          } else {
            console.error(event);
            throw new Error('Did not proccess after processButtonPressed');
          }
          break;
        case EventIds.MaterialsReceiptsScanTableReadListResults:
        case EventIds.MaterialsReceiptsReadListResults:
        case EventIds.MaterialsReceiptsTablePartReadListResults:
          await this.eventProxyService.ConfirmEvents(
            this.SourceInfo.SourceId, [event.AggregateId]).toPromise();

          await this.eventProxyService.DispatchEvent(
            new UnsubscibeToEvent(this.SourceInfo.SourceId, [[0, 0, event.ParentId]])).toPromise();

          this.eventBus.EventBus.next(event);
          break;
        case EventIds.EventProccessedSuccessfully:
          await this.eventProxyService.ConfirmEvents(
            this.SourceInfo.SourceId, [event.AggregateId]).toPromise();
          break;
        case EventIds.EventProccessedWithFails:
          console.error(event);
          throw new Error(`Event sroccessed with error(s)`);
        default:
          throw new Error(`Event ${event.EventId} not implemented.`);
      }
    }
  }

  public SubscribeToEventsAsync(): Promise<ResponseStatus> {
    const e = new SubscibeToEvent(
      this.SourceInfo.SourceId, [
      [EventIds.MaterialsReceiptsReadListResults, 0, 0],
      [EventIds.MaterialsReceiptsTablePartReadListResults, 0, 0],
      [EventIds.MaterialsReceiptsScanTableReadListResults, 0, 0]
    ]);

    e.SourceName = this.SourceInfo.SourceName;

    return this.eventProxyService.DispatchEvent(e).toPromise();
  }

  /**
   * Process button pressed event
   * @param element EventButtonPressed
   * @returns True if successful
   */
  private processButtonPressed(element: CoreEvent): boolean {
    const e = element as EventButtonPressed;

    switch (e.EventId) {
      case EventIds.MaterialsReceiptsButtonPressed:
        if (e.UniqueElementId) {
          this.putToElement(e.UniqueElementId, this.getElFromID(element.EventId));
          return true;
        }
        break;
    }

    return false;
  }

  /**
   * Prepares placements for components
   */
  private preparePlacements(): void {
    this.elToPlace[EventIds.MaterialsReceiptsButtonPressed] =
      '<material-receipts></material-receipts>';
  }

  /**
   * Puts to element to DOM
   * @param elName element name to put in
   * @param elToPut element name to put
   */
  private putToElement(elName: string, elToPut: string): void {
    console.log(elName);
    document.getElementById(elName).innerHTML = elToPut;
  }

  /**
   * Gets element by id
   * @param id number of elment
   * @returns name of element
   */
  private getElFromID(id: number): string {
    const elId = this.elToPlace[id];

    if (!elId) {
      throw new Error('Unsupported ButtonPressed Id');
    }

    return elId;
  }
}
