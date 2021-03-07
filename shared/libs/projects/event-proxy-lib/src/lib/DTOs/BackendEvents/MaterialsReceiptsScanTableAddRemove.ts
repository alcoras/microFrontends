import { CoreEvent } from "../CoreEvent";
import { EventIds } from "../EventIds";
import { MicroFrontendInfo } from "../MicroFrontendInfo";
import { ScanTableData } from "./Adds/ScanTableData";

/**
 * Enum to indicate whether event is of type update or craete
 */
export enum MaterialsReceiptsScanTableAddRemoveFlag {
  Create = EventIds.MaterialsReceiptsScanTableAdd,
  Delete = EventIds.MaterialsReceiptsScanTableRemove
}

export class MaterialsReceiptsScanTableAddRemove extends CoreEvent {

  /** Scan Table Id */
  public Id?: number;
  /** Reference to Materials by Id */
  public MaterialsId?: number;
  /** Reference to MaterialsReceiptsList by Id*/
  public MaterialsReceiptsListId?: number;

  /** Reference to MaterialsReceiptsTable by Id */
  public MaterialsReceiptsTableId?: number;

  public Quantity?: number;
  public Unit?: string;
  public BarCode?: string;

  public constructor(sourceInfo: MicroFrontendInfo, scanTableData: ScanTableData, addRemoveFlag: MaterialsReceiptsScanTableAddRemoveFlag) {

      super();

      this.Id = scanTableData.Id;
      this.MaterialsId = scanTableData.MaterialsId;
      this.MaterialsReceiptsListId = scanTableData.MaterialsReceiptsListId;
      this.MaterialsReceiptsTableId = scanTableData.MaterialsReceiptsTableId;
      this.Quantity = scanTableData.Quantity;
      this.Unit = scanTableData.Unit;

      this.SourceId = sourceInfo.SourceId;
      this.SourceName = sourceInfo.SourceName;
      this.EventId = addRemoveFlag;
  }
}
