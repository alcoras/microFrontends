import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { uParts, uEventsIds, EventResponse } from '@uf-shared-models/index';
import { EventProxyLibService } from '@uf-shared-libs/event-proxy-lib';
import { EventButtonPressed, SubscibeToEvent } from '@uf-shared-events/index';
import { EventBusService } from '../services/EventBus.service';

@Injectable({
  providedIn: 'root'
})
export class PersonnelComponent {
  private title = 'personnel';
  private sourceId: string = uParts.Personnel;
  private elToPlace: { [id: number]: string } = {};

  constructor(
    private eProxyService: EventProxyLibService,
    private eventBusService: EventBusService) {
  }

  public async InitAsync() {
    this.eProxyService.env.loadConfig();
    this.eProxyService.StartQNA(this.sourceId).subscribe(
      (value: HttpResponse<any>) => {
        if (!value) {
          throw new Error('Can\'t connect to backend');
        }

        if (!value.body) { return; }

        if (!value.body.hasOwnProperty('EventId')) {
          throw new Error('No EventId in message');
        }

        if (value.body['EventId'] === uEventsIds.GetNewEvents) {
          this.parseNewEvent(value);
        }
      },
      (error) => { console.log(this.title, error); },
      () => {}
    );

    this.preparePlacements();

    return new Promise(async (resolve) => {
      await this.subscribeToEventsAsync();

      resolve();
    });
  }

  /**
   * Subscribes to events which this micro frontend is responsible for
   * @returns Promise
   */
  private subscribeToEventsAsync() {
    const e = new SubscibeToEvent([
      [uEventsIds.ReadPersonData, 0, 0],
    ], true);

    e.SourceId = this.sourceId;

    return this.eProxyService.DispatchEvent(e).toPromise();
  }

  private preparePlacements() {
    this.elToPlace[uEventsIds.PerssonelButtonPressed] = '<team-personnel-2></team-personnel-2>';
  }

  private parseNewEvent(event: HttpResponse<EventResponse>) {

    event.body.Events.forEach(element => {
      this.eProxyService.ConfirmEvents(this.sourceId, [element.AggregateId]).toPromise();
      switch (element.EventId) {
        case uEventsIds.PerssonelButtonPressed:
          this.processButtonPressed(element);
          break;
        case uEventsIds.ReadPersonData:
          this.eventBusService.EventBus.next(element);
          break;
        default:
          throw new Error('Event not implemented.');
      }
    });
  }

  private processButtonPressed(event: any) {
    const e = event as EventButtonPressed;

    // TODO: remove tslint:disable.. after one more case in switch
    // tslint:disable-next-line: no-small-switch
    switch (e.EventId) {
      case uEventsIds.PerssonelButtonPressed:
        if (e.UniqueElementId) {
          this.putToElement(e.UniqueElementId, this.getElFromID(e.EventId));
        }
        break;
    }
  }

  private putToElement(elName: string, elToPut: string) {
    let element: HTMLElement;
    element = document.getElementById(elName);
    element.innerHTML = elToPut;
  }

  private getElFromID(id: number): string {
    const elId = this.elToPlace[id];

    if (!elId) {
      throw new Error('Unsupported ButtonPressed Id');
    }

    return elId;
  }
}
