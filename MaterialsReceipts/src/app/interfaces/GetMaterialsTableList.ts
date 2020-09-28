import { MaterialsListTablePart } from '@uf-shared-models/index';

/**
 * Response for Get
 */
export class GetMaterialsTableList {
  /**
   * List of MaterialsReceipts
   */
  public Items: MaterialsListTablePart[];

  /**
   * Total amount of entries
   */
  public Total: number;
}
