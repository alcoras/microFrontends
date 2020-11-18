import { CoreEvent, EventIds, MicroFrontendInfo } from 'event-proxy-lib-src';
import { ScanTableData } from '../ScanTableData';

/**
 * Enum to indicate whether event is of type update or craete
 */
export enum MaterialsReceiptsScanTableAddRemoveFlag {
  Create = EventIds.MaterialsReceiptsScanTableAdd,
  Delete = EventIds.MaterialsReceiptsScanTableRemove
}

export class MaterialsReceiptsScanTableAddRemove extends CoreEvent {

  /**
   * Reference to Materials by Id
   */
  public MaterialsId?: number;

  /**
   * Reference to MaterialsReceiptsList by Id
   */
  public MaterialsReceiptsListId?: number;

  /**
   * Reference to MaterialsReceiptsTable by Id
   */
  public MaterialsReceiptsTableId?: number;

  public Quantity?: number;
  public Unit?: string;

  public constructor(
    sourceInfo: MicroFrontendInfo,
    scanTableData: ScanTableData,
    addRemoveFlag: MaterialsReceiptsScanTableAddRemoveFlag) {

      super();

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
