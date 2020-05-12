import { uEvent } from '../models/event';
import { ButtonIds } from './helpers/ButtonIds';

// TODO: remove ButtonPressedEventId as field
/**
 * Event button pressed event model used for all buttons which are supposed to
 * reach other micro frontends
 */
export class EventButtonPressed extends uEvent {
    public constructor(
        public ButtonPressedEventId: number,
        public UniqueElementId: string
    ) {
        super();
        if ((Object as any).values(ButtonIds).includes(ButtonPressedEventId)) {
          this.EventId = ButtonPressedEventId;
        } else {
          throw new Error('Provided ButtonPressed Id is unsupported.');
        }
    }
}
