import { Component } from "@angular/core";
import { LazyLoadEvent } from "primeng/api";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { MaterialsReceiptsAPI } from "@shared/services/MaterialsReceiptsAPI";
import { MaterialsData } from "event-proxy-lib-src";

@Component({
  templateUrl: "SelectMaterialDialogView.html"
}) export class SelectMaterialDialog {

  public ButtonConfirmMaterialDisabled: boolean;
  public SelectedMaterial: MaterialsData;

  public Data: MaterialsData[];

  public Loading: boolean;
  public TotalRecords: number;

  public Columns = ["Name", "Comment", "BarCode"];

  public constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig, private materialsReceiptsAPI: MaterialsReceiptsAPI) {
    this.Loading = true;
    this.ButtonConfirmMaterialDisabled = true;
  }

  public async LazyLoad(event: LazyLoadEvent): Promise<void> {

    const page = event.first/event.rows + 1;
    const limit = event.rows;

    await this.queryMaterialsAsync(page, limit);
  }

  public OnMaterialSelectionConfirmClicked(): void {
    if (this.SelectMaterial)
      this.ref.close(this.SelectedMaterial);
    else
      console.error("No material was selected");
  }

  public OnSelectMaterial(data: MaterialsData): void {
    this.SelectedMaterial = data;
    this.ButtonConfirmMaterialDisabled = false;
  }

  public OnUnSelectMaterial(): void {
    this.ButtonConfirmMaterialDisabled = true;
  }

  public SelectMaterial(data: MaterialsData): void{
    this.ref.close(data);
  }

  private async queryMaterialsAsync(page = 1, limit = 30): Promise<void> {
    this.Loading = true;

    const response = await this.materialsReceiptsAPI.MaterialsQueryAsync(null, null, page, limit);

    this.Data = response.Result.MaterialsDataList;
    this.TotalRecords = response.Result.TotalRecordsAmount;
    this.Loading = false;
  }
}
