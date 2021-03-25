import { Component } from "@angular/core";
import { LazyLoadEvent } from "primeng/api";
import { Subject, Subscription } from "rxjs";
import { EventBusService } from "@shared/services/EventBusService";
import { MaterialsReceiptsAPI } from "@shared/services/MaterialsReceiptsAPI";
import { BarCodeCast, MaterialsData, MaterialsListTablePart, ScanTableData } from "event-proxy-lib-src";
import { MaterialReceiptSelectedData } from "@shared/Adds/MaterialReceiptSelectedData";
import { ScanTableQueryParams } from "@shared/Adds/ScanTableQueryParams";
import { ScanTableAggregate } from "@shared/Adds/ScanTableAggregate";
import { FunctionStage, StateMachine, WaitEventAsync } from "@shared/StateMachine"

/**
 * Returns promise after ms
 * @param ms miliseconds
 * @returns Promise
 */
function delay(ms: number): Promise<void> {
  return new Promise( resolve => setTimeout(resolve, ms) );
}

enum StateRoutines {
  Initial = 0,
  WaitForBarcodeInputChange = 10,
  ValidateBarcode = 20,
  WaitingForClickOnSaveAndSave = 30,
  MaterialRelation_WaitForSelection = 40,
  MaterialRelation_Selected = 50,
  MaterialRelation_NewMaterial = 60,
  End = 70
}

enum UIEventIds {
  reset = -1,
  waitForNewScanClick = 0,
  barcodeInputChanged = 10,
  materialRelationSelected = 20,
  materialRelationUnSelected = 25,
  materialRelationConfirmed = 29,
  saveScanButtonClicked = 30,
}

@Component({
  selector: 'materials-receipts-state-scan-table',
  templateUrl: './StateScanTableView.html',
})
export class StateScanTableComponent {

  public RequestBarCodeRelation = true;
  public MaterialsListTableData: MaterialsListTablePart[];
  public BarCodesOfMaterialReceipt: BarCodeCast[] = [];

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
  private barCodeInputTimeout = 1000;
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
  
  private subscriptions: Subscription[] = [];
  private keyString: string;
  private draftId: number;

  // state 
  private localEventBus = new Subject<number>();
  private newScanStateMachine: StateMachine<ScanTableAggregate>;

  public constructor(private materialsReceiptsAPI: MaterialsReceiptsAPI, private eventBus: EventBusService) {

    // TODO: hardcoding id for time being
    this.keyString = this.materialsReceiptsAPI.CreateDraftKeyString("ScanTableData", "0", "MaterialElement");
    this.Loading = true;
    this.NewEntry = new ScanTableAggregate();

    this.subscriptions.push(this.eventBus.OnMaterialReceiptSelected.subscribe(async () => {
      this.RequestBarCodeRelation = true;
      await this.refreshScanTableTableAsync();

      // reset AddNewScan
      this.UIEventEmit(this.UIEventIds.reset);
    }));
  }

  public ngOnInit(): void {
    let stages: FunctionStage[] = [];

    stages.push({ Index: StateRoutines.Initial, FunctionReference: this.AddNewScan_newScanStarted });

    stages.push({ Index: StateRoutines.WaitForBarcodeInputChange, FunctionReference: this.AddNewScan_waitForBarcodeInputChange });
    stages.push({ Index: StateRoutines.ValidateBarcode, FunctionReference: this.AddNewScan_validateBarcode });
    stages.push({ Index: StateRoutines.WaitingForClickOnSaveAndSave, FunctionReference: this.AddNewScan_waitForSaveAndSave });
    stages.push({ Index: StateRoutines.MaterialRelation_WaitForSelection, FunctionReference: this.AddNewScan_materialSelection });
    stages.push({ Index: StateRoutines.MaterialRelation_Selected, FunctionReference: this.AddNewScan_materialSelected });
    stages.push({ Index: StateRoutines.MaterialRelation_NewMaterial, FunctionReference: this.AddNewScan_newMaterial });

    stages.push({ Index: StateRoutines.End, FunctionReference: this.AddNewScan_end });

    this.newScanStateMachine = new StateMachine<ScanTableAggregate>(ScanTableAggregate, stages, this, true, { Index: UIEventIds.reset, FunctionReference: this.AddNewScan_reset });
  }

  public OnDestroy(): void {
    this.subscriptions.forEach(element => {
      element?.unsubscribe();
    });
  }

  public async RefreshTable(): Promise<void> {
    await this.refreshScanTableTableAsync();
  }

  // wrapper for enums because you can't access enum from view
  public get UIEventIds() {
    return UIEventIds;
  }

  // wrapper for UI events so we can send to correct event bus
  public UIEventEmit(eventId: number) {
    this.localEventBus.next(eventId);
  }

  private async AddNewScan_reset(): Promise<number> {
    await WaitEventAsync(UIEventIds.reset, this.localEventBus);

    return StateRoutines.Initial;
  }

  private async AddNewScan_newScanStarted(): Promise<number> {
    await WaitEventAsync(UIEventIds.waitForNewScanClick, this.localEventBus);

    this.requestBarCodeRelationAsync();
    this.resetNewScanDataEntry();

    return StateRoutines.WaitForBarcodeInputChange;
  }

  private resetNewScanDataEntry() {
    this.draftId = 0;
    this.NewScanHeader = "New Scan";

    this.NewEntry = {};
    // I have to set reference because..?
    this.newScanStateMachine.StateData = this.NewEntry;

    this.NewScanDialogVisible = true;
    this.NewEntry.Quantity = 1;
    this.Submited = false;
    this.NewEntriesAddingDisabled = true;
  }

  private async AddNewScan_waitForBarcodeInputChange(): Promise<number> {
    this.NewEntry.BarCode = this.NewEntry.BarCode?.trim();

    // wait till we stop typing after each change
    while (true) {
      let res = await Promise.race([
        WaitEventAsync(UIEventIds.barcodeInputChanged, this.localEventBus),
        delay(this.barCodeInputTimeout)
      ]);

      if (res) // not delay
        continue;
  
      if (!this.NewEntry.BarCode || this.NewEntry.BarCode?.trim().length == 0) {
        this.NewEntriesAddingDisabled = true;
        continue;
      }

      break;
    }

    return StateRoutines.ValidateBarcode;
  }

  private async AddNewScan_validateBarcode(): Promise<number> {
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

        return StateRoutines.WaitingForClickOnSaveAndSave;
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

          return StateRoutines.WaitingForClickOnSaveAndSave;
        }
      }
    }
    //  1. 1. No - we have to select existing - Material relation dialog enabled
    this.SelectMaterialForBarcodeDialog = true;
    this.ButtonConfirmMaterialRelationDisabled = true;

    return StateRoutines.MaterialRelation_WaitForSelection;
  }

  // wait for selection
  private async AddNewScan_materialSelection(): Promise<number> {
    let waitForOne = [
      WaitEventAsync(UIEventIds.materialRelationSelected, this.localEventBus),
      WaitEventAsync(UIEventIds.materialRelationUnSelected, this.localEventBus)
    ];

    let result = await Promise.race(waitForOne);

    if (result == UIEventIds.materialRelationSelected)
      return StateRoutines.MaterialRelation_Selected;
    else
      return StateRoutines.MaterialRelation_WaitForSelection;
  }

  private async AddNewScan_materialSelected(): Promise<number> {
    // allow to confirm material selection
    this.ButtonConfirmMaterialRelationDisabled = false;

    let index = await Promise.race([
      WaitEventAsync(UIEventIds.materialRelationUnSelected, this.localEventBus),
      WaitEventAsync(UIEventIds.materialRelationConfirmed, this.localEventBus)
    ])

    if (index == UIEventIds.materialRelationUnSelected) {
      this.ButtonConfirmMaterialRelationDisabled = true;
      return StateRoutines.MaterialRelation_WaitForSelection;
    }
    else if (index == UIEventIds.materialRelationConfirmed)
      return StateRoutines.MaterialRelation_NewMaterial;
    
    throw Error("index was incorrect");
  }

  private async AddNewScan_newMaterial(): Promise<number> {
    if (this.SelectedMaterialForBarcode == null)
      return StateRoutines.MaterialRelation_WaitForSelection; 
  
    this.SelectMaterialForBarcodeDialog = false;
    this.NewEntry.Name = this.SelectedMaterialForBarcode.NameSOne;
    this.NewEntry.Unit = this.SelectedMaterialForBarcode.Unit;
    this.NewEntry.MaterialsReceiptsListId = this.SelectedMaterialForBarcode.MaterialsReceiptsListId;
    this.NewEntry.MaterialsReceiptsTableId = this.SelectedMaterialForBarcode.Id;

    // creating new material entry and load draft if exists, currently we need draft just for a comment
    this.NewScanHeader = "New Scan > New Material";
    const resposne = await this.materialsReceiptsAPI.DraftsGetAsync(this.keyString);
    
    if (resposne.HasErrors()) {
      throw Error(resposne.ErrorList.toString());
    }

    if (resposne.Result.DraftDataList.length > 0) {
      this.NewScanHeader = "New Scan > New Material (draft)";
      const material: MaterialsData = JSON.parse(resposne.Result.DraftDataList[0].Draft);
      this.draftId = resposne.Result.DraftDataList[0].Id;
      this.NewEntry.Comment = material.Comment;
    }
    // allow to save new ScanDataTable
    this.NewEntriesAddingDisabled = false;
    return StateRoutines.WaitingForClickOnSaveAndSave;
  }

  private async AddNewScan_waitForSaveAndSave(): Promise<number> {
    await WaitEventAsync(UIEventIds.saveScanButtonClicked, this.localEventBus);

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
    
    this.resetNewScanDataEntry();
    
    await this.materialsReceiptsAPI.ScanTableCreateAsync(scanTabledata)
    await this.refreshScanTableTableAsync();
    
    return StateRoutines.WaitForBarcodeInputChange;
  }

  public async AddNewScan_end(): Promise<number> {
    // reset scan
    this.draftId = 0;
    this.NewScanHeader = "New Scan";
    this.NewEntry = new ScanTableAggregate();
    this.NewScanDialogVisible = true;
    this.NewEntry.Quantity = 1;
    this.Submited = false;
    this.NewEntriesAddingDisabled = true;
    console.log("End of new scan routine");
    return 0;
  }

  public OnScanTableRowSelected(data: ScanTableData): void {
    this.eventBus.ScanTableRowSelected(data.MaterialsReceiptsTableId);
  }

  public OnScanTableRowUnSelected(): void {
    this.eventBus.ScanTableRowSelected();
  }

  public OnSignButtonClicked() {
    // required data is in materials receipt table component so we notify him to handle it
    this.eventBus.ScanTableSignButtonClicked();
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
    const scanTabledata: ScanTableData = { Id: data.Id };

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

    if (materialsResponse)
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
