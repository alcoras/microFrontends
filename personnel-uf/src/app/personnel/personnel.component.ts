import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { UParts, uEventsIds, EventResponse } from '@uf-shared-models/index';
import { EventProxyLibService } from '@uf-shared-libs/event-proxy-lib';
import { EventButtonPressed, SubscibeToEvent } from '@uf-shared-events/index';
import { EventBusService } from '../services/EventBus.service';

/**
 * Main entry for personnel micro frontend
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
   * Element to place array
   */
  private elToPlace: { [id: number]: string } = {};

  constructor(
    private eProxyService: EventProxyLibService,
    private eventBusService: EventBusService) {
  }

  /**
   * Inits async is called by factory to assure its execution
   * @returns Promise
   */
  public async InitAsync() {
    this.preparePlacements();
    await this.subscribeToEventsAsync();
  }

  /**
   * Starts qna with backend
   */
  public StartQNA() {
    this.eProxyService.StartQNA(this.sourceId).subscribe(
      (response: HttpResponse<any>) => {
        if (!response) {
          throw new Error('Can\'t connect to backend');
        }

        if (!response.body) { return; }

        if (!response.body.hasOwnProperty('EventId')) {
          throw new Error('No EventId in message');
        }

        if (response.body['EventId'] === uEventsIds.GetNewEvents) {
          this.parseNewEvent(response);
        }
      },
      (error) => { console.log(this.sourceName, error); },
      () => { }
    );
  }

  /**
   * Subscribes to events which this micro frontend is responsible for
   * @returns Promise
   */
  private async subscribeToEventsAsync(): Promise<HttpResponse<any>> {
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
  private preparePlacements() {
    this.elToPlace[uEventsIds.PerssonelButtonPressed] = '<team-personnel-2></team-personnel-2>';
  }

  /**
   * Parses new events
   * @param event HttpResposne with event list
   */
  private parseNewEvent(event: HttpResponse<EventResponse>) {
    event.body.Events.forEach(element => {
      switch (element.EventId) {
        case uEventsIds.PerssonelButtonPressed:
          if (this.processButtonPressed(element)) {
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
   */
  private processButtonPressed(event: any) {
    const e = event as EventButtonPressed;

    // TODO: remove tslint:disable.. after one more case in switch
    // tslint:disable-next-line: no-small-switch
    switch (e.EventId) {
      case uEventsIds.PerssonelButtonPressed:
        if (e.UniqueElementId) {
          this.putToElement(e.UniqueElementId, this.getElFromID(e.EventId));
          return true;
        }
        break;
    }

    return false;
  }

  /**
   * Puts to element to DOm
   * @param elName element name to put in
   * @param elToPut element name to put
   */
  private putToElement(elName: string, elToPut: string) {
    let element: HTMLElement;
    element = document.getElementById(elName);
    element.innerHTML = elToPut;
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
