import { CoreEvent } from '../CoreEvent';
import { EventIds } from '../EventIds';

/**
 * Language change event model (DEMO)
 */
export class LanguageChange extends CoreEvent {
    /**
     * Creates an instance of language change.
     * @param NewLanguage new language
     */
    public constructor(
        public NewLanguage: string
    ) {
      super();
      this.EventId = EventIds.LanguageChange;
    }
}
