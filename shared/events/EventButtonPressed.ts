import { uEvent } from '../models/event';
import { ButtonIds } from './helpers/ButtonIds';

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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((Object as any).values(ButtonIds).includes(buttonPressedEventId)) {
          this.EventId = buttonPressedEventId;
        } else {
          throw new Error('Provided ButtonPressed Id is unsupported.');
        }
    }
}
