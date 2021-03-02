import { CoreEvent } from "../CoreEvent";
import { EventIds } from "../EventIds";
import { MicroFrontendInfo } from "../MicroFrontendInfo";

/**
 * Event for reading Materials by providing list of ids
 */
export class MaterialsReceiptsMaterialsQueryListIds extends CoreEvent {

  public constructor(sourceInfo: MicroFrontendInfo, public Ids?: number[]) {
      super();

      this.SourceId = sourceInfo.SourceId;
      this.SourceName = sourceInfo.SourceName;
      this.EventId = EventIds.MaterialsReceiptsMaterialsQueryListIds;
  }
}
