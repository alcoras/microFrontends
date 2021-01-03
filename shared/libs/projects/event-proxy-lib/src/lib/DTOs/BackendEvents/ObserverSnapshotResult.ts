import { CoreEvent } from "../CoreEvent";
import { EventDataForTracing } from "./Adds/ObserverEventDataForTracing";
import { EventParent } from "./ObserverEventParent";

/**
 * Response for ObserverSnapshotQuery event
 */
export class ObserverSnapshotResult extends CoreEvent {

  public EventParentList: EventParent[];
  public EventParentlessList: EventDataForTracing[];

  public TotalEventParentListRecords: number;
  public TotalEventParentLessListrecords: number;
}
