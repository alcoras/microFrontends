import { Injectable } from '@angular/core';

import {
  EventProxyLibService,
  CoreEvent,
  ValidationStatus,
  IMicroFrontend,
  EventButtonPressed,
  MicroFrontendInfo,
  MicroFrontendParts,
  EventIds,
  UnsubscibeToEvent,
  BackendToFrontendEvent} from 'event-proxy-lib-src';

import { EventBusService } from './EventBusService';

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
    this.preparePlacements();
  }

  /**
   * Initialize Connection to backend (API gateway)
   */
  public InitializeConnectionWithBackend(): void {

    this.eventProxyService.InitializeConnectionToBackend(this.SourceInfo.SourceId).subscribe(
      (response: ValidationStatus<BackendToFrontendEvent>) => {
        if (this.eventProxyService.PerformResponseCheck(response)) {
          this.ParseNewEventAsync(response.Result.Events);
        }
      },
      (response: ValidationStatus<BackendToFrontendEvent>) => {
        this.eventProxyService.EndListeningToBackend();
        throw new Error(response.ErrorList.toString());
      }
    );

  }

  public async ParseNewEventAsync(eventList: CoreEvent[]): Promise<void> {
    for (const event of eventList) {
      switch (event.EventId) {
        case EventIds.MaterialsReceiptsButtonPressed:
          if (this.processButtonPressed(event)) {
            await this.eventProxyService.ConfirmEventsAsync(this.SourceInfo.SourceId, [event.AggregateId]);
          } else {
            console.error(event);
            throw new Error('Did not proccess after processButtonPressed');
          }
          break;
        case EventIds.MaterialsReceiptsScanTableReadListResults:
        case EventIds.MaterialsReceiptsReadListResults:
        case EventIds.MaterialsReceiptsTablePartReadListResults:
        case EventIds.MaterialsReceiptsLocationsReadListResults:
        case EventIds.MaterialsReceiptsMaterialsAtLocationsReadListResults:
        case EventIds.MaterialsReceiptsMaterialsReadListResults:
        case EventIds.CastorFound:
          await this.eventProxyService.ConfirmEventsAsync(
            this.SourceInfo.SourceId, [event.AggregateId]);

          await this.eventProxyService.DispatchEventAsync(
            new UnsubscibeToEvent(this.SourceInfo.SourceId, [[0, 0, event.ParentId]]));

          this.eventBus.EventBus.next(event);
          break;
        case EventIds.EventProccessedSuccessfully:
          await this.eventProxyService.ConfirmEventsAsync(
            this.SourceInfo.SourceId, [event.AggregateId]);
          break;
        case EventIds.EventProccessedWithFails:
          console.error(event);
          throw new Error(`Event sroccessed with error(s)`);
        default:
          throw new Error(`Event ${event.EventId} not implemented.`);
      }
    }
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
