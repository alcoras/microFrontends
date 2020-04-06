import { IPersonnel } from '@uf-shared-models/index';

/**
 * Reponse for temp backend
 * // TODO: remove later
 */
export interface IResponse {
  items: IPersonnel[];
  total: number;
}
