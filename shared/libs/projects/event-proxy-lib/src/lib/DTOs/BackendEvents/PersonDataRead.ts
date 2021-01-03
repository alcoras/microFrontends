import { CoreEvent } from '../CoreEvent';
import { PersonData } from './Adds/PersonData';

/**
 * Event for reading Person Data
 */
export class PersonDataRead extends CoreEvent {
  /**
   * List output enterprise person data
   */
  public ListOutputEnterprisePersonData: PersonData[];

  /**
   * Parent source event unique id - matches id
   * one receives when ReadPersonDataQuery event is sent
   */
  public ParentSourceEventUniqueId: number;

  /**
   * Total number of entries of PersonData
   */
  public CommonNumberRecords: number;
}
