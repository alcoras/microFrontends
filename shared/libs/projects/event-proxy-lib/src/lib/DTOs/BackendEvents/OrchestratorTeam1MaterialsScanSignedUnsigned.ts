import { CoreEvent } from "../CoreEvent";
import { EventIds } from "../EventIds";
import { MicroFrontendInfo } from "../MicroFrontendInfo";

export enum SingUnsignFlag {
	Sign = EventIds.OrchestratorTeam1MaterialsScanSigned,
	Unsign = EventIds.OrchestratorTeam1MaterialsScanUnSigned,
}

export class OrchestratorTeam1MaterialsScanSignedUnsigned extends CoreEvent {

	/**
	 * @param sourceInfo microfrontend"s source info
	 * @param signUnsignFlag
	 * @param Id Materials scan signed (set the id of Materials list in this event)
	 */
	public constructor(sourceInfo: MicroFrontendInfo, signUnsignFlag: SingUnsignFlag, public Id: number,) {
		super();

		this.EventId = signUnsignFlag;
		this.SourceId = sourceInfo.SourceId;
		this.SourceName = sourceInfo.SourceName;
	}
}
