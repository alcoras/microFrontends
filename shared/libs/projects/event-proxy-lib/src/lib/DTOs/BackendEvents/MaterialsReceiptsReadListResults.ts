import { CoreEvent } from "../CoreEvent";
import { MaterialsList } from "./Adds/MaterialsList";

export class MaterialsReceiptsReadListResults extends CoreEvent {
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
