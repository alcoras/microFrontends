import { CoreEvent } from "../CoreEvent";
import { PersonData } from "./Adds/PersonData";

/**
 * Event for reading Person Data
 */
export class PersonDataRead extends CoreEvent {
  /**
   * List output enterprise person data
   */
  public ListOutputEnterprisePersonData: PersonData[];

  /**
   * Total number of entries of PersonData
   */
  public CommonNumberRecords: number;
}
