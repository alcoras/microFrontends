import { CoreEvent } from "../CoreEvent";
import { EventIds } from "../EventIds";
import { MicroFrontendInfo } from "../MicroFrontendInfo";

/**
 * Event to delete drafts
 */
export class DraftsDelete extends CoreEvent {

    /**
     * 
     * @param sourceInfo source information
     * @param Ids list of ids we want to delete
     */
    public constructor(sourceInfo: MicroFrontendInfo, public Ids: number[]) {
        super();

        this.SourceName = sourceInfo.SourceName;
        this.SourceId = sourceInfo.SourceId;
        this.EventId = EventIds.DraftsDelete;
    }
}