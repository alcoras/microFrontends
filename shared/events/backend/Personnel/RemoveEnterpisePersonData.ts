import { uEvent, uEventsIds } from '../../../models/event';

/**
 * Remove enterpise person data event
 */
export class RemoveEnterpisePersonData extends uEvent {

  /**
   * @param sourceId source id
   * @param PersonDataID personda data id to remove
   */
  public constructor(sourceId: string, public PersonDataID: number) {
    super();
    this.SourceId = sourceId;
    this.EventId = uEventsIds.RemovePersonData;
  }
}
