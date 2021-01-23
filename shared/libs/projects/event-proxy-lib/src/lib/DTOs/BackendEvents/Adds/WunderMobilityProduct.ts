export class WunderMobilityProduct {

  /**
   * Product's internal id
   */
  public Id: number;

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
}
