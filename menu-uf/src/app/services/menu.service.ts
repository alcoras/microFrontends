import { Injectable } from '@angular/core';

import {
  EventProxyLibService,
  CoreEvent,
  ResponseStatus,
  IMicroFrontend,
  MicroFrontendInfo,
  MicroFrontendParts,
  EventIds } from 'event-proxy-lib-src'
;

@Injectable({
  providedIn: 'root'
})
export class MenuService implements IMicroFrontend {

  public SourceInfo: MicroFrontendInfo = MicroFrontendParts.Menu;

  public constructor(private eventProxyService: EventProxyLibService) {}

  public async InitAsync(): Promise<void> {
    return Promise.resolve();
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

  public async ParseNewEventAsync(eventList: CoreEvent[]): Promise<void> {
    for (const element of eventList) {
      /**
       * Init menu event
       */
      if (element.EventId === EventIds.InitMenu) {
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
