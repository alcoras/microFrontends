import { uEventsIds, uEvent } from '../../../models/event';
import { OccupationData } from '../../../models/Adds/OccupationData';

/**
 * Enum to indicate whether event is of type update or craete
 */
export enum OccupationCreateUpdateFlag {
  Create = uEventsIds.OccupationsCreate,
  Update = uEventsIds.OccupationsUpdate
}

/**
 * Backend event to create/update occupation entry
 */
export class OccupationsCreateUpdate extends uEvent {
  /**
   *  Occupation unique id holder
   */
  public OccupationAggregateIdHolderId?: number;

  /**
   * Date is set to
   */
  public DateTimeValue?: string;

  /**
   * Reference to registration document
   */
  public DocReestratorId?: number;

  /**
   * Occupation Name
   */
  public Name: string;

  /**
   * Tariff category
   */
  public TariffCategory?: number;

  /**
   * Soft delete mark
   */
  public IsDeleted?: boolean;

  /**
   *
   * @param sourceId Source id
   * @param createUpdateFlag create update flag
   * @param dateTimeValue at what time to update/craete
   * @param data OccupationData
   */
  public constructor(
    sourceId: string,
    createUpdateFlag: OccupationCreateUpdateFlag,
    dateTimeValue: string,
    data: OccupationData) {
    super();
    this.SourceId = sourceId;
    this.EventId = createUpdateFlag;
    this.DateTimeValue = dateTimeValue;

    this.OccupationAggregateIdHolderId = data.OccupationAggregateIdHolderId;
    this.DocReestratorId = data.DocReestratorId;
    this.Name = data.Name;
    this.TariffCategory = data.TariffCategory;
  }
}
