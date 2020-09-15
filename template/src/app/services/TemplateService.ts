import { Injectable } from '@angular/core';
import {
  IMicroFrontend,
  UParts,
  uEventsIds,
  EventResponse,
  uEvent,
  MicroFrontendInfo } from '@uf-shared-models/index';
import { EventProxyLibService } from '@uf-shared-libs/event-proxy-lib';
import { HttpResponse } from '@angular/common/http';
import { SubscibeToEvent, EventButtonPressed } from '@uf-shared-events/index';
import { EventBusService } from './EventBus.service';
import { ResponseStatus } from '@uf-shared-libs/event-proxy-lib/lib/ResponseStatus';

@Injectable({
  providedIn: 'root'
})
export class TemplateService implements IMicroFrontend {

  public SourceInfo: MicroFrontendInfo = UParts.<template_data>;

  /**
   * Element to place dictionary
   */
  private elToPlace: { [id: number]: string } = {};

  public constructor(
    private eventBus: EventBusService,
    private eventProxyService: EventProxyLibService) {}

  public async InitAsync(): Promise<void> {
    await this.SubscribeToEventsAsync();
    this.preparePlacements();
  }

  /**
   * InitializeConnectionWithBackend
   */
  public InitializeConnectionWithBackend() {
    this.eventProxyService.InitializeConnectionToBackend(
      this.SourceInfo.SourceId,
      ParseNewEventAsync,
      eventProxyService.PerformResponseCheck);
  }

  public SubscribeToEventsAsync(): Promise<ResponseStatus> {
    const e = new SubscibeToEvent(
      this.SourceInfo.SourceId, [
      [123, 0, 0],
    ]);

    e.SourceName = this.SourceInfo.SourceName;

    return this.eventProxyService.DispatchEvent(e).toPromise();
  }

  public async ParseNewEventAsync(eventList: uEvent[]): Promise<void> {
    for (const element of eventList) {
      switch (element.EventId) {
        case uEventsIds.<button_pressed_id>:
            if (this.processButtonPressed(element)) {
              await this.eventProxyService.ConfirmEvents(this.SourceInfo.SourceId, [element.AggregateId]).toPromise();
            } else {
              console.error(element);
              throw new Error('Did not proccess after processButtonPressed');
            }
            break;
        case uEventsIds.<TemplateRead>:
            this.eventBus.EventBus.next(element);
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
    this.elToPlace[uEventsIds.<button_pressed_id>] = '<team-<project_name>></team-<project_name>>';
  }

  /**
   * Process button pressed event
   * @param element EventButtonPressed
   * @returns True if successful
   */
  private processButtonPressed(element: uEvent): boolean {
    const e = element as EventButtonPressed;

    switch (e.EventId) {
      case uEventsIds.OccupationNg9ButtonPressed:
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
