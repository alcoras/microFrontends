import { Injectable } from '@angular/core';
import { IMicroFrontend, EventResponse, uEventsIds, uEvent, UParts, MicroFrontendInfo } from '@uf-shared-models/index';
import { EventProxyLibService } from '@uf-shared-libs/event-proxy-lib';
import { HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MenuService implements IMicroFrontend {

  public SourceInfo: MicroFrontendInfo = UParts.Menu;

  public constructor(private eventProxyService: EventProxyLibService) {}

  public async InitAsync(): Promise<void> {
    return Promise.resolve();
  }

  public StartQNA(): void {
    this.eventProxyService.StartQNA(this.SourceInfo.SourceId).subscribe(
      (response: HttpResponse<EventResponse>) => {
        this.NewHttpResponseAsync(response);
      },
      (error) => { console.error(this.SourceInfo.SourceName, error); },
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

  public async ParseNewEventAsync(eventList: uEvent[]): Promise<void> {
    for (const element of eventList) {
      /**
       * Init menu event
       */
      if (element.EventId === uEventsIds.InitMenu) {
        this.putToElement('menu-team', '<menu-team></menu-team>');
        await this.eventProxyService.ConfirmEvents(this.SourceInfo.SourceId, [element.AggregateId]).toPromise();
      } else {
        throw new Error('Event not implemented.');
      }
    }
  }

  public async SubscribeToEventsAsync(): Promise<void> {
    throw new Error("Method not implemented.");
  }

  /**
   * Puts to element to DOM
   * @param elName element name to put in
   * @param elToPut element name to put
   */
  private putToElement(elName: string, elToPut: string): void {
    document.getElementById(elName).innerHTML = elToPut;
  }
}
