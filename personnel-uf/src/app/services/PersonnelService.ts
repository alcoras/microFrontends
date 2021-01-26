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
  UnsubscibeToEvent} from 'event-proxy-lib-src';

import { EventBusService } from './EventBus.service';

/**
 * Component for personnel micro frontend to connect to backend
 */
@Injectable({
  providedIn: 'root'
})
export class PersonnelService implements IMicroFrontend {

  public SourceInfo: MicroFrontendInfo = MicroFrontendParts.Personnel;

  /**
   * Element to place dictionary
   */
  private elToPlace: { [id: number]: string } = {};

  public constructor(
    private eventProxyService: EventProxyLibService,
    private eventBusService: EventBusService) {}

  public async InitAsync(): Promise<void> {
    this.preparePlacements();
  }

  /**
   * Initialize Connection to backend (API gateway)
   */
  public InitializeConnectionWithBackend(): void {

    this.eventProxyService.InitializeConnectionToBackend(this.SourceInfo.SourceId).subscribe(
      (response: ValidationStatus) => {
        if (this.eventProxyService.PerformResponseCheck(response)) {
          this.ParseNewEventAsync(response.HttpResult.body.Events);
        }
      },
      (error: ValidationStatus) => {
        this.eventProxyService.EndListeningToBackend();
        throw new Error(error.Error);
      }
    );

  }

  public async ParseNewEventAsync(eventList: CoreEvent[]): Promise<void> {
    for (const element of eventList) {
      switch (element.EventId) {
        case EventIds.PersonnelButtonPressed:
          if (this.processButtonPressed(element as EventButtonPressed)) {
            this.eventProxyService.ConfirmEventsAsync(this.SourceInfo.SourceId, [element.AggregateId]).toPromise();
          } else {
            throw new Error('Did not proccess after processButtonPressed');
          }
          break;
        case EventIds.ReadPersonData:
          await this.eventProxyService.ConfirmEventsAsync(
            this.SourceInfo.SourceId, [element.AggregateId]).toPromise();

          await this.eventProxyService.DispatchEventAsync(
            new UnsubscibeToEvent(this.SourceInfo.SourceId, [[0, 0, element.ParentId]])).toPromise();
          this.eventBusService.EventBus.next(element);
          break;
        case EventIds.EventProccessedSuccessfully:
            await this.eventProxyService.ConfirmEventsAsync(
              this.SourceInfo.SourceId, [element.AggregateId]).toPromise();
            break;
        case EventIds.EventProccessedWithFails:
            console.error(element);
            throw new Error(`Event sroccessed with error(s)`);
        default:
          console.error(element);
          throw new Error('Event is not implemented.');
      }
    }
  }

  /**
   * Prepares placements for components
   */
  private preparePlacements(): void {
    this.elToPlace[EventIds.PersonnelButtonPressed]
      = '<team-personnel-2></team-personnel-2>';
  }

  /**
   * Process button pressed event
   * @param event EventButtonPressed
   * @returns true if successfully done
   */
  private processButtonPressed(event: EventButtonPressed): boolean {

    switch (event.EventId) {
      case EventIds.PersonnelButtonPressed:
        if (event.UniqueElementId) {
          this.putToElement(event.UniqueElementId, this.getElFromID(event.EventId));
          return true;
        }
        break;
    }

    return false;
  }

  /**
   * Puts to element to DOM
   *
   * @param {string} elName element name to put in
   * @param {string} elToPut element name to put
   */
  private putToElement(elName: string, elToPut: string): void {
    document.getElementById(elName).innerHTML = elToPut;
  }

  /**
   * Gets element by id
   * @param id number of elment
   * @returns {string} name of element
   */
  private getElFromID(id: number): string {
    const elId = this.elToPlace[id];

    if (!elId) {
      throw new Error('Unsupported ButtonPressed Id');
    }

    return elId;
  }
}
