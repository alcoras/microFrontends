import { Component } from '@angular/core';
import { EventProxyLibService } from '@uf-shared-libs/event-proxy-lib';
import { UParts, uEventsIds, uEvent } from '@uf-shared-models/index';
import { EventButtonPressed } from '@uf-shared-events/index';
import { EventBusService } from './services/EventBus.service';
import { HttpResponse } from '@angular/common/http';

/**
 * Component
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  /**
   * Source id of observer
   */
  private sourceId: string = UParts.Observer.SourceId;

  /**
   * Source name of observer
   */
  private sourceName: string = UParts.Observer.SourceName;

  constructor(
    private eProxyService: EventProxyLibService,
    private eventBus: EventBusService
  ) {
    this.StartQNA();
  }

  /**
   * Starts qna with backend
   */
  public StartQNA() {
    this.eProxyService.StartQNA(this.sourceId).subscribe(
      (value) => {
        this.newHttpResponseAsync(value);
      },
      (error) => { console.error(this.sourceName, error); },
      () => {}
    );
  }

  /**
   * Parses new http response
   * @param response HttpResponse
   */
  private async newHttpResponseAsync(response: HttpResponse<any>) {
    if (!response) {
      throw new Error('Can\'t connect to backend');
    }

    if (!response.body) { return; }

    if (!response.body.hasOwnProperty('EventId')) {
      throw new Error('No EventId in message');
    }

    if (response.body['EventId'] === uEventsIds.GetNewEvents) {
      this.parseNewEventAsync(response.body);
    }
  }

  /**
   * Parses new events
   * @param event Event array
   */
  private async parseNewEventAsync(eventList: uEvent[]) {
    for (const element of eventList) {
      this.eventBus.EventBus.next(element);
      console.log(`${this.sourceId} Parsing event:`, element);

      if (element.EventId === uEventsIds.ObserverButtonPressed) {
        this.processButtonPressed(element);
        this.eProxyService.ConfirmEvents(this.sourceId, [element.AggregateId]).toPromise();
      }
    }
  }

  /**
   * Process button pressed
   * @param event uEvent
   */
  private processButtonPressed(event: uEvent) {
    const buttonEvent = event as EventButtonPressed;

    if (buttonEvent.UniqueElementId) {
      this.putToElement(buttonEvent.UniqueElementId, 'TODO');
    } else {
      console.error('Could not parse:', buttonEvent);
      throw new Error('UniqueElementId is not defined');
    }
  }

  /**
   * Puts to element into another element
   * @param elName element name where to put
   * @param elToPut element to put in
   */
  private putToElement(elName: string, elToPut: string) {
    let element: HTMLElement;
    element = document.getElementById(elName);
    element.innerHTML = elToPut;
  }

}
