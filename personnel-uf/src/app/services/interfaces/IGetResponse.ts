import { IPersonnel } from '@uf-shared-models/index';
/**
 * Response for Get
 */
export interface IGetResponse {
  /**
   * List of Personnel
   */
  items: IPersonnel[];
  /**
   * Total amaount of entries
   */
  total: number;
}
