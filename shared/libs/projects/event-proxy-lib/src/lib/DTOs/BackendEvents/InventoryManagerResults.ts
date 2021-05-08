import { CoreEvent } from "../CoreEvent";
import { InventoryManagerResult } from "./Adds/InventoryManagerResult";

export class InventoryManagerResults extends CoreEvent {

  /**
   * List of data records
   */
  public ResultList: InventoryManagerResult[];

  /**
   * Total number of entries in MaterialsReceipts
   */
  public TotalRecordsAmount: number;
}
