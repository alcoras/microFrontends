import { MaterialsList } from '../MaterialsList';

/**
 * Response for Get
 */
export class MaterialsListDTO {
  /**
   * List of MaterialsReceipts
   */
  public Items: MaterialsList[];

  /**
   * Total amount of entries
   */
  public Total: number;
}
