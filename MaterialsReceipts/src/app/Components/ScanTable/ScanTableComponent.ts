import { Component } from "@angular/core";
import { LazyLoadEvent } from "primeng/api";
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";
import { Subscription } from "rxjs";
import { EventBusService } from "../../services/EventBusService";
import { MaterialsReceiptsAPI } from "../../services/MaterialsReceiptsAPI";
import { ScanningDialog } from "@shared/Components/Dialogs/ScanningDialog/ScanningDialog";
import { ScanTableData } from "event-proxy-lib-src";
import { MaterialReceiptSelectedData } from "@shared/Adds/MaterialReceiptSelectedData";
import { ScanTableQueryParams } from "@shared/Adds/ScanTableQueryParams";

@Component({
  selector: 'materials-receipts-scan-table',
  templateUrl: './ScanTableView.html',
  providers: [ DialogService ]
})
export class ScanTableComponent {
  public Loading: boolean;
  public TotalRecords: number;

  public ScanTableData: ScanTableData[];
  public CurrentMaterialsReceiptData: MaterialReceiptSelectedData;

  public dialogReference: DynamicDialogRef;

  public ColumnsRelation = [
    { field: 'MaterialsId', header: 'MaterialsId'},
    { field: 'MaterialsReceiptsListId', header: 'MaterialsReceiptsListId'},
    { field: 'MaterialsReceiptsTableId', header: 'MaterialsReceiptsTableId'},
    { field: 'Quantity', header: 'Quantity'},
    { field: 'Unit', header: 'Unit'}
  ];

  private subscriptions: Subscription[];

  public constructor(
    private dialogService: DialogService,
    private materialsReceiptsAPI: MaterialsReceiptsAPI,
    private eventBus: EventBusService) {

    this.Loading = true;

    this.subscriptions = [];

    this.subscriptions.push(
      this.eventBus.OnMaterialReceiptSelected
        .subscribe(async () => await this.requestMaterialsScanTableDataAsync()));
  }

  public OnDestroy(): void {
    this.subscriptions.forEach(element => {
      element.unsubscribe();
    });
  }

  public async RefreshTable(): Promise<void> {
    await this.requestMaterialsScanTableDataAsync();
  }

  public AddNewScan(): void {
    this.dialogReference = this.dialogService.open(
      ScanningDialog, {
        modal: true,
        width: '100%',
        height: '100%',
        baseZIndex: 10001
      });

    this.dialogReference.onClose.subscribe((data: ScanTableData[]) => {
      if (data) this.parseNewScans(data);
    });
  }

  public async DeleteScan(data: ScanTableData): Promise<void> {
    await this.materialsReceiptsAPI.ScanTableDeleteAsync(data);
    await this.requestMaterialsScanTableDataAsync();
  }

  public async LoadDataLazy(event: LazyLoadEvent): Promise<void> {

    const page = event.first/event.rows + 1;
    const limit = event.rows;

    await this.requestMaterialsScanTableDataAsync(page, limit);
  }

  private parseNewScans(scanTableData: ScanTableData[]): void {
    // 1. extract same bar codes
    // 2. check if we have a match
    for (let i = 0; i < scanTableData.length; i++) {
      // this.materialsReceiptsAPI.MaterialsQueryAsync(null, scanTableData[i].BarCode).then(
      //   (queryResult: MaterialsReceiptsMaterialsReadListResults) => {
      //     console.log(queryResult);
      //   }
      // )
    }
  }

  private async requestMaterialsScanTableDataAsync(page = 1, limit = 30): Promise<void> {
    this.Loading = true;

    const data = this.eventBus.LastSelectedMaterialsReceiptData;
    this.CurrentMaterialsReceiptData = data;

    if (!data || data.Id <= 0) {
      console.error(data);
      throw new Error("MaterialsReceiptId was not given or id equal/below 0");
    }

    const queryParams: ScanTableQueryParams = {
      MaterialReceiptsListId: data.Id,
      Page: page,
      Limit: limit
    };

    const response = await this.materialsReceiptsAPI.ScanTableQueryAsync(queryParams);

    this.ScanTableData = response.Result.ScanTableDataList;
    this.TotalRecords = response.Result.TotalRecordsAmount;
    this.Loading = false;
  }
}
