import { CoreEvent } from "../CoreEvent";
import { OccupationData } from "./Adds/OccupationData";

/**
 * Event for reading query results
 */
export class OccupationsReadResults extends CoreEvent {

  /**
   * List of Occupation entries
   */
  public OccupationDataList: OccupationData[];

  /**
   * Parent source event unique id - matches id
   * one receives when OccupationsReadQuery event is sent
   */
  public ParentSourceEventUniqueId: number;

  /**
   * Total number of entries of Occupations
   */
  public TotalRecordsAmount: number;
}
