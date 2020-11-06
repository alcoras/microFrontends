import { MaterialsListDTO } from "./DTOs/MaterialsListDTO";
import { ReadListQueryParams } from './helpers/ReadListQueryParams';

export interface IMaterialsReceiptsAPI {
  GetMaterialsReceiptsList(queryParams: ReadListQueryParams): Promise<MaterialsListDTO>;
}
