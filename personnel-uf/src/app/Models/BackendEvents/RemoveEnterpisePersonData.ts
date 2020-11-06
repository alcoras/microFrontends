import { CoreEvent, EventIds } from 'event-proxy-lib-src';

/**
 * Remove enterpise person data event
 */
export class RemoveEnterpisePersonData extends CoreEvent {

  /**
   * @param sourceId source id
   * @param PersonDataID personda data id to remove
   */
  public constructor(sourceId: string, public PersonDataID: number) {
    super();
    this.SourceId = sourceId;
    this.EventId = EventIds.RemovePersonData;
  }
}
