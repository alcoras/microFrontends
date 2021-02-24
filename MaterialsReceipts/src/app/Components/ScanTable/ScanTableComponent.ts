import { Component } from "@angular/core";
import { LazyLoadEvent } from "primeng/api";
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";
import { Subscription } from "rxjs";
import { EventBusService } from "../../services/EventBusService";
import { MaterialsReceiptsAPI } from "../../services/MaterialsReceiptsAPI";
import { ScanningDialog } from "@shared/Components/Dialogs/ScanningDialog/ScanningDialog";
import { MaterialsListTablePart, ScanTableData } from "event-proxy-lib-src";
import { MaterialReceiptSelectedData } from "@shared/Adds/MaterialReceiptSelectedData";
import { ScanTableQueryParams } from "@shared/Adds/ScanTableQueryParams";

@Component({
  selector: 'materials-receipts-scan-table',
  templateUrl: './ScanTableView.html',
})
export class ScanTableComponent {
  public Loading: boolean;
  public TotalRecords: number;

  public NewEntriesAddingDisabled: boolean;
  public NewDialogVisible: boolean;
  public NewEntryName: string;
  public NewEntry = new ScanTableData();
  public Submited: false;

  public ScanTableData: ScanTableData[];
  public CurrentMaterialsReceiptData: MaterialReceiptSelectedData;

  private subToRowSelected: Subscription;

  public ColumnsRelation = [
    // { field: 'MaterialsId', header: 'MaterialsId'},
    // { field: 'MaterialsReceiptsListId', header: 'MaterialsReceiptsListId'},
    // { field: 'MaterialsReceiptsTableId', header: 'MaterialsReceiptsTableId'},
    { field: "BarCode", header: "BarCode" },
    { field: "Name", header: "Name" },
    { field: "Unit", header: "Unit"},
    { field: "Quantity", header: "Quantity"},
  ];

  private subscriptions: Subscription[];

  public constructor(
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
    this.NewDialogVisible = true;
    this.NewEntryName = "";
    this.NewEntry = { Quantity: 1 };
    this.Submited = false;
    this.NewEntriesAddingDisabled = true;
    this.subToRowSelected?.unsubscribe();
  }

  public CheckBarcode(): void {
    if (!this.NewEntry.BarCode || this.NewEntry.BarCode?.trim().length == 0)
      return;

    // 1. check if we already have barcode from shared MaterialsListTablePart from event bus
    for (var i = 0; i < this.eventBus.LastMaterialsListTableData.length; i++) {
      if (this.eventBus.LastMaterialsListTableData[i].NameSOne == this.NewEntry.BarCode) {
        //  1. 2. Yes - we extract name and scanning buttons are active
        this.NewEntryName = this.eventBus.LastMaterialsListTableData[i].NameSOne;
        this.NewEntry.Unit = this.eventBus.LastMaterialsListTableData[i].Unit;
        return;
      }
    }
    console.log("please select");

    this.NewDialogVisible = false;
    //  1. 1. No - we have to select existing
    this.subToRowSelected = this.eventBus.OnMaterialReceiptDataRowSelected.subscribe((data: MaterialsListTablePart) => {
      this.subToRowSelected.unsubscribe();
      console.log(data);
      this.NewEntriesAddingDisabled = false;
      this.NewEntryName = data.NameSOne;
      this.NewEntry.Unit = data.Unit;
      this.NewDialogVisible = true;
    });
  }

  public SaveNewEntry(): void {
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
