import { CoreEvent } from 'event-proxy-lib-src';
import { ScanTableData } from '../ScanTableData';

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
