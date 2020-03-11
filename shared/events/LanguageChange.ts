import { uEventsIds, uEvent } from '../models/event';

/**
 * Language change event model
 * @field NewLanguage new language (en, lt..)
 */
export class LanguageChange extends uEvent {
    EventId = uEventsIds.LanguageChange;

    /**
     * Creates an instance of language change.
     * @param NewLanguage new language
     */
    constructor(
        public NewLanguage: string
    )
    { super(); }
}