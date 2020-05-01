import { uEventsIds, uEvent } from '../../../models/event';
/**
 * Event to delete occupation entry
 */
export class OccupationsDeleteEvent extends uEvent {
  /**
   * @param ObjectAggregateId Occupation id to delete
   */
  constructor(sourceId: string, public ObjectAggregateId: number) {
    super();
    this.SourceId = sourceId;
    this.EventId = uEventsIds.OccupationsDelete;
  }
}
