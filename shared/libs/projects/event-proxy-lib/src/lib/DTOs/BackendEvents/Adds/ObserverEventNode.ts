import { ObserverEventDataForTracing } from './ObserverEventDataForTracing';

export class ObserverEventNode {
  public Id: number;
  public EventData: ObserverEventDataForTracing;
  public Children: ObserverEventNode[];
}
