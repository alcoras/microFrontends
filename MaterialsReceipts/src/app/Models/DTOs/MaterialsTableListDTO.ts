import { MaterialsListTablePart } from '../MaterialsListTablePart';

/**
 * Response for Get
 */
export class MaterialsTableListDTO {
  /**
   * List of MaterialsReceipts
   */
  public Items: MaterialsListTablePart[];

  /**
   * Total amount of entries
   */
  public Total: number;
}
