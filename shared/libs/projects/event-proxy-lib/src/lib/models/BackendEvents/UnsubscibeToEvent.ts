import { CoreEvent } from '../CoreEvent';
import { EventIds } from '../EventIds';

/**
 * Unsubscrube to event model, used to unsubscribe to other events
 */
export class UnsubscibeToEvent extends CoreEvent {
  /**
   * Creates an instance of unsubscibe to event.
   * @param SourceId unsubscriptions will be applied to this source id
   * @param IdsTripleList Array of numbers [0,0,0] [eventid, parentid, somethingelseId]
   * @param [CleanSubscriptionList] boolean flag to indicate whether to clean all previous subs
   */
  public constructor(
    SourceId: string,
    public IdsTripleList: number[][],
    public CleanSubscriptionList: boolean = false) {
      super();
      this.SubscribeToChildren = false;
      this.EventId = EventIds.Unsubscribe;
      this.SourceId = SourceId;
    }
}
