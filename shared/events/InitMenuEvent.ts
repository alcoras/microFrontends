import { uEventsIds, uEvent } from '../models/event';

/**
 * Initialize menu event
 */
export class InitMenuEvent extends uEvent {
  public constructor(sourceId: string) {
    super();
    this.EventId = uEventsIds.InitMenu;
    this.SourceId = sourceId;
  }
}
