import { MaterialsListDTO } from "./DTOs/MaterialsListDTO";
import { ReadListQueryParams } from './helpers/ReadListQueryParams';

export interface IMaterialsReceiptsAPI {
  MaterialsReceiptsListQuery(queryParams: ReadListQueryParams): Promise<MaterialsListDTO>;
}
