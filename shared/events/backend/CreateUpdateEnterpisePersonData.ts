import { IPersonnel } from '../../models/Interfaces/IPersonnel';
import { uEventsIds, uEvent } from '../../models/event';

export class CreateUpdateEnterpisePersonData implements IPersonnel, uEvent {
  PersonDataID: number;
  DateValue: string;
  DocReestratorID: number;
  Oklad: number;
  Stavka: number;
  PIP: string;
  KodDRFO: string;
  DataPriyomu: string;
  Posada: number;
  PodatkovaPilga: number;

  public SourceEventUniqueId: number;
  public AggregateId: number;
  public SourceName: string;
  public EventLevel: number;
  public UserID: number;
  public SessionID: string;
  public ParentID: number;
  public ProtocolVersion: string;
  public Comment: string;
  public EventId: number;
  public SourceId: string;

  constructor(SourceId: string, Personnel: IPersonnel) {
    this.EventId = uEventsIds.CreateUpdatePersonData;
    this.SourceId = SourceId;

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
