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

  public RequestBarCodeRelation = true;
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
  
  // Table
    public Columns = [
      { field: 'MaterialsId', header: 'MaterialsId'},
      { field: 'MaterialsReceiptsListId', header: 'MaterialsReceiptsListId'},
      { field: 'MaterialsReceiptsTableId', header: 'MaterialsReceiptsTableId'},
      // skipping unit because it goes along with quantity
      // { field: "Unit", header: "Unit"},
      { field: "BarCode", header: "BarCode" },
      { field: "Name", header: "Name" },
      { field: "Quantity", header: "Quantity"},
    ];
  public Loading: boolean;
  public TotalRecords: number;
  public ScanTableData: ScanTableAggregate[];
  public CurrentMaterialsReceiptData: MaterialReceiptSelectedData;
  
  private subscriptions: Subscription[];

  public constructor(private materialsReceiptsAPI: MaterialsReceiptsAPI, private eventBus: EventBusService) {

    this.Loading = true;
    this.NewEntry = new ScanTableAggregate();

    this.subscriptions = [];

    this.subscriptions.push(this.eventBus.OnMaterialReceiptSelected.subscribe(async () => {
      this.RequestBarCodeRelation = true;
      await this.refreshScanTableTableAsync();
    }));
  }

  public OnDestroy(): void {
    this.subscriptions.forEach(element => {
      element?.unsubscribe();
    });
  }

  public async RefreshTable(): Promise<void> {
    await this.refreshScanTableTableAsync();
  }

  public AddNewScan(): void {
    // we don't wait because there is very unlikely a scan will be done faster
    this.requestBarCodeRelationAsync();
    this.NewEntry = new ScanTableAggregate();
    this.NewScanDialogVisible = true;
    this.NewEntry.Quantity = 1;
    this.Submited = false;
    this.NewEntriesAddingDisabled = true;
  }

  public OnInputBarcodeChange(): void {
    this.NewEntry.BarCode = this.NewEntry.BarCode?.trim();

    if (!this.NewEntry.BarCode || this.NewEntry.BarCode?.trim().length == 0) {
      this.NewEntriesAddingDisabled = true;
      return;
    }

    if (this.barCodeInputTimeout)
      clearTimeout(this.barCodeInputTimeout);

      this.barCodeInputTimeout = setTimeout(async () => {
        this.MaterialsListTableData = this.eventBus.LastMaterialsListTableData;
        
        // 1. check if we already have barcode from shared data in event bus
        for (let barCodeIndex = 0; barCodeIndex < this.BarCodesOfMaterialReceipt.length; barCodeIndex++) {
          if (this.BarCodesOfMaterialReceipt[barCodeIndex].BarCode == this.NewEntry.BarCode) {
            //  1. 2. Yes - we extract name and scanning buttons are active
            const materialId = this.BarCodesOfMaterialReceipt[barCodeIndex].MaterialsId;
            const material = await this.materialsReceiptsAPI.MaterialsQueryAsync(materialId);
            
            // TODO: handle errors and check if only one material was returned

            this.NewEntry.MaterialsId = materialId;
            this.NewEntry.Name = material.Result.MaterialsDataList[0].Name;
            this.NewEntry.Comment = material.Result.MaterialsDataList[0].Comment;

            let found = false;
            for (let listTableIndex = 0; listTableIndex < this.MaterialsListTableData.length; listTableIndex++) {
              if (this.MaterialsListTableData[listTableIndex].Id == this.BarCodesOfMaterialReceipt[barCodeIndex].Id) {
                this.NewEntry.MaterialsReceiptsListId = this.MaterialsListTableData[listTableIndex].MaterialsReceiptsListId;
                this.NewEntry.MaterialsReceiptsTableId = this.MaterialsListTableData[listTableIndex].Id;
                this.NewEntry.Unit = this.MaterialsListTableData[listTableIndex].Unit;
                found = true;
                break;
              }
            }

            if (!found)
              throw new Error("Could not find MaterialsListTablePart which must be found");

            // allow to save
            this.NewEntriesAddingDisabled = false;

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

    this.AddNewScan();
    await this.materialsReceiptsAPI.ScanTableCreateAsync(scanTabledata);
    await this.refreshScanTableTableAsync();
  }

  public async OnDeleteScan(data: ScanTableData): Promise<void> {
    await this.materialsReceiptsAPI.ScanTableDeleteAsync(data);
    await this.refreshScanTableTableAsync();
  }

  public async LoadDataLazy(event: LazyLoadEvent): Promise<void> {

    const page = event.first/event.rows + 1;
    const limit = event.rows;

    await this.refreshScanTableTableAsync(page, limit);
  }

  private async requestBarCodeRelationAsync() {
    // we do it only once per material receipt change
    if (!this.RequestBarCodeRelation)
      return;

    const response = await this.materialsReceiptsAPI.BarCodesByMaterialReceiptQueryAsync(this.eventBus.LastSelectedMaterialsReceiptData.Id);

    this.BarCodesOfMaterialReceipt = response.Result.BarCodeDetails;

    this.RequestBarCodeRelation = false;
  }

  private async refreshScanTableTableAsync(page = 1, limit = 30): Promise<void> {
    this.Loading = true;

    this.CurrentMaterialsReceiptData = this.eventBus.LastSelectedMaterialsReceiptData;

    this.MaterialsListTableData = this.eventBus.LastMaterialsListTableData;

    if (!this.CurrentMaterialsReceiptData || this.CurrentMaterialsReceiptData.Id <= 0) {
      console.error(this.CurrentMaterialsReceiptData);
      throw new Error("MaterialsReceiptId was not given or id equal/below 0");
    }

    const queryParams: ScanTableQueryParams = {
      MaterialReceiptsListId: this.CurrentMaterialsReceiptData.Id,
      Page: page,
      Limit: limit
    };
    
    const response = await this.materialsReceiptsAPI.ScanTableQueryAsync(queryParams);
    
    this.ScanTableData = [];
    let materialIdList: number[] = [];

    // gather all material ids
    for (let i = 0; i < response.Result.ScanTableDataList.length; i++) {
      const scanTableData = response.Result.ScanTableDataList[i];
      const newScan: ScanTableAggregate = {
        MaterialsId: scanTableData.MaterialsId,
        MaterialsReceiptsListId: scanTableData.MaterialsReceiptsListId,
        MaterialsReceiptsTableId: scanTableData.MaterialsReceiptsTableId,
        Quantity: scanTableData.Quantity,
        Unit: scanTableData.Unit
      };

      this.ScanTableData.push(newScan);
      materialIdList.push(scanTableData.MaterialsId);
    }

    this.TotalRecords = response.Result.TotalRecordsAmount;
    this.Loading = false;

    // we fill up name and comment as we go (probably should show loading data entries or something)
    const materialsResponse = await this.materialsReceiptsAPI.MaterialsQueryByListAsync(materialIdList);

    for (let i = 0; i < materialsResponse.Result.MaterialsDataList.length; i++) {
      const material = materialsResponse.Result.MaterialsDataList[i];
      for (let m = 0; m < this.ScanTableData.length; m++) {
        if (this.ScanTableData[m].MaterialsId == material.Id) {
          // we found a match
          this.ScanTableData[m].BarCode = material.BarCode;
          this.ScanTableData[m].Name = material.Name;
          this.ScanTableData[m].Comment = material.Comment;
        }
      }
    }

    this.eventBus.LastScanDataAggregateList = this.ScanTableData;
    this.eventBus.ScanTableChanged();
  }
}
