import { CoreEvent } from "../CoreEvent";
import { EventIds } from "../EventIds";
import { MicroFrontendInfo } from "../MicroFrontendInfo";

export class QrLoginRequest extends CoreEvent {
  public constructor(sourceInfo: MicroFrontendInfo) {
      super();
			this.EventId = EventIds.GiveMeQRCode;

      this.SourceId = sourceInfo.SourceId;
      this.SourceName = sourceInfo.SourceName;
    }
}
