import { CoreEvent } from "event-proxy-lib-src";
import { EventDataForTracing } from "../EventDataForTracing";

/**
 * Response for Get
 */
export class ObserverSnapshotResultDTO extends CoreEvent {

  public EventParentList: EventDataForTracing[];
  public EventParentlessList: EventDataForTracing[];

  public ParentSourceEventUniqueId: number;

  public TotalEventParentListRecords: number;
  public TotalEventParentLessListrecords: number;
}
