import { CoreEvent, EventIds, MicroFrontendInfo } from "event-proxy-lib-src";

/**
 * Enum to indicate event's subtype
 */
export enum CastorCreateAndOthersType {
  Create = EventIds.CastorCreate,
  Delete = EventIds.CastorDelete,
  Get = EventIds.CastorGet
}

/**
 * Cast relationship type
 * In the future we may have many-to-one, many-to-many
 */
export enum CastType {
  OneToOne = "OneToOne"
}

export class CastorCreateAndOthers extends CoreEvent {

  public OutputIds?: number[];

  public constructor(
    sourceInfo: MicroFrontendInfo,
    eventType: CastorCreateAndOthersType,
    public FirstType?: string,
    public FirstId?: number,
    public SecondType?: string,
    public SecondIds?: number[],
    public CastType = CastType.OneToOne) {
    super();

    this.SourceId = sourceInfo.SourceId;
    this.SourceName = sourceInfo.SourceName;
    this.EventId = eventType;
  }

}
