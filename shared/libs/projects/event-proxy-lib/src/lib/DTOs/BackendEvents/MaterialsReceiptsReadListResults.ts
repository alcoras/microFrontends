import { CoreEvent } from "../CoreEvent";
import { MaterialsList } from "./Adds/MaterialsList";

export class MaterialsReceiptsReadListResults extends CoreEvent {
  /**
   * List of data records
   */
  public MaterialsDataList: MaterialsList[];

  /**
   * Total number of entries in MaterialsReceipts
   */
  public TotalRecordsAmount: number;
}
