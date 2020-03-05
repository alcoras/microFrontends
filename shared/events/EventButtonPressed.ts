import { uEvent } from "../models/event";
import { ButtonIds } from "./helpers/ButtonIds";

// TODO: remove ButtonPressedEventId as field
export class EventButtonPressed extends uEvent {
    constructor(
        public ButtonPressedEventId: number,
        public UniqueElementId: string
    ) {
        super(); 
        if ((<any>Object).values(ButtonIds).includes(ButtonPressedEventId)) {
            this.EventId = ButtonPressedEventId;
        } else {
            throw new Error("Provided ButtonPressed Id is unsupported.")
        }
    }
}