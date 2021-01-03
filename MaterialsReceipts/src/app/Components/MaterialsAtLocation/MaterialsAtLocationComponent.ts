import { Component } from "@angular/core";
import { LazyLoadEvent } from "primeng/api";
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";
import { MaterialsReceiptsAPI } from "@shared/services/MaterialsReceiptsAPI";
import { SelectMaterialDialog } from "@shared/Components/Dialogs/SelectMaterialDialog/SelectMaterialDialog";
import {
  MaterialsAtLocationsData,
  MaterialsData,
  MaterialsReceiptsMaterialsAtLocationsReadListResults } from "event-proxy-lib-src";

@Component({
  selector: "material-receipts-materials-at-location-table",
  templateUrl: "MaterialsAtLocationView.html",
  providers: [ DialogService ]
}) export class MaterialsAtLocationComponent {
  public Data: MaterialsAtLocationsData[];
  public Columns = [ "MaterialsId", "LocationId", "Quantity", "Unit" ];

  public TotalRecords: number;
  public Loading: boolean;

  public NewDialogDisplay: boolean;
  public NewEntry = new MaterialsAtLocationsData();
  public NewDialogSubmited: boolean;

  private dialogReference: DynamicDialogRef;

  public constructor(
    private dialogService: DialogService,
    private materialsReceiptsAPI: MaterialsReceiptsAPI) {
    this.Loading = true;
  }

  public LazyLoad(event: LazyLoadEvent): void {
    this.queryMaterialsAtLocation(
      event.first/event.rows + 1, event.rows);
  }

  public DialogNew(): void {
    this.NewDialogDisplay = true;
    this.NewEntry = new MaterialsAtLocationsData();
    this.NewDialogSubmited = false;
  }

  public SelectMaterialId(): void {
    this.dialogReference = this.dialogService.open(SelectMaterialDialog, {
      header: 'Choose Material',
      width: '100%',
      contentStyle: {"max-height": "500px", "overflow": "auto"},
      baseZIndex: 10000
   });

   this.dialogReference.onClose.subscribe((data: MaterialsData) => {
     if (data) {
       console.log(data);
     }
   })
  }

  public ngOnDestroy(): void {
    if (this.dialogReference)
      this.dialogReference.close();
  }

  public SaveNew(): void {
    console.log("Saving");
  }

  public RefreshTable(): void {
    this.queryMaterialsAtLocation();
  }

  public DeleteLocation(data: MaterialsAtLocationsData): void {
    console.log(data);
  }

  private queryMaterialsAtLocation(page = 1, limit = 30): void {
    this.Loading = true;

    this.materialsReceiptsAPI.MaterialsAtLocationQuery(page, limit)
    .then( (data: MaterialsReceiptsMaterialsAtLocationsReadListResults) => {
      this.Data = data.MaterialsAtLocationsDataList;
      this.TotalRecords = data.TotalRecordsAmount;
      this.Loading = false;
    })
  }
}
