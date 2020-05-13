import { uEvent } from './event';

/**
 * Standard structure for getting new events
 */
export class EventResponse {
  /**
   * Event Id
   *
   */
  public EventId: number;

  /**
   * List of events
   */
  public Events: uEvent[];
}
