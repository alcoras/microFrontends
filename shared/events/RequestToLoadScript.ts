import { uEventsIds, uEvent } from '../models/event';
import { ResourceSheme } from './helpers/ResourceSheme';

export class RequestToLoadScripts extends uEvent
{
    EventId = uEventsIds.RequestToLoadScript;

    constructor(
        public RequestEventId: number,
        public ResourceSchemes: ResourceSheme[]
    )
    { super(); }
}