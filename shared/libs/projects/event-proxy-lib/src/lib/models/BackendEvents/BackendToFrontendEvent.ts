import { CoreEvent } from '../index';


export class BackendToFrontendEvent {
  /* Every response has event id */
  public EventId: number;

  /* Ids of events sent to ApiGateway */
  public Ids?: number[];

  /* Events received from ApiGateway */
  public Events?: CoreEvent[];
}
