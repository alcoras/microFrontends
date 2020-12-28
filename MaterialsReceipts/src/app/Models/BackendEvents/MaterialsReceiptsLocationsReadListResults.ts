import { CoreEvent } from 'event-proxy-lib-src';
import { LocationsData } from '../LocationsData';

export class MaterialsReceiptsLocationsReadListResults extends CoreEvent {
  public LocationsDataList: LocationsData[];
  public TotalRecordsAmount: number;
}
