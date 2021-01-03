// disable lint because otherwise framework specific type is required (like angular's HttpResponse)
/* eslint-disable @typescript-eslint/no-explicit-any */

import { MicroFrontendInfo } from './MicroFrontendInfo';

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
   * Starts listening for new events from backend
   */
  InitializeConnectionWithBackend(): void;

  /**
   * Parses new events
   * @param event Http resposne with event list
   */
  ParseNewEventAsync(eventList: any[]): Promise<void>;
}
