import { uEvent } from './event';

/**
 * Default instant response from API Gateway upon dispatching event(s)
 */
export class APIGatewayResponse extends uEvent {
  /**
   * List of Ids of for every new event(s) dispatched
   */
  public Ids: number[];
}
