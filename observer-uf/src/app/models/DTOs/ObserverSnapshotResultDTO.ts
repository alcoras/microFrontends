import { CoreEvent } from "event-proxy-lib-src";
import { EventDataForTracing } from "../EventDataForTracing";
import { EventParent } from "../EventParent";

/**
 * Response for ObserverSnapshotQuery event
 */
export class ObserverSnapshotResultDTO extends CoreEvent {

  public EventParentList: EventParent[];
  public EventParentlessList: EventDataForTracing[];

  public TotalEventParentListRecords: number;
  public TotalEventParentLessListrecords: number;
}
