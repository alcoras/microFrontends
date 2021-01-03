import { CoreEvent } from "../CoreEvent";
import { EventIds } from "../EventIds";
import { MicroFrontendInfo } from "../MicroFrontendInfo";

export class MaterialsReceiptsMaterialsAtLocationsReadListQuery extends CoreEvent {


  public constructor(
    sourceInfo: MicroFrontendInfo,
    public MaterialsId?: number,
    public LocationId?: number,
    public Page?: number,
    public Limit?: number) {

      super();

      this.SourceId = sourceInfo.SourceId;
      this.SourceName = sourceInfo.SourceName;
      this.EventId = EventIds.MaterialsReceiptsMaterialsAtLocationsReadListQuery;
  }
}
