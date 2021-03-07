import { CoreEvent } from "../CoreEvent";
import { DraftData } from "./Adds/DraftData";

/**
 * Event response for Drafts get
 */
export class DraftsCreateAndOthersResults extends CoreEvent {
    /** List of json drafts with ids */
    public DraftDataList: DraftData[];
}