import { IEvent } from '../models/event';

export interface IEventSubscibeToEvent extends IEvent
{
  // which event we're subscribing to
  SubscribeToEventId: number
}
