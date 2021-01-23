import { CoreEvent } from "../CoreEvent";
import { EventIds } from "../EventIds";
import { MicroFrontendInfo } from "../MicroFrontendInfo";

/**
 * Event for reading MaterialsReceipts Scan table
 */
export class WunderMobilityProductQuery extends CoreEvent {

  public constructor(
    sourceInfo: MicroFrontendInfo,
    public ProductCodeList?: string[]) {

      super();
      this.SourceId = sourceInfo.SourceId;
      this.SourceName = sourceInfo.SourceName;
      this.EventId = EventIds.TestWunderMobilityProductsQuery;
  }
}
