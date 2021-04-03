import { Component } from "@angular/core";
import { MaterialsData } from "event-proxy-lib-src";
import { LazyLoadEvent } from "primeng/api";
import { MaterialsReceiptsAPI } from "@shared/services/MaterialsReceiptsAPI";

@Component({
  templateUrl: "MaterialsTableView.html",
  selector: "material-receipts-materials-table",
}) export class MaterialsTableComponent {

  public Data: MaterialsData[];

  public Loading: boolean;
  public TotalRecords: number;

  public Columns = ["Id", "Name", "Comment", "BarCode"];

  public constructor(
    private materialsReceiptsAPI: MaterialsReceiptsAPI) {
      this.Loading = true;
  }

  public async LazyLoad(event: LazyLoadEvent): Promise<void> {

    const page = event.first/event.rows + 1;
    const limit = event.rows;

    await this.queryMaterialsAsync(page, limit);
  }

  public async RefreshTable(): Promise<void> {
    await this.queryMaterialsAsync();
  }

  public DeleteMaterial(): void {
    console.log("gg");
  }

  private async queryMaterialsAsync(page = 1, limit = 30): Promise<void> {
    this.Loading = true;

    const response = await this.materialsReceiptsAPI.MaterialsQueryAsync(null, null, page, limit);

    this.Data = response.Result.MaterialsDataList;
    this.TotalRecords = response.Result.TotalRecordsAmount;
    this.Loading = false;
  }
}
