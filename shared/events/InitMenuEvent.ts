import { uEventsIds, uEvent } from '../models/event';

/**
 * Initialize menu event
 */
export class InitMenuEvent extends uEvent {
  constructor(sourceId: string) {
    super();
    this.EventId = uEventsIds.InitMenu;
    this.SourceId = sourceId;
  }
}
