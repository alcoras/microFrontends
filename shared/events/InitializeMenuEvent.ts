import { uEventsIds, uEvent } from '../models/event';

/**
 * Initialize menu event
 */
export class InitializeMenuEvent extends uEvent {
  public constructor(sourceId: string) {
    super();
    this.EventId = uEventsIds.InitMenu;
    this.SourceId = sourceId;
  }
}
