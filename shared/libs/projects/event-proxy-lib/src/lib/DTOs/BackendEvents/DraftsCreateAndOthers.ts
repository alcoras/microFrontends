import { CoreEvent } from "../CoreEvent";
import { EventIds } from "../EventIds";
import { MicroFrontendInfo } from "../MicroFrontendInfo";

export enum DraftsEventFlags {
    Create = EventIds.DraftsCreate,
    Get = EventIds.DraftsGet,
    Update = EventIds.DraftsUpdate
}

/**
 * Event to work with drafts
 */
export class DraftsCreateAndOthers extends CoreEvent {

    /**
     * Constructor
     * @param sourceInfo source information
     * @param eventFlag flag to indicate type of event
     * @param KeyString a unique key string to find draft (for update/get/create)
     * @param Draft draft"s body in json (for update/create)
     * @param UpdateId provide if we want to update existing draft
     */
    public constructor(sourceInfo: MicroFrontendInfo, eventFlag: DraftsEventFlags, public KeyString: string, public Draft?: string, public UpdateId?: number) {
        super();

        this.SourceName = sourceInfo.SourceName;
        this.SourceId = sourceInfo.SourceId;
        this.EventId = eventFlag;
    }
}
