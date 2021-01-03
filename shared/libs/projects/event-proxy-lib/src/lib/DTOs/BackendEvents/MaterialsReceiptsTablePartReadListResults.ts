import { CoreEvent } from "../CoreEvent";
import { MaterialsListTablePart } from "./Adds/MaterialsListTablePart";

export class MaterialsReceiptsTablePartReadListResults extends CoreEvent {
  /**
   * List of data records
   */
  public MaterialsDataTablePartList: MaterialsListTablePart[];

  /**
   * Total number of entries in MaterialsReceipts
   */
  public TotalRecordsAmount: number;
}
