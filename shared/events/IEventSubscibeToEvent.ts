import { IEvent } from '../models/event';

export interface IEventSubscibeToEvent extends IEvent
{
  SubscribeToEventId: number
  // which micro frontend is requesting subscription
}
