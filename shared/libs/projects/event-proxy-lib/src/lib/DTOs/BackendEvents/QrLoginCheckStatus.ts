import { CoreEvent } from "../CoreEvent";
import { EventIds } from "../EventIds";
import { MicroFrontendInfo } from "../MicroFrontendInfo";

export class QrLoginCheckStatus extends CoreEvent {
  public constructor(sourceInfo: MicroFrontendInfo, public QRCodeMessage: string) {
      super();
			this.EventId = EventIds.LoginQRCodeRequested;

      this.SourceId = sourceInfo.SourceId;
      this.SourceName = sourceInfo.SourceName;
    }
}
