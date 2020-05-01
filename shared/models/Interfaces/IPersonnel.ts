/**
 * Personnel interface for PersonData microservice
 */
export interface IPersonnel {
  /**
   * Id
   */
  PersonDataID: number;

  /**
   * Date of parameter's setting
   */
  DateValue: string;

  /**
   * ID of parent document
   */
  DocReestratorID: number;

  /**
   * Salary
   */
  Oklad: number;

  /**
   * Salary
   */
  Stavka: number;

  /**
   * Family name
   */
  PIP: string;

  /**
   * ?
   */
  KodDRFO: string;

  /**
   * Registration date
   */
  DataPriyomu: string;

  /**
   * ?
   */
  Posada: number;

  /**
   * ?
   */
  PodatkovaPilga: number;
}
