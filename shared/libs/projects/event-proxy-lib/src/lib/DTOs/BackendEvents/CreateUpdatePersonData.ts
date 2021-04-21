import { CoreEvent } from "../CoreEvent";
import { EventIds } from "../EventIds";
import { PersonData } from "./Adds/PersonData";

/**
 * Enum to indicate whether event is of type update or craete
 */
export enum PersonDataCreateUpdateFlag {
  Create = EventIds.CreatePersonData,
  Update = EventIds.UpdatePersonData
}

/**
 * Backend event to create/update occupation entry
 */
export class CreateUpdatePersonData extends CoreEvent {

  public PersonDataID: number;
  public DateValue: string;
  public DocReestratorID: number;
  public Oklad: number;
  public Stavka: number;
  public PIP: string;
  public KodDRFO: string;
  public DataPriyomu: string;
  public Posada: number;
  public PodatkovaPilga: number;

  /**
   *
   * @param sourceId source id
   * @param createUpdateFlag create/update flag
   * @param Personnel personnel data
   */
  public constructor(
    sourceId: string,
    createUpdateFlag: PersonDataCreateUpdateFlag,
    Personnel: PersonData) {
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
