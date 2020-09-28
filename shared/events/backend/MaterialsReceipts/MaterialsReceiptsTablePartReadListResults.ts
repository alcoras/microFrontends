import { MaterialsListTablePart } from '../../../models/MaterialReceipts/MaterialsListTablePart';
import { uEvent } from '../../../models/event';

export class MaterialsReceiptsTablePartReadListResults extends uEvent {
  /**
   * List of data records
   */
  public MaterialsDataTablePartList: MaterialsListTablePart[];

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
