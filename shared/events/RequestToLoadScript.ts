import { uEventsIds, uEvent } from '../models/event';

export class RequestToLoadScripts extends uEvent
{
    EventId = uEventsIds.RequestToLoadScript;

    constructor(
        public requestEventId: number,
        public UrlList: string[]
    )
    { super(); }
}