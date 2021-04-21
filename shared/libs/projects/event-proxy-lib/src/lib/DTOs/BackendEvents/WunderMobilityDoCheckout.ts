import { CoreEvent } from "../CoreEvent";
import { EventIds } from "../EventIds";
import { MicroFrontendInfo } from "../MicroFrontendInfo";
import { WunderMobilityScannedProduct } from "./Adds/WunderMobilityScannedProduct";

/**
 * Event for reading MaterialsReceipts Scan table
 */
export class WunderMobilityDoCheckout extends CoreEvent {

  public constructor(
    sourceInfo: MicroFrontendInfo,
    public ProductCodeList: WunderMobilityScannedProduct[]) {

      super();
      this.SourceId = sourceInfo.SourceId;
      this.SourceName = sourceInfo.SourceName;
      this.EventId = EventIds.TestWunderMobilityCheckout;
  }
}
