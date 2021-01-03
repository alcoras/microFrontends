import { CoreEvent } from "../CoreEvent";
import { EventIds } from "../EventIds";
import { MicroFrontendInfo } from "../MicroFrontendInfo";

/**
 * Enum to indicate whether event is of type update or craete
 */
export enum MaterialsReceiptsMaterialsAtLocationsAddRemoveFlag {
  Create = EventIds.MaterialsReceiptsMaterialsAtLocationAdd,
  Delete = EventIds.MaterialsReceiptsMaterialsAtLocationsRemove
}

export class MaterialsReceiptsMaterialsAtLocationsAddRemove extends CoreEvent {

  public constructor(
    sourceInfo: MicroFrontendInfo,
    addRemoveFlag: MaterialsReceiptsMaterialsAtLocationsAddRemoveFlag,
    public MaterialsId?: number,
    public LocationId?: number,
    public Quantity?: number,
    public Unity?: string) {

      super();

      this.SourceId = sourceInfo.SourceId;
      this.SourceName = sourceInfo.SourceName;
      this.EventId = addRemoveFlag;
  }
}
