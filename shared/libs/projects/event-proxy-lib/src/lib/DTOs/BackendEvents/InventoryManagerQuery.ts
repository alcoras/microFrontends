import { CoreEvent } from "../CoreEvent";
import { EventIds } from "../EventIds";
import { MicroFrontendInfo } from "../MicroFrontendInfo";

/**
 * Event for reading Inventory Manager
 */
export class InventoryManagerQuery extends CoreEvent {

	/**
	 * Constructor
	 * @param sourceInfo microfrontend's source info
	 * @param InventoryName inventory name (MaterialsInventoryQuantity for now)
	 * @param Day Date?
	 * @param ElementIds Element Id's which to return (if null or empty then all)
	 */
  public constructor(sourceInfo: MicroFrontendInfo, public InventoryName: string, public Day: string, public ElementIds?: number[]) {

      super();

      this.SourceId = sourceInfo.SourceId;
      this.SourceName = sourceInfo.SourceName;
      this.EventId = EventIds.InventoryManagerQuery;
  }
}
