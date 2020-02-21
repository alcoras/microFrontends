import { uEventsIds, uEvent } from '../models/event';

export class EventSubscibeToEvent extends uEvent
{
  EventId = uEventsIds.SubscribeToEvent;

  constructor(
    public IdsTripleList:any[][],
    public CleanSubscriptionList:boolean = false) 
  {
    super();
  }
}