import { CoreEvent } from '../CoreEvent';

/**
 * Default instant response from API Gateway upon dispatching event(s)
 */
export class APIGatewayResponse extends CoreEvent {
  /**
   * List of Ids of for every new event(s) dispatched
   */
  public Ids: number[];
}
