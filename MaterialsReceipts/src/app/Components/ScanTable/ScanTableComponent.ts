import { Component } from "@angular/core";
import { LazyLoadEvent } from "primeng/api";
import { Subscription } from "rxjs";
import { EventBusService } from "../../services/EventBusService";
import { MaterialsReceiptsAPI } from "../../services/MaterialsReceiptsAPI";
import { BarCodeCast, MaterialsData, MaterialsListTablePart, ScanTableData } from "event-proxy-lib-src";
import { MaterialReceiptSelectedData } from "@shared/Adds/MaterialReceiptSelectedData";
import { ScanTableQueryParams } from "@shared/Adds/ScanTableQueryParams";
import { ScanTableAggregate } from "../../Adds/ScanTableAggregate";

const inputTimeoutMs = 1000;

@Component({
  selector: 'materials-receipts-scan-table',
  templateUrl: './ScanTableView.html',
})
export class ScanTableComponent {

  public MaterialsListTableData: MaterialsListTablePart[];
  public BarCodesOfMaterialReceipt: BarCodeCast[];
  
  // New material
  public ShowNewMaterialForms: boolean;

  // Material relation dialog
  public SelectMaterialForBarcodeDialog: boolean;
  public SelectedMaterialForBarcode: MaterialsListTablePart;
  public ButtonConfirmMaterialRelationDisabled: boolean;
  public MaterialReceiptTableColumns = [
    { field: 'NameSOne', header: 'Name'},
    { field: 'PersonMRP', header: 'Person MRP'},
    { field: 'Quantity', header: 'Expected'},
    { field: 'ScannedQuantity', header: 'Left to scan'},
  ];
  
  // New Scan entry dialog
  private barCodeInputTimeout: number;
  public NewEntriesAddingDisabled: boolean;
  public NewScanDialogVisible: boolean;
  public NewEntry: ScanTableAggregate;
  public Submited: false;
  public Columns = [
    { field: 'MaterialsId', header: 'MaterialsId'},
    { field: 'MaterialsReceiptsListId', header: 'MaterialsReceiptsListId'},
    { field: 'MaterialsReceiptsTableId', header: 'MaterialsReceiptsTableId'},
    // { field: "Unit", header: "Unit"},
    { field: "BarCode", header: "BarCode" },
    { field: "Name", header: "Name" },
    { field: "Quantity", header: "Quantity"},
  ];

  // Table
  public Loading: boolean;
  public TotalRecords: number;
  public ScanTableData: ScanTableData[];
  public CurrentMaterialsReceiptData: MaterialReceiptSelectedData;
  
  private subscriptions: Subscription[];

  public constructor(
    private materialsReceiptsAPI: MaterialsReceiptsAPI,
    private eventBus: EventBusService) {

    this.Loading = true;
    this.NewEntry = new ScanTableAggregate();

    this.subscriptions = [];

    this.subscriptions.push(this.eventBus.OnMaterialReceiptSelected.subscribe(async () => {
      await this.refreshScanTableTable();
    }));
  }

  public OnDestroy(): void {
    this.subscriptions.forEach(element => {
      element?.unsubscribe();
    });
  }

  public async RefreshTable(): Promise<void> {
    await this.refreshScanTableTable();
  }

  public AddNewScan(): void {
    this.NewEntry = new ScanTableAggregate();
    this.NewScanDialogVisible = true;
    this.NewEntry.Quantity = 1;
    this.Submited = false;
    this.NewEntriesAddingDisabled = true;
  }

  public CheckBarcode(): void {
    if (!this.NewEntry.BarCode || this.NewEntry.BarCode?.trim().length == 0) {
      this.NewEntriesAddingDisabled = true;
      return;
    }

    if (this.barCodeInputTimeout)
      clearTimeout(this.barCodeInputTimeout);

      this.barCodeInputTimeout = setTimeout(() => {
        this.MaterialsListTableData = this.eventBus.LastMaterialsListTableData;
        this.BarCodesOfMaterialReceipt = this.eventBus.LastBarCodesOfMaterialReceipt;
        
        // 1. check if we already have barcode from shared MaterialsListTablePart from event bus
        for (let i = 0; i < this.MaterialsListTableData.length; i++) {
          if (this.MaterialsListTableData[i].NameSOne == this.NewEntry.BarCode) {
            // @UNDONE
            //  1. 2. Yes - we extract name and scanning buttons are active
            this.NewEntry.MaterialsReceiptsListId = this.MaterialsListTableData[i].MaterialsReceiptsListId;
            this.NewEntry.Name = this.MaterialsListTableData[i].NameSOne;
            this.NewEntry.Unit = this.MaterialsListTableData[i].Unit;
            this.NewEntry.MaterialsReceiptsTableId = this.MaterialsListTableData[i].Id;
            return;
          }
        }
        //  1. 1. No - we have to select existing - Material relation dialog enabled
        this.SelectMaterialForBarcodeDialog = true;
        this.ButtonConfirmMaterialRelationDisabled = true;
    }, inputTimeoutMs);
  }

  public OnClickConfirmMaterialRelation(): void {
    if (this.SelectedMaterialForBarcode == null)
      return;
  
    this.SelectMaterialForBarcodeDialog = false;
    this.NewEntry.Name = this.SelectedMaterialForBarcode.NameSOne;
    this.NewEntry.Unit = this.SelectedMaterialForBarcode.Unit;
    this.NewEntry.MaterialsReceiptsListId = this.SelectedMaterialForBarcode.MaterialsReceiptsListId;
    this.NewEntry.MaterialsReceiptsTableId = this.SelectedMaterialForBarcode.Id;

    // creating new material entry
    this.ShowNewMaterialForms = true;
  }

  public OnScanTableRowSelected(data: ScanTableData): void {
    this.eventBus.ScanTableRowSelected(data.MaterialsReceiptsTableId);
  }

  public OnScanTableRowUnSelected(): void {
    this.eventBus.ScanTableRowSelected();
  }

  public OnUnSelectMaterialForBarcode(): void {
    this.SelectedMaterialForBarcode = null;
    this.ButtonConfirmMaterialRelationDisabled = true;
  }
  
  public OnSelectMaterialForBarcode(data: MaterialsListTablePart): void {
    this.SelectedMaterialForBarcode = data;
    this.ButtonConfirmMaterialRelationDisabled = false;
  }

  public async OnSaveNewEntry(): Promise<void> {

    const scanTabledata: ScanTableData = {
      MaterialsId: this.NewEntry.MaterialsId,
      MaterialsReceiptsListId: this.NewEntry.MaterialsReceiptsListId,
      MaterialsReceiptsTableId: this.NewEntry.MaterialsReceiptsTableId,
      Quantity: this.NewEntry.Quantity,
      Unit: this.NewEntry.Unit
    };

    const materialData: MaterialsData = {
      Name: this.NewEntry.Name,
      Comment: this.NewEntry.Comment,
      BarCode: this.NewEntry.BarCode
    };

    this.AddNewScan();
    await this.materialsReceiptsAPI.ScanTableCreateAsync(scanTabledata);
    await this.refreshScanTableTable();
  }

  public async OnDeleteScan(data: ScanTableData): Promise<void> {
    await this.materialsReceiptsAPI.ScanTableDeleteAsync(data);
    await this.refreshScanTableTable();
  }

  public async LoadDataLazy(event: LazyLoadEvent): Promise<void> {

    const page = event.first/event.rows + 1;
    const limit = event.rows;

    await this.refreshScanTableTable(page, limit);
  }

  private async refreshScanTableTable(page = 1, limit = 30): Promise<void> {
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
