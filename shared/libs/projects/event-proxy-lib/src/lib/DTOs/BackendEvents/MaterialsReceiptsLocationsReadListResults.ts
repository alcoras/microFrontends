import { CoreEvent } from "../CoreEvent";
import { LocationsData } from "./Adds/LocationsData";

export class MaterialsReceiptsLocationsReadListResults extends CoreEvent {
  public LocationsDataList: LocationsData[];
  public TotalRecordsAmount: number;
}
