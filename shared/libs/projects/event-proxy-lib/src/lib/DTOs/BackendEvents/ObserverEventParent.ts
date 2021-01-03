import { EventDataForTracing } from "./Adds/ObserverEventDataForTracing";

export class EventParent {
  public ParentEventData: EventDataForTracing;
  public ChildrenEventData: EventDataForTracing[];
}
