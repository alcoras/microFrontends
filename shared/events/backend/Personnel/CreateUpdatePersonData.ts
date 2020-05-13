import { IPersonnel } from '../../../models/Interfaces/IPersonnel';
import { uEventsIds, uEvent } from '../../../models/event';

/**
 * Enum to indicate whether event is of type update or craete
 */
export enum PersonDataCreateUpdateFlag {
  Create = uEventsIds.CreatePersonData,
  Update = uEventsIds.UpdatePersonData
}

/**
 * Backend event to create/update occupation entry
 */
export class CreateUpdatePersonData extends uEvent implements IPersonnel {

  // tslint:disable
  /** @inheritdoc */
  public PersonDataID: number;
  /** @inheritdoc */
  public DateValue: string;
  /** @inheritdoc */
  public DocReestratorID: number;
  /** @inheritdoc */
  public Oklad: number;
  /** @inheritdoc */
  public Stavka: number;
  /** @inheritdoc */
  public PIP: string;
  /** @inheritdoc */
  public KodDRFO: string;
  /** @inheritdoc */
  public DataPriyomu: string;
  /** @inheritdoc */
  public Posada: number;
  /** @inheritdoc */
  public PodatkovaPilga: number;
  // tslint:enable

  /**
   *
   * @param sourceId source id
   * @param createUpdateFlag create/update flag
   * @param Personnel personnel data
   */
  public constructor(
    sourceId: string,
    createUpdateFlag: PersonDataCreateUpdateFlag,
    Personnel: IPersonnel) {
    super();
    this.EventId = createUpdateFlag;
    this.SourceId = sourceId;

    this.PersonDataID = Personnel.PersonDataID;
    this.DateValue = Personnel.DateValue;
    this.DocReestratorID = Personnel.DocReestratorID;
    this.Oklad = Personnel.Oklad;
    this.Stavka = Personnel.Stavka;
    this.PIP = Personnel.PIP;
    this.KodDRFO = Personnel.KodDRFO;
    this.DataPriyomu = Personnel.DataPriyomu;
    this.Posada = Personnel.Posada;
    this.PodatkovaPilga = Personnel.PodatkovaPilga;
  }

}
