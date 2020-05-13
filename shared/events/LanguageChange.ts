import { uEventsIds, uEvent } from '../models/event';

/**
 * Language change event model (DEMO)
 */
export class LanguageChange extends uEvent {
    /**
     * Creates an instance of language change.
     * @param NewLanguage new language
     */
    public constructor(
        public NewLanguage: string
    ) {
      super();
      this.EventId = uEventsIds.LanguageChange;
    }
}
