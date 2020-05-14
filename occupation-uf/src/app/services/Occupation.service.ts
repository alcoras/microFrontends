import { Injectable } from '@angular/core';
import { IMicroFrontend, UParts, uEventsIds, EventResponse, APIGatewayResponse, uEvent } from '@uf-shared-models/index';
import { EventProxyLibService } from '@uf-shared-libs/event-proxy-lib';
import { HttpResponse } from '@angular/common/http';
import { SubscibeToEvent, EventButtonPressed } from '@uf-shared-events/index';
import { EventBusService } from './EventBus.service';

@Injectable({
  providedIn: 'root'
})
export class OccupationService implements IMicroFrontend {
  public SourceId: string = UParts.Occupations.SourceId;
  public SourceName: string = UParts.Occupations.SourceId;

  /**
   * Element to place dictionary
   */
  private elToPlace: { [id: number]: string } = {};

  public constructor(
    private eventBus: EventBusService,
    private eventProxyService: EventProxyLibService) {}

  public async InitAsync(): Promise<void> {
    this.SubscribeToEventsAsync();
    this.preparePlacements();
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

  public SubscribeToEventsAsync():  Promise<HttpResponse<APIGatewayResponse>> {
    const e = new SubscibeToEvent(
      this.SourceId, [
      [uEventsIds.OccupationsRead, 0, 0]
    ]);

    e.SourceName = this.SourceName;

    return this.eventProxyService.DispatchEvent(e).toPromise();
  }

  public async ParseNewEventAsync(eventList: uEvent[]): Promise<void> {
    for (const element of eventList) {
      switch (element.EventId) {
        case uEventsIds.OccupationNg9ButtonPressed:
            if (this.processButtonPressed(element)) {
              this.eventProxyService.ConfirmEvents(this.SourceId, [element.AggregateId]).toPromise();
            } else {
              throw new Error('Did not proccess after processButtonPressed');
            }
            break;
          case uEventsIds.OccupationsRead:
            this.eventBus.EventBus.next(element);
            break;
          default:
            throw new Error('Event not implemented.');
        }
    }
  }

  /**
   * Prepares placements for components
   */
  private preparePlacements(): void {
    this.elToPlace[uEventsIds.OccupationNg9ButtonPressed] = '<team-occupation-ng9></team-occupation-ng9>';
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
