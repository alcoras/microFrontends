// disable lint because otherwise framework specific type is required (like angular's HttpResponse)

import { MicroFrontendInfo } from '../MicroFrontendInfo';

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IMicroFrontend {
  /**
   * Source id of Micro Frontend
   */
  SourceInfo: MicroFrontendInfo;

  /**
   * Inits async is called by factory to assure its execution before
   * Micro Frontend's launch
   */
  InitAsync(): Promise<void>;

  /**
   * Starts QNA (ping-pong messaging) with backend
   */
  StartQNA(): void;

  /**
   * Parses new http response
   * @param response HttpResponse
   */
  NewHttpResponseAsync(response: any): Promise<void>;

  /**
   * Subscribes to events which this micro frontend is responsible for
   */
  SubscribeToEventsAsync(): Promise<any>;

  /**
   * Parses new events
   * @param event Http resposne with event list
   */
  ParseNewEventAsync(eventList: any[]): Promise<void>;
}
