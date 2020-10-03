import { CoreEvent, EventIds } from 'event-proxy-lib-src';

/**
 * Event for reading Occupation entries
 */
export class OccupationsReadQuery extends CoreEvent {

  /**
   * Creates instance
   * @param sourceId source Id
   * @param DateTimeValue data time value (in DEMO just current time in ISO)
   * @param Page page to view
   * @param Limit entries's limit
   */
  public constructor(
    sourceId: string,
    public DateTimeValue: string,
    public Page: number,
    public Limit: number
  ) {
    super();
    if (Page <= 0 || Limit <= 0)
      throw new Error('Page or Limit cannot be 0 or below');

    this.SourceId = sourceId;
    this.EventId = EventIds.OccupationsReadQuery;
  }
}
