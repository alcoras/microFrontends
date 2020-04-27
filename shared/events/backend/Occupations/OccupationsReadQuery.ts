import { uEventsIds, uEvent } from '../../../models/event';

/**
 * Event for reading Occupation entries
 */
export class OccupationsReadQuery extends uEvent {
  constructor(
    sourceId: string,
    public DateTimeValue: string,
    public Page: number,
    public Limit: number
  ) {
    super();
    this.SourceId = sourceId;
    this.EventId = uEventsIds.OccupationsReadQuery;
  }
}
