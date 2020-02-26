import { uEventsIds, uEvent } from '../models/event';

export class LoadedScript extends uEvent
{
    EventId = uEventsIds.LoadedScript;

    constructor(
        public scriptEventId: number,
        public scriptUrl: string
    )
    { super(); }
}