import { uEventsIds, uEvent } from '../models/event';

export class EventSubscibeToEvent extends uEvent
{
  EventId = uEventsIds.SubscribeToEvent;

  constructor(public SubscribeToEventId: number) 
  {
    super();
  }
}