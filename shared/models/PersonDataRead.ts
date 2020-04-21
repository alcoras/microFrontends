import { IPersonnel } from './Interfaces/IPersonnel';
import { uEvent } from './event';

/**
 * Event for reading Person Data
 */
export class PersonDataRead extends uEvent {
  /**
   * List output enterprise person data
   */
  public ListOutputEnterprisePersonData: IPersonnel[];

  /**
   * Parent source event unique id - matches id
   * one receives when ReadPersonDataQuery event is sent
   */
  public ParentSourceEventUniqueId: number;

  /**
   * Total number of entries for PersonData
   */
  public CommonNumberRecords: number;
}
