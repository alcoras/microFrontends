export class ScanTableData {
  /** Scan table Id */
  public Id?: number;
  /** Reference to Materials by Id */
  public MaterialsId?: number;

  /** Reference to MaterialsReceiptsList by Id */
  public MaterialsReceiptsListId?: number;

  /** Reference to MaterialsReceiptsTable by Id */
  public MaterialsReceiptsTableId?: number;

  public Quantity?: number;
  public Unit?: string;
}
