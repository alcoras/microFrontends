import { CoreEvent, EventIds, MicroFrontendInfo } from 'event-proxy-lib-src';

/**
 * Event for reading MaterialsReceipts Scan table
 */
export class MaterialsReceiptsMaterialsReadListQuery extends CoreEvent {

  public constructor(
    sourceInfo: MicroFrontendInfo,
    public MaterialsId?: number,
    public Page?: number,
    public Limit?: number) {

      super();
      if (Page <= 0 || Limit <= 0)
        throw new Error('Page or Limit cannot be 0 or below');

      this.SourceId = sourceInfo.SourceId;
      this.SourceName = sourceInfo.SourceName;
      this.EventId = EventIds.MaterialsReceiptsMaterialsReadListQuery;
  }
}
