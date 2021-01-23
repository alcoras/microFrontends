import { CoreEvent } from "../CoreEvent";
import { EventIds } from "../EventIds";
import { MicroFrontendInfo } from "../MicroFrontendInfo";
import { WunderMobilityProduct } from "./Adds/WunderMobilityProduct";

/**
 * Backend event to create/update occupation entry
 */
export class WunderMobilityProductCreate extends CoreEvent {

  /**
   * Product code to identify product after scan (could be qr or barcode)
   */
  public ProductCode: string;

  /**
   * Product Name
   */
  public Name: string;

  /**
   * Product price
   */
  public Price: number;

  /**
   * Minimum quantity to apply promotional price
   */
  public PromotionalQuantity: number;

  /**
   * Price if buy promotional quantity or more
   */
  public PromotionalPrice: number;

  public constructor(
    sourceInfo: MicroFrontendInfo,
    data: WunderMobilityProduct) {
    super();
    this.SourceId = sourceInfo.SourceId;
    this.SourceName = sourceInfo.SourceName;
    this.EventId = EventIds.TestWunderMobilityCreate;

    this.ProductCode = data.ProductCode;
    this.Name = data.Name;
    this.Price = data.Price;
    this.PromotionalQuantity = data.PromotionalQuantity;
    this.PromotionalPrice = data.PromotionalPrice;
  }
}
