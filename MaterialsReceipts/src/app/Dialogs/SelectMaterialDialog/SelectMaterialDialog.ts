import { Component } from "@angular/core";
import { LazyLoadEvent } from "primeng/api";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { MaterialsData } from "@shared/Models";
import { MaterialsReceiptsMaterialsReadListResults } from "@shared/Models/BackendEvents/MaterialsReceiptsMaterialsReadListResults";
import { MaterialsReceiptsAPI } from "@shared/services/MaterialsReceiptsAPI";

@Component({
  templateUrl: "SelectMaterialDialogView.html"
}) export class SelectMaterialDialog {

  public Data: MaterialsData[];

  public Loading: boolean;
  public TotalRecords: number;

  public Columns = ["Name", "Comment", "BarCode"];

  public constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private materialsReceiptsAPI: MaterialsReceiptsAPI) {
    this.Loading = true;
  }

  public LazyLoad(event: LazyLoadEvent): void {

    const page = event.first/event.rows + 1;
    const limit = event.rows;

    this.queryMaterials(page, limit);
  }

  public SelectMaterial(data: MaterialsData): void{
    this.ref.close(data);
  }
  private queryMaterials(page = 1, limit = 30): void {
    this.Loading = true;

    this.materialsReceiptsAPI.MaterialsQuery(null, page, limit)
    .then( (data: MaterialsReceiptsMaterialsReadListResults) => {
      this.Data = data.MaterialsDataList;
      this.TotalRecords = data.TotalRecordsAmount;
      this.Loading = false;
    })
  }
}
