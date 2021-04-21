import { CoreEvent } from "../index";

/**
 * General event to backend
 */
export class FrontendToBackendEvent {
  public EventId: number;
  public SourceId?: string;
  public SourceName?: string;
  public Ids?: number[];
  public MarkAllReceived?: boolean;
  public Events?: CoreEvent[];
}
