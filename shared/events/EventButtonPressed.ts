import { uEvent } from '../models/event';

/**
 * Event button pressed event model used for all buttons which are supposed to
 * reach other micro frontends
 */
export class EventButtonPressed extends uEvent {
    public constructor(
        buttonPressedEventId: number,
        public UniqueElementId: string
    ) {
        super();
        this.EventId = buttonPressedEventId;
    }
}
