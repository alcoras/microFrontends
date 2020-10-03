import { CoreEvent } from 'event-proxy-lib-src'
;
import { MaterialsListTablePart } from '../MaterialsListTablePart';

export class MaterialsReceiptsTablePartReadListResults extends CoreEvent {
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
