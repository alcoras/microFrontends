import { uEvent, uEventsIds } from '../../models/event';

/**
 * Remove enterpise person data event
 */
export class RemoveEnterpisePersonData extends uEvent {

  constructor(sourceId: string, public PersonDataID: number) {
    super();
    this.SourceId = sourceId;
    this.EventId = uEventsIds.RemovePersonData;
  }
}
