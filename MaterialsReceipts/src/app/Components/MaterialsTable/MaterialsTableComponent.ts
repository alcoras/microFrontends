import { Component } from "@angular/core";
import { MaterialsData, MaterialsReceiptsMaterialsReadListResults } from "event-proxy-lib-src";
import { LazyLoadEvent } from "primeng/api";
import { MaterialsReceiptsAPI } from "@shared/services/MaterialsReceiptsAPI";

@Component({
  templateUrl: "MaterialsTableView.html",
  selector: "material-receipts-materials-table",
}) export class MaterialsTableComponent {

  public Data: MaterialsData[];

  public Loading: boolean;
  public TotalRecords: number;

  public Columns = ["Name", "Comment", "BarCode"];

  public constructor(
    private materialsReceiptsAPI: MaterialsReceiptsAPI) {
      this.Loading = true;
  }

  public LazyLoad(event: LazyLoadEvent): void {

    const page = event.first/event.rows + 1;
    const limit = event.rows;

    this.queryMaterials(page, limit);
  }

  public RefreshTable(): void {
    this.queryMaterials();
  }

  public DeleteMaterial(): void {
    console.log('gg');
  }

  private queryMaterials(page = 1, limit = 30): void {
    this.Loading = true;

    this.materialsReceiptsAPI.MaterialsQuery(null, null, page, limit)
    .then( (data: MaterialsReceiptsMaterialsReadListResults) => {
      this.Data = data.MaterialsDataList;
      this.TotalRecords = data.TotalRecordsAmount;
      this.Loading = false;
    })
  }
}
