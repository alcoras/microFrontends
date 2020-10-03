import { PersonData } from '../PersonData';
/**
 * Response for Get
 */
export interface PersonDataDTO {
  /**
   * List of Personnel
   */
  items: PersonData[];
  /**
   * Total amaount of entries
   */
  total: number;
}
