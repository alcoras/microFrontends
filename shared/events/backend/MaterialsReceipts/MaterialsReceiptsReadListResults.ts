import { MaterialsList } from '../../../models/MaterialReceipts/MaterialsList';
import { uEvent } from '../../../models/event';

export class MaterialsReceiptsReadListResults extends uEvent {
  /**
   * List of data records
   */
  public MaterialsDataList: MaterialsList[];

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
