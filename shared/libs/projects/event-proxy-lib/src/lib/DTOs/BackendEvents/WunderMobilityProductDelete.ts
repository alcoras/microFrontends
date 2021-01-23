import { CoreEvent } from "../CoreEvent";
import { EventIds } from "../EventIds";
import { MicroFrontendInfo } from "../MicroFrontendInfo";

/**
 * Event to delete WunderMobilityProduct entry
 */
export class WunderMobilityProductDelete extends CoreEvent {

  public constructor(sourceInfo: MicroFrontendInfo, public Ids: number[]) {
    super();
    this.SourceId = sourceInfo.SourceId;
    this.SourceName = sourceInfo.SourceName;
    this.EventId = EventIds.TestWunderMobilityDelete;
  }
}
