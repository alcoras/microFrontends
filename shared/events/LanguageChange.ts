import { uEventsIds, uEvent } from '../models/event';

export class LanguageChange extends uEvent
{
    EventId = uEventsIds.LanguageChange;

    constructor(
        public NewLanguage: string
    )
    { super(); }
}