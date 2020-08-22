import { MaterialsList } from '@uf-shared-models/index';

/**
 * Response for Get
 */
export class GetMaterialsList {
  /**
   * List of MaterialsReceipts
   */
  public Items: MaterialsList[];

  /**
   * Total amount of entries
   */
  public Total: number;
}
