import { uEventsIds, uEvent } from '../models/event';

export class SubscibeToEvent extends uEvent
{
  EventId = uEventsIds.SubscribeToEvent;

  constructor(
    public IdsTripleList:any[][],
    public CleanSubscriptionList:boolean = false) 
  { super(); }
}