import { CoreEvent } from "../CoreEvent";
import { EventIds } from "../EventIds";
/**
 * Event to delete occupation entry
 */
export class OccupationsDeleteEvent extends CoreEvent {

  /**
   *
   * @param sourceId source id
   * @param ObjectAggregateId Occupation id to delete
   */
  public constructor(sourceId: string, public ObjectAggregateId: number) {
    super();
    this.SourceId = sourceId;
    this.EventId = EventIds.OccupationsDelete;
  }
}
