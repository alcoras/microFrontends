import { CoreEvent } from "../CoreEvent";
import { EventIds } from "../EventIds";
import { MicroFrontendInfo } from "../MicroFrontendInfo";

/**
 * Event for reading MaterialsReceiptsTable entries
 */
export class MaterialsReceiptsTablePartReadListQuery extends CoreEvent {
  /**
   * @param sourceInfo microfrontend"s source info
   * @param MaterialsReceiptsId Material receipt id you want to get assets of
   * @param Page Page number
   * @param Limit Number of records per page
   */
  public constructor(
    sourceInfo: MicroFrontendInfo,
    public MaterialsReceiptsId: number,
    public Page?: number,
    public Limit?: number,
  ) {
    super();
    if (Page <= 0 || Limit <= 0)
      throw new Error("Page or Limit cannot be 0 or below");

    this.SourceId = sourceInfo.SourceId;
    this.SourceName = sourceInfo.SourceName;
    this.EventId = EventIds.MaterialsReceiptsTablePartReadListQuery;
  }
}
