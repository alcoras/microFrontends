import { CoreEvent } from "../CoreEvent";
import { EventIds } from "../EventIds";
import { MicroFrontendInfo } from "../MicroFrontendInfo";

/**
 * Asks what barcodes we have for specified material receipt
 */
export class OrchestratorTeam1BarCodeDetailsQuery extends CoreEvent {
	/**
	 * @param soureInfo microfrontend"s source info
	 * @param Id MaterialReceipt unique id
	 */
	public constructor(soureInfo: MicroFrontendInfo, public Id: number) {
		super();

		this.EventId = EventIds.OrchestratorTeam1BarCodeDetailsQuery;
		this.SourceId = soureInfo.SourceId;
		this.SourceName = soureInfo.SourceName;
	}
}
