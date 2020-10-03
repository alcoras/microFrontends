import { MaterialsListDTO } from "./DTOs/MaterialsListDTO";
import { ReadListQueryParams } from './helpers/ReadListQueryParams';

export interface IMaterialsReceiptsAPI {
  Get(queryParams: ReadListQueryParams): Promise<MaterialsListDTO>;
}
