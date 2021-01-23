import { CoreEvent } from "../CoreEvent";
import { WunderMobilityProduct } from "./Adds/WunderMobilityProduct";

export class WunderMobilityProductQueryResults extends CoreEvent {
  /**
   * List of data records
   */
  public DataList: WunderMobilityProduct[];

  /**
   * Total number of entries in MaterialsReceipts
   */
  public TotalRecordsAmount: number;
}
