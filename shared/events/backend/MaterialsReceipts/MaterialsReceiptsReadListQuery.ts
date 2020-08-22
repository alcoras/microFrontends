import { MicroFrontendInfo } from '../../../models/MicroFrontendInfo';
import { uEventsIds, uEvent } from '../../../models/event';

/**
 * Event for reading MaterialsReceipts entries
 */
export class MaterialsReceiptsReadListQuery extends uEvent {

  /**
   * @param sourceInfo microfrontend's source info
   * @param IntervalFrom First receipt datetime or empty if any
   * @param IntervalUntil Last receipt datetime or empty if any
   * @param Signed Sign state (true if signed)
   * @param Page Page number
   * @param Limit Number of records per page
   */
  public constructor(

    sourceInfo: MicroFrontendInfo,
    public IntervalFrom?: string,
    public IntervalUntil?: string,
    public Signed?: string,
    public Page?: number,
    public Limit?: number,
  ) {
    super();
    if (Page <= 0 || Limit <= 0)
      throw new Error('Page or Limit cannot be 0 or below');

    this.SourceId = sourceInfo.SourceId;
    this.SourceName = sourceInfo.SourceName;
    this.EventId = uEventsIds.MaterialsReceiptsReadListQuery;
  }
}
