import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { UParts, uEventsIds, EventResponse, APIGatewayResponse, IMicroFrontend, uEvent } from '@uf-shared-models/index';
import { EventProxyLibService } from '@uf-shared-libs/event-proxy-lib';
import { EventButtonPressed, SubscibeToEvent } from '@uf-shared-events/index';
import { EventBusService } from '../services/EventBus.service';

/**
 * Component for personnel micro frontend to connect to backend
 */
@Injectable({
  providedIn: 'root'
})
export class PersonnelComponent implements IMicroFrontend {
  public SourceId: string = UParts.Personnel.SourceId;
  public SourceName: string = UParts.Personnel.SourceName;

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

  public StartQNA(): void {
    this.eventProxyService.StartQNA(this.SourceId).subscribe(
      (response: HttpResponse<EventResponse>) => {
        this.NewHttpResponseAsync(response);
      },
      (error) => { console.error(this.SourceName, error); },
    );
  }

  public async NewHttpResponseAsync(response: HttpResponse<EventResponse>): Promise<void> {
    if (!response) { throw new Error('Can\'t connect to backend'); }

    if (!response.body) { return; }

    if (!Object.prototype.hasOwnProperty.call(response.body, 'EventId')) {
      throw new Error('No EventId in message');
    }

    if (response.body['EventId'] === uEventsIds.GetNewEvents) {
      this.ParseNewEventAsync(response.body.Events);
    }
  }

  /**
   * Subscribes to events which this micro frontend is responsible for
   * @returns Promise
   */
  public async SubscribeToEventsAsync(): Promise<HttpResponse<APIGatewayResponse>> {
    const e = new SubscibeToEvent(
      this.SourceId, [
      [uEventsIds.ReadPersonData, 0, 0]
    ]);

    e.SourceName = this.SourceName;

    return this.eventProxyService.DispatchEvent(e).toPromise();
  }

  public async ParseNewEventAsync(eventList: uEvent[]): Promise<void> {
    for (const element of eventList) {
      switch (element.EventId) {
        case uEventsIds.PersonnelButtonPressed:
          if (this.processButtonPressed(element as EventButtonPressed)) {
            this.eventProxyService.ConfirmEvents(this.SourceId, [element.AggregateId]).toPromise();
          } else {
            throw new Error('Did not proccess after processButtonPressed');
          }
          break;
        case uEventsIds.ReadPersonData:
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
    this.elToPlace[uEventsIds.PersonnelButtonPressed] = '<team-personnel-2></team-personnel-2>';
  }

  /**
   * Process button pressed event
   * @param event EventButtonPressed
   * @returns true if successfully done
   */
  private processButtonPressed(event: EventButtonPressed): boolean {

    // TODO: remove tslint:disable.. after one more case in switch
    // tslint:disable-next-line: no-small-switch
    switch (event.EventId) {
      case uEventsIds.PersonnelButtonPressed:
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
