import { CoreEvent } from 'event-proxy-lib-src';
import { MaterialsAtLocationsData } from '../MaterialsAtLocationsData';

export class MaterialsReceiptsMaterialsAtLocationsReadListResults extends CoreEvent {
  public MaterialsAtLocationsDataList: MaterialsAtLocationsData[];
  public TotalRecordsAmount: number;
}
