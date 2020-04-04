import { uEvent, uEventsIds } from '../../models/event';

export class ReadPersonDataQuery extends uEvent {
  constructor(
    public Sort: string,
    public Order: string,
    public Page: number,
    public Limit: number
  ) {
    super();
    this.EventId = uEventsIds.ReadPersonDataQuery;
  }
}
