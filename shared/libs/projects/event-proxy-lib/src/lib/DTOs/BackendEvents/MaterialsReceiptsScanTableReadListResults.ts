import { CoreEvent } from "../CoreEvent";
import { ScanTableData } from "./Adds/ScanTableData";

export class MaterialsReceiptsScanTableReadListResults extends CoreEvent {

  /**
   * List of data records
   */
  public ScanTableDataList: ScanTableData[];

  /**
   * Total number of entries in MaterialsReceipts
   */
  public TotalRecordsAmount: number;
}
