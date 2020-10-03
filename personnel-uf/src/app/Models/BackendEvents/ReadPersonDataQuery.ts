import { CoreEvent, EventIds } from 'event-proxy-lib-src'
;

/**
 * Read person data query model
 */
export class ReadPersonDataQuery extends CoreEvent {

  /**
   *
   * @param ListParametersNameForSorting (Multi)sorting query ('field1', 'field2') for
   * descending add - to the end of field ('field1', 'field2-')
   * @param NumberPageOutput Page
   * @param NumberRecordsOnPage Limit
   *
   * Examples:
   */

  /**
   * Creates an instance of read person data query
   * @param sourceId source id
   * @param ListParametersNameForSorting (Multi)sorting query ('field1', 'field2') for
   * descending add - to the end of field ('field1', 'field2-')
   * @param NumberPageOutput page to show
   * @param NumberRecordsOnPage limit of entries
   */
  public constructor(
    sourceId: string,
    public ListParametersNameForSorting: string[],
    public NumberPageOutput: number,
    public NumberRecordsOnPage: number
  ) {
    super();
    this.SourceId = sourceId;
    this.EventId = EventIds.ReadPersonDataQuery;
  }
}
