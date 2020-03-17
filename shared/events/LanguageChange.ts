import { uEventsIds, uEvent } from '../models/event';

/**
 * Language change event model
 * @field NewLanguage new language (en, lt..)
 */
export class LanguageChange extends uEvent {
    /**
     * Creates an instance of language change.
     * @param NewLanguage new language
     */
    constructor(
        public NewLanguage: string
    ) {
      super();
      this.EventId = uEventsIds.LanguageChange;
    }
}
