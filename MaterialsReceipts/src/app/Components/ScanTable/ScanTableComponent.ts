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

  // Material relation dialog
  public SelectMaterialForBarcodeDialog: boolean;
  public SelectedMaterialForBarcode: MaterialsListTablePart;
  public ButtonConfirmMaterialRelationDisabled: boolean;
  public MaterialReceiptTableColumns = [
    { field: 'Id', header: 'Id'},
    { field: 'NameSOne', header: 'Name'},
    { field: 'PersonMRP', header: 'Person MRP'},
    { field: 'Quantity', header: 'Expected'},
    { field: 'ScannedQuantity', header: 'Left to scan'},
  ];
  
  // New Scan entry dialog
  private barCodeInputTimeout: number;
  public NewScanHeader = "New Scan";
  public NewEntriesAddingDisabled: boolean;
  public NewScanDialogVisible: boolean;
  public NewEntry: ScanTableAggregate;
  public Submited: false;
  
  // Scan Table
    public Columns = [
      { field: 'Id', header: 'Id'},
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
  private keyString: string;
  private draftId: number;

  public constructor(private materialsReceiptsAPI: MaterialsReceiptsAPI, private eventBus: EventBusService) {

    // TODO: hardcoding id for time being
    this.keyString = this.materialsReceiptsAPI.CreateDraftKeyString("ScanTableData", "0", "MaterialElement");
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

  public async AddNewScan(): Promise<void> {
    this.requestBarCodeRelationAsync();
    this.draftId = 0;
    this.NewScanHeader = "New Scan";
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
        
        // 1. check if we already have barcode
        // look up relation between one s
        let barcodeRelationFound = false;
        for (let barCodeIndex = 0; barCodeIndex < this.BarCodesOfMaterialReceipt.length; barCodeIndex++) {
          if (this.NewEntry.BarCode == this.BarCodesOfMaterialReceipt[barCodeIndex].BarCode) {
            //  1. 2. Yes - we extract name and scanning buttons are active
            this.NewScanHeader = "New Scan > Material found";
            barcodeRelationFound = true;
            const materialId = this.BarCodesOfMaterialReceipt[barCodeIndex].MaterialsId;
            const material = await this.materialsReceiptsAPI.MaterialsQueryAsync(materialId);
            
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

        // look up in existing scans in case we did not found in s one relations
        if (!barcodeRelationFound) {
          for (let barcodeIndex = 0; barcodeIndex < this.ScanTableData.length; barcodeIndex++) {
            if (this.NewEntry.BarCode == this.ScanTableData[barcodeIndex].BarCode) {
              this.NewScanHeader = "New Scan > Material found";
              barcodeRelationFound = true;

              this.NewEntry.MaterialsId = this.ScanTableData[barcodeIndex].MaterialsId;
              this.NewEntry.MaterialsReceiptsListId = this.ScanTableData[barcodeIndex].MaterialsReceiptsListId;
              this.NewEntry.MaterialsReceiptsTableId = this.ScanTableData[barcodeIndex].MaterialsReceiptsTableId;
              this.NewEntry.Comment = this.ScanTableData[barcodeIndex].Comment;
              this.NewEntry.Name = this.ScanTableData[barcodeIndex].Name;
              this.NewEntry.Unit = this.ScanTableData[barcodeIndex].Unit;

              // allow to save
              this.NewEntriesAddingDisabled = false;

              return;
            }
          }
        }

        //  1. 1. No - we have to select existing - Material relation dialog enabled
        this.SelectMaterialForBarcodeDialog = true;
        this.ButtonConfirmMaterialRelationDisabled = true;
        // watch for OnClickConfirmMaterialRelation which will be triggered after selection is made
    }, inputTimeoutMs);
  }

  public async OnClickConfirmMaterialRelation(): Promise<void> {
    if (this.SelectedMaterialForBarcode == null)
      return;
  
    this.SelectMaterialForBarcodeDialog = false;
    this.NewEntry.Name = this.SelectedMaterialForBarcode.NameSOne;
    this.NewEntry.Unit = this.SelectedMaterialForBarcode.Unit;
    this.NewEntry.MaterialsReceiptsListId = this.SelectedMaterialForBarcode.MaterialsReceiptsListId;
    this.NewEntry.MaterialsReceiptsTableId = this.SelectedMaterialForBarcode.Id;

    // creating new material entry and load draft if exists, currently we need draft just for a comment
    this.NewScanHeader = "New Scan > New Material";
    const resposne = await this.materialsReceiptsAPI.DraftsGetAsync(this.keyString);
    
    if (resposne.HasErrors()) {
      console.error(resposne.ErrorList.toString());
      return;
    }

    if (resposne.Result.DraftDataList.length > 0) {
      this.NewScanHeader = "New Scan > New Material (draft)";
      const material: MaterialsData = JSON.parse(resposne.Result.DraftDataList[0].Draft);
      this.draftId = resposne.Result.DraftDataList[0].Id;
      this.NewEntry.Comment = material.Comment;
    }
    // allow to save new ScanDataTable
    this.NewEntriesAddingDisabled = false;
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

  /**
   * Called when when saving entry to ScanData
   */
  public async OnSaveNewEntry(): Promise<void> {

    const scanTabledata: ScanTableData = {
      MaterialsId: this.NewEntry.MaterialsId,
      MaterialsReceiptsListId: this.NewEntry.MaterialsReceiptsListId,
      MaterialsReceiptsTableId: this.NewEntry.MaterialsReceiptsTableId,
      Quantity: this.NewEntry.Quantity,
      Unit: this.NewEntry.Unit
    };

    // add new material if we could not find existing one
    if (!this.NewEntry.MaterialsId) {
      const material: MaterialsData = {
        Name: this.NewEntry.Name,
        Comment: this.NewEntry.Comment,
        BarCode: this.NewEntry.BarCode
      };
  
      const materialCreateResponse = await this.materialsReceiptsAPI.MaterialCreateAsync(material);
      scanTabledata.MaterialsId = materialCreateResponse.Result.Id;
    }
    
    this.AddNewScan();
    await this.materialsReceiptsAPI.ScanTableCreateAsync(scanTabledata)
    await this.refreshScanTableTableAsync();
  }

  public async OnSaveDraft() {
    const materialDraft: MaterialsData = {
      Name: this.NewEntry.Name,
      Comment: this.NewEntry.Comment,
      BarCode: this.NewEntry.BarCode
    };

    // save or update MaterialElement draft
    if (this.draftId > 0) {
      await this.materialsReceiptsAPI.DraftsUpdateAsync(this.draftId, this.keyString, JSON.stringify(materialDraft))
    } else {
      await this.materialsReceiptsAPI.DraftsCreateAsync(this.keyString, JSON.stringify(materialDraft));
    }
  }

  public async OnDeleteScan(data: ScanTableAggregate): Promise<void> {
    const scanTabledata: ScanTableData = {
      Id: data.Id
    };
    await this.materialsReceiptsAPI.ScanTableDeleteAsync(scanTabledata);
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
        Id: scanTableData.Id,
        MaterialsId: scanTableData.MaterialsId,
        MaterialsReceiptsListId: scanTableData.MaterialsReceiptsListId,
        MaterialsReceiptsTableId: scanTableData.MaterialsReceiptsTableId,
        Quantity: scanTableData.Quantity,
        Unit: scanTableData.Unit
      };

      this.ScanTableData.push(newScan);
      if (scanTableData.MaterialsId)
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
