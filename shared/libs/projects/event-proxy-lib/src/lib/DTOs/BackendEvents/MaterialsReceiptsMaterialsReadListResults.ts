import { CoreEvent } from "../CoreEvent";
import { MaterialsData } from "./Adds/MaterialsData";

export class MaterialsReceiptsMaterialsReadListResults extends CoreEvent {
  public MaterialsDataList: MaterialsData[];
  public TotalRecordsAmount: number;
}
