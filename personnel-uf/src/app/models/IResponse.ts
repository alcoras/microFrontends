import { IPersonnel } from '@uf-shared-models/index';

export interface IResponse {
  items: IPersonnel[];
  total: number;
}
