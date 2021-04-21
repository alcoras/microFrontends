import { Injectable } from "@angular/core";

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
  BackendToFrontendEvent} from "event-proxy-lib-src";

import { EventBusService } from "./EventBusService";

@Injectable({
  providedIn: "root"
})
export class ObserverService implements IMicroFrontend {

  public SourceInfo: MicroFrontendInfo = MicroFrontendParts.Observer;

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
    for (const element of eventList) {
      switch (element.EventId) {
        case EventIds.ObserverButtonPressed:
            if (this.processButtonPressed(element)) {
              await this.eventProxyService.ConfirmEventsAsync(this.SourceInfo.SourceId, [element.AggregateId]);
            } else {
              console.error(element);
              throw new Error("Did not proccess after processButtonPressed");
            }
            break;
        case EventIds.ObserverSnapshotResult:
            this.eventBus.EventBus.next(element);

            await this.eventProxyService.ConfirmEventsAsync(
              this.SourceInfo.SourceId, [element.AggregateId]);

            await this.eventProxyService.DispatchEventAsync(
                new UnsubscibeToEvent(this.SourceInfo.SourceId, [[0, 0, element.ParentId]]));

            break;
        case EventIds.EventProccessedSuccessfully:
          await this.eventProxyService.ConfirmEventsAsync(
            this.SourceInfo.SourceId, [element.AggregateId]);
          break;
        case EventIds.EventProccessedWithFails:
          console.error(element);
          throw new Error("Event sroccessed with error(s)");
        default:
            throw new Error(`Event ${element.EventId} not implemented.`);
      }
    }
  }

  /**
   * Prepares placements for components
   */
  private preparePlacements(): void {
    this.elToPlace[EventIds.ObserverButtonPressed]
      = "<team-observer></team-observer>";
  }

  /**
   * Process button pressed event
   * @param element EventButtonPressed
   * @returns True if successful
   */
  private processButtonPressed(element: CoreEvent): boolean {
    const e = element as EventButtonPressed;

    switch (e.EventId) {
      case EventIds.ObserverButtonPressed:
        if (e.UniqueElementId) {
          this.putToElement(e.UniqueElementId, this.getElFromID(element.EventId));
          return true;
        }
        break;
    }

    return false;
  }

  /**
   * Puts to element to DOM
   * @param elName element name to put in
   * @param elToPut element name to put
   */
  private putToElement(elName: string, elToPut: string): void {
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
      throw new Error("Unsupported ButtonPressed Id");
    }

    return elId;
  }
}
