import { CoreEvent } from "../CoreEvent";
import { MaterialsAtLocationsData } from "./Adds/MaterialsAtLocationsData";

export class MaterialsReceiptsMaterialsAtLocationsReadListResults extends CoreEvent {
  public MaterialsAtLocationsDataList: MaterialsAtLocationsData[];
  public TotalRecordsAmount: number;
}
