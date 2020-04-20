import { uEvent, uEventsIds } from '../../models/event';

/**
 * Read person data query model
 */
export class ReadPersonDataQuery extends uEvent {

  /**
   * Creates an instance of read person data query
   * @param ListParametersNameForSorting (Multi)sorting query ('field1', 'field2') for
   * descending add - to the end of field ('field1', 'field2-')
   * @param NumberPageOutput Page
   * @param NumberRecordsOnPage Limit
   *
   * Examples:
   */
  constructor(
    sourceId: string,
    public ListParametersNameForSorting: string[],
    public NumberPageOutput: number,
    public NumberRecordsOnPage: number
  ) {
    super();
    this.SourceId = sourceId;
    this.EventId = uEventsIds.ReadPersonDataQuery;
  }
}
