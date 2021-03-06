import { CoreEvent } from "../CoreEvent";
import { EventIds } from "../EventIds";

/**
 * Subscibe to event model, used to subscribe to other events
 */
export class SubscibeToEvent extends CoreEvent {
  /**
   * Creates an instance of subscibe to event.
   * @param SourceId subscription will be applied to this source id
   * @param IdsTripleList Array of numbers [0,0,0] [eventid, parentid, somethingelseId]
   * @param [CleanSubscriptionList] boolean flag to indicate whether to clean all previous subs
   */
  public constructor(
    SourceId: string,
    public IdsTripleList: number[][],
    public CleanSubscriptionList: boolean = false) {
      super();
      this.EventId = EventIds.SubscribeToEvent;
      this.SourceId = SourceId;
    }
}
