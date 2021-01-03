import { CoreEvent } from "../CoreEvent";
import { ScanTableData } from "./Adds/ScanTableData";

export class MaterialsReceiptsScanTableReadListResults extends CoreEvent {

  /**
   * List of data records
   */
  public ScanTableDataList: ScanTableData[];

  /**
   * Parent source event unique id - matches id
   * one receives when MaterialsReceiptsReadListQuery event is sent
   */
  public ParentSourceEventUniqueId: number;

  /**
   * Total number of entries in MaterialsReceipts
   */
  public TotalRecordsAmount: number;
}
