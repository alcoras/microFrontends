export interface IMicroFrontend {
  /**
   * Source id of Micro Frontend
   */
  SourceId: string;

  /**
   * Source name of Micro Frontend
   */
  SourceName: string;

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
  // disable lint because otherwise framework specific type is required
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  NewHttpResponseAsync(response: any): Promise<void>;

  /**
   * Subscribes to events which this micro frontend is responsible for
   */
  SubscribeToEventsAsync(): Promise<void>;

  /**
   * Parses new events
   * @param event Http resposne with event list
   */
  // disable lint because otherwise framework specific type is required
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ParseNewEventAsync(eventList: any[]): Promise<void>;
}
