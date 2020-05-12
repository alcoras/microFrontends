import { OccupationData } from '@uf-shared-models/index';
/**
 * Response for Get
 */
export interface IGetResponse {
  /**
   * List of OccupationData
   */
  items: OccupationData[];
  /**
   * Total amount of entries
   */
  total: number;
}
