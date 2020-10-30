import { CoreEvent, EventIds } from "event-proxy-lib-src";

/**
 * Event used to request snapshot of events
 */
export class ObserverSnapshowQuery extends CoreEvent {

  /**
   * Creates instance
   * @param sourceId source id
   */
  public constructor(sourceId: string) {
    super();

    this.SourceId = sourceId;
    this.EventId = EventIds.ObserverSnapshotQuery;
  }
}
