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
  EventIds} from 'event-proxy-lib-src';

import { EventBusService } from './EventBus.service';

/**
 * Component for personnel micro frontend to connect to backend
 */
@Injectable({
  providedIn: 'root'
})
export class PersonnelComponent implements IMicroFrontend {

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
    await this.SubscribeToEventsAsync();
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

  /**
   * Subscribes to events which this micro frontend is responsible for
   * @returns Promise
   */
  public async SubscribeToEventsAsync(): Promise<ResponseStatus> {
    const e = new SubscibeToEvent(
      this.SourceInfo.SourceId, [
      [EventIds.ReadPersonData, 0, 0]
    ]);

    e.SourceName = this.SourceInfo.SourceName;

    return this.eventProxyService.DispatchEvent(e).toPromise();
  }

  public async ParseNewEventAsync(eventList: CoreEvent[]): Promise<void> {
    for (const element of eventList) {
      switch (element.EventId) {
        case EventIds.PersonnelButtonPressed:
          if (this.processButtonPressed(element as EventButtonPressed)) {
            this.eventProxyService.ConfirmEvents(this.SourceInfo.SourceId, [element.AggregateId]).toPromise();
          } else {
            throw new Error('Did not proccess after processButtonPressed');
          }
          break;
        case EventIds.ReadPersonData:
          await this.eventProxyService.ConfirmEvents(
            this.SourceInfo.SourceId, [element.AggregateId]).toPromise();
          this.eventBusService.EventBus.next(element);
          break;
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
