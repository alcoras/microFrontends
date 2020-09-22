import { GetMaterialsList } from "./GetMaterialsList";

export interface IMaterialsReceiptsAPI {
  Get(page: number, limit: number): Promise<GetMaterialsList>;
}
