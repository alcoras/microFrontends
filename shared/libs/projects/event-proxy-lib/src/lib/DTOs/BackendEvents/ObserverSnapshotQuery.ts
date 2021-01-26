import { CoreEvent } from "../CoreEvent";
import { EventIds } from "../EventIds";
import { MicroFrontendInfo } from "../MicroFrontendInfo";

/**
 * Event used to request snapshot of events
 */
export class ObserverSnapshowQuery extends CoreEvent {

  public constructor(sourceInfo: MicroFrontendInfo) {
    super();

    this.SourceId = sourceInfo.SourceId;
    this.SourceName = sourceInfo.SourceName;
    this.EventId = EventIds.ObserverSnapshotQuery;
  }
}
