import { CoreEvent } from "../CoreEvent";
import { EventIds } from "../EventIds";

/**
 * Initialize menu event
 */
export class InitializeMenuEvent extends CoreEvent {
  public constructor(sourceId: string) {
    super();
    this.EventId = EventIds.InitMenu;
    this.SourceId = sourceId;
  }
}
