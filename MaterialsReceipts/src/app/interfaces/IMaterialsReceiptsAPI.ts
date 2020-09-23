import { GetMaterialsList } from "./GetMaterialsList";
import { ReadListQueryParams } from '../helpers/ReadListQueryParams';

export interface IMaterialsReceiptsAPI {
  Get(queryParams: ReadListQueryParams): Promise<GetMaterialsList>;
}
