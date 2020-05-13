import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { UParts, uEventsIds, EventResponse, APIGatewayResponse } from '@uf-shared-models/index';
import { EventProxyLibService } from '@uf-shared-libs/event-proxy-lib';
import { EventButtonPressed, SubscibeToEvent } from '@uf-shared-events/index';
import { EventBusService } from '../services/EventBus.service';

/**
 * Component for personnel micro frontend to connect to backend
 */
@Injectable({
  providedIn: 'root'
})
export class PersonnelComponent {
  /**
   * Source id of personnel component
   */
  private sourceId: string = UParts.Personnel.SourceId;

  /**
   * Source name of personnel component
   */
  private sourceName: string = UParts.Personnel.SourceName;

  /**
   * Element to place dictionary
   */
  private elToPlace: { [id: number]: string } = {};

  public constructor(
    private eProxyService: EventProxyLibService,
    private eventBusService: EventBusService) {
  }

  /**
   * Inits async is called by factory to assure its execution
   *
   * @returns Promise
   */
  public async InitAsync(): Promise<void> {
    this.preparePlacements();
    await this.subscribeToEventsAsync();
  }

  /**
   * Starts qna with backend
   */
  public StartQNA(): void {
    this.eProxyService.StartQNA(this.sourceId).subscribe(
      (response: HttpResponse<EventResponse>) => {
        this.newHttpResponseAsync(response);
      },
      (error) => { console.error(this.sourceName, error); },
    );
  }

  /**
   * Parses new http response
   * @param response HttpResponse
   */
  private async newHttpResponseAsync(response: HttpResponse<EventResponse>): Promise<void> {
    if (!response) {
      throw new Error('Can\'t connect to backend');
    }

    if (!response.body) { return; }

    if (!Object.prototype.hasOwnProperty.call(response.body, 'EventId')) {
      throw new Error('No EventId in message');
    }

    if (response.body['EventId'] === uEventsIds.GetNewEvents) {
      this.parseNewEvent(response);
    }
  }

  /**
   * Subscribes to events which this micro frontend is responsible for
   * @returns Promise
   */
  private async subscribeToEventsAsync(): Promise<HttpResponse<APIGatewayResponse>> {
    const e = new SubscibeToEvent(
      this.sourceId, [
      [uEventsIds.ReadPersonData, 0, 0]
    ]);

    e.SourceName = this.sourceName;

    return this.eProxyService.DispatchEvent(e).toPromise();
  }

  /**
   * Prepares placements for components
   */
  private preparePlacements(): void {
    this.elToPlace[uEventsIds.PersonnelButtonPressed] = '<team-personnel-2></team-personnel-2>';
  }

  /**
   * Parses new events
   * @param event HttpResposne with event list
   */
  private parseNewEvent(event: HttpResponse<EventResponse>): void {
    event.body.Events.forEach(element => {
      switch (element.EventId) {
        case uEventsIds.PersonnelButtonPressed:
          if (this.processButtonPressed(element as EventButtonPressed)) {
            this.eProxyService.ConfirmEvents(this.sourceId, [element.AggregateId]).toPromise();
          } else {
            throw new Error('Did not proccess after processButtonPressed');
          }
          break;
        case uEventsIds.ReadPersonData:
          this.eventBusService.EventBus.next(element);
          break;
        default:
          throw new Error('Event is not implemented.');
      }
    });
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
