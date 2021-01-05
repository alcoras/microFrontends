import { CoreEvent } from "../CoreEvent";
import { ObserverEventNode } from "./Adds/ObserverEventNode";

/**
 * Response for ObserverSnapshotQuery event
 */
export class ObserverSnapshotResult extends CoreEvent {
  public EventNode: ObserverEventNode;
  public TotalRecords: number;
}
