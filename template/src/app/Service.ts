import { Injectable } from '@angular/core';

import {
  EventProxyLibService,
  SubscibeToEvent,
  CoreEvent,
  ValidationStatus,
  EventIds,
  IMicroFrontend,
  EventButtonPressed,
  MicroFrontendInfo,
  MicroFrontendParts,
  BackendToFrontendEvent } from 'event-proxy-lib-src';

import { EventBusService } from './EventBusService';

@Injectable({
  providedIn: 'root'
})
export class $project_name$Service implements IMicroFrontend {

  public SourceInfo: MicroFrontendInfo = MicroFrontendParts.$project_name$;

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
        case EventIds.$button_pressed_event$:
          if (this.processButtonPressed(element)) {
            await this.eventProxyService.ConfirmEventsAsync(this.SourceInfo.SourceId, [element.AggregateId]);
          } else {
            console.error(element);
            throw new Error('Did not proccess after processButtonPressed');
          }
          break;
        // case EventIds.<TemplateReadEventId>:
        //     this.eventBus.EventBus.next(element);
        //     break;
        case EventIds.EventProccessedSuccessfully:
          await this.eventProxyService.ConfirmEventsAsync(
            this.SourceInfo.SourceId, [element.AggregateId]);
          break;
        case EventIds.EventProccessedWithFails:
          console.error(element);
          break;
        default:
            throw new Error(`Event ${element.EventId} not implemented.`);
      }
    }
  }

  /**
   * Prepares placements for components
   */
  private preparePlacements(): void {
    this.elToPlace[EventIds.$button_pressed_event$] = '<team-$project_name_html$></team-$project_name_html$>';
  }

  /**
   * Process button pressed event
   * @param element EventButtonPressed
   * @returns True if successful
   */
  private processButtonPressed(element: CoreEvent): boolean {
    const e = element as EventButtonPressed;

    switch (e.EventId) {
      case EventIds.$button_pressed_event$:
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
      throw new Error('Unsupported ButtonPressed Id');
    }

    return elId;
  }
}
