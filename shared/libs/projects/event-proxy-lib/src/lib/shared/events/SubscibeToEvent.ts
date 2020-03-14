import { uEventsIds, uEvent } from '../models/event';

/**
 * Subscibe to event model, used to subscribe to other events
 */
export class SubscibeToEvent extends uEvent
{
  EventId = uEventsIds.SubscribeToEvent;

  /**
   * Creates an instance of subscibe to event.
   * @param IdsTripleList Array of numbers [0,0,0] [eventid, parentid, somethingelseId]
   * @param [CleanSubscriptionList] boolean flag to indicate whether to clean all previous subs
   */
  constructor(
    public IdsTripleList: any[][],
    public CleanSubscriptionList: boolean = false) {
    super(); }
}
