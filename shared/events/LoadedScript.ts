import { uEventsIds, uEvent } from '../models/event';
import { ResourceSheme } from './RequestToLoadScript';

export class LoadedResource extends uEvent
{
    EventId = uEventsIds.LoadedResource;

    constructor(
        public ResourceEventId: number,
        public ResourceScheme: ResourceSheme
    )
    { super(); }
}