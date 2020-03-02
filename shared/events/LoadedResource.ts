import { uEventsIds, uEvent } from '../models/event';
import { ResourceSheme } from "./helpers/ResourceSheme";

export class LoadedResource extends uEvent
{
    EventId = uEventsIds.LoadedResource;

    constructor(
        public ResourceEventId: number,
        public ResourceScheme: ResourceSheme
    )
    { super(); }
}