import { CoreEvent } from '../index';


export class FrontendToBackendEvent {
  public EventId: number;
  public SourceId?: string;
  public Ids?: number[];
  public MarkAllReceived?: boolean;
  public Events?: CoreEvent[];
}
