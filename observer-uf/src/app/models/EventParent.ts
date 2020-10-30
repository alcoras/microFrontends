import { EventDataForTracing } from "./EventDataForTracing";

export class EventParent {
  public ParentEventData: EventDataForTracing;
  public ChildrenEventData: EventDataForTracing[];
}
