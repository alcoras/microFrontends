import { OccupationData } from '../OccupationData';

/**
 * Response for Get
 */
export interface OccupationDataDTO {
  /**
   * List of OccupationData
   */
  items: OccupationData[];
  /**
   * Total amount of entries
   */
  total: number;
}
