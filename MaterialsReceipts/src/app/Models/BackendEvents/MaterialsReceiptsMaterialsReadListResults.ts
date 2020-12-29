import { CoreEvent } from 'event-proxy-lib-src';
import { MaterialsData } from '../MaterialsData'

export class MaterialsReceiptsMaterialsReadListResults extends CoreEvent {
  public MaterialsDataList: MaterialsData[];
  public TotalRecordsAmount: number;
}
