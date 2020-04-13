import { uEventsIds, uEvent } from '../../models/event';

/**
 * Subscibe to event model, used to subscribe to other events
 */
export class SubscibeToEvent extends uEvent {
  /**
   * Creates an instance of subscibe to event.
   * @param SourceId subscription will be applied to this source id
   * @param IdsTripleList Array of numbers [0,0,0] [eventid, parentid, somethingelseId]
   * @param [CleanSubscriptionList] boolean flag to indicate whether to clean all previous subs
   */
  constructor(
    SourceId: string,
    public IdsTripleList: any[][],
    public CleanSubscriptionList: boolean = false) {
      super();
      this.EventId = uEventsIds.SubscribeToEvent;
      this.SourceId = SourceId;
    }
}
