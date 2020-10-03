import { Injectable } from '@angular/core';

import {
  EventProxyLibService,
  SubscibeToEvent,
  CoreEvent,
  ResponseStatus,
  EventIds,
  IMicroFrontend,
  EventButtonPressed,
  MicroFrontendInfo,
  MicroFrontendParts} from 'event-proxy-lib-src'
;

import { EventBusService } from './EventBus.service';


@Injectable({
  providedIn: 'root'
})
export class TemplateService implements IMicroFrontend {

  public SourceInfo: MicroFrontendInfo = MicroFrontendParts.<template_data>;

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

  public SubscribeToEventsAsync(): Promise<ResponseStatus> {
    const e = new SubscibeToEvent(
      this.SourceInfo.SourceId, [
      [123, 0, 0],
    ]);

    e.SourceName = this.SourceInfo.SourceName;

    return this.eventProxyService.DispatchEvent(e).toPromise();
  }

  public async ParseNewEventAsync(eventList: CoreEvent[]): Promise<void> {
    for (const element of eventList) {
      switch (element.EventId) {
        case EventIds.<button_pressed_id>:
            if (this.processButtonPressed(element)) {
              await this.eventProxyService.ConfirmEvents(this.SourceInfo.SourceId, [element.AggregateId]).toPromise();
            } else {
              console.error(element);
              throw new Error('Did not proccess after processButtonPressed');
            }
            break;
        case EventIds.<TemplateRead>:
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
    this.elToPlace[EventIds.<button_pressed_id>] = '<team-<project_name>></team-<project_name>>';
  }

  /**
   * Process button pressed event
   * @param element EventButtonPressed
   * @returns True if successful
   */
  private processButtonPressed(element: CoreEvent): boolean {
    const e = element as EventButtonPressed;

    switch (e.EventId) {
      case EventIds.<button_pressed_id>:
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
