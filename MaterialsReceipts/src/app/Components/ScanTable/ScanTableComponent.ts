import { Component } from "@angular/core";
import { LazyLoadEvent } from "primeng/api";
import { Subject, Subscription } from "rxjs";
import { EventBusService } from "@shared/services/EventBusService";
import { MaterialsReceiptsAPI } from "@shared/services/MaterialsReceiptsAPI";
import { MaterialsData, ScanTableData } from "event-proxy-lib-src";
import { MaterialReceiptSelectedData } from "@shared/Adds/MaterialReceiptSelectedData";
import { ScanTableQueryParams } from "@shared/Adds/ScanTableQueryParams";
import { ScanTableAggregate } from "@shared/Adds/ScanTableAggregate";
import { AddNewScanAction, NewScanStateAggregate, UserInterfaceEventIds } from "./Actions/AddNewScanAction";

@Component({
	selector: "materials-receipts-action-scan-table",
	templateUrl: "./ScanTableView.html",
	providers: [ AddNewScanAction ]
})
export class ScanTableComponent {

	// Reference to state data for View
	public Action: NewScanStateAggregate;

  // Material relation dialog
  public MaterialReceiptTableColumns = [
  	// eslint-disable-next-line no-mixed-spaces-and-tabs
  	{ field: "Id", header: "Id"},
  	{ field: "NameSOne", header: "Name"},
  	{ field: "PersonMRP", header: "PersonMRP"},
  	{ field: "Quantity", header: "Expected"},
  	{ field: "ScannedQuantity", header: "LeftToScan"},
  ];

  public Columns = [
		{ field: "Id", header: "Id"},
  	{ field: "MaterialsId", header: "MaterialsId"},
  	{ field: "MaterialsReceiptsListId", header: "MaterialsReceiptsListId"},
  	{ field: "MaterialsReceiptsTableId", header: "MaterialsReceiptsTableId"},
  	// skipping unit because it goes along with quantity
  	// { field: "Unit", header: "Unit"},
  	{ field: "BarCode", header: "BarCode" },
  	{ field: "Name", header: "Name" },
  	{ field: "Quantity", header: "Quantity"},
  ];
  public Loading: boolean;
	public TotalRecords: number;

	public get ScanTableData(): ScanTableAggregate[] {
		return this.scanTableData;
	}

	public set ScanTableData(value: ScanTableAggregate[]) {
		this.scanTableData = value;
		this.Action.ScanTableData = value;
	}

	public UIEventIds = UserInterfaceEventIds;

  public CurrentMaterialsReceiptData: MaterialReceiptSelectedData;

	private scanTableData: ScanTableAggregate[];
	private subscriptions = new Subscription()
	private actionEventBus = new Subject<number>();

  public constructor(private materialsReceiptsAPI: MaterialsReceiptsAPI, private eventBus: EventBusService, private addNewScanAction: AddNewScanAction) {
  	this.Loading = true;

		this.actionConfiguration();

		this.subscriptions.add(this.eventBus.OnMaterialReceiptSelected.subscribe(async () => {
  		this.addNewScanAction.StateData.RequestBarCodeRelation = true;
  		await this.refreshScanTableTableAsync();

  		// reset AddNewScan
  		this.UIEventEmit(this.UIEventIds.reset);
		}));

	}

	private actionConfiguration(): void {
		this.addNewScanAction.Init(this.actionEventBus);
		this.Action = this.addNewScanAction.StateData;
		this.subscriptions.add(this.eventBus.OnRequestScanTableRefresh.subscribe(async () => await this.refreshScanTableTableAsync()));
		// TODO: hardcoding id for time being
		this.Action.ScanTableToMaterialElementKeyString = this.materialsReceiptsAPI.CreateDraftKeyString("ScanTableData", "0", "MaterialElement");
	}

  public OnDestroy(): void {
		this.subscriptions.unsubscribe();
  }

  public async RefreshTable(): Promise<void> {
  	await this.refreshScanTableTableAsync();
  }

  // wrapper for UI events so we can send to correct event bus
  public UIEventEmit(eventId: number): void {
  	this.actionEventBus.next(eventId);
  }

  public OnScanTableRowSelected(data: ScanTableData): void {
  	this.eventBus.ScanTableRowSelected(data.MaterialsReceiptsTableId);
  }

  public OnScanTableRowUnSelected(): void {
  	this.eventBus.ScanTableRowSelected();
  }

  public OnSignButtonClicked(): void {
  	// required data is in materials receipt table component so we notify him to handle it
  	this.eventBus.ScanTableSignButtonClicked();
	}

	public OnUnsignButtonClicked(): void {
		this.eventBus.ScanTableUnsignButtonClicked();
	}

  public async OnSaveDraft(): Promise<void> {
  	const materialDraft: MaterialsData = {
  		Name: this.addNewScanAction.StateData.NewEntry.Name,
  		Comment: this.addNewScanAction.StateData.NewEntry.Comment,
  		BarCode: this.addNewScanAction.StateData.NewEntry.BarCode
  	};

  	// save or update MaterialElement draft
  	if (this.addNewScanAction.StateData.DraftId > 0) {
  		await this.materialsReceiptsAPI.DraftsUpdateAsync(this.Action.DraftId, this.Action.ScanTableToMaterialElementKeyString, JSON.stringify(materialDraft));
  	} else {
  		await this.materialsReceiptsAPI.DraftsCreateAsync(this.Action.ScanTableToMaterialElementKeyString, JSON.stringify(materialDraft));
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

  private async refreshScanTableTableAsync(page = 1, limit = 30): Promise<void> {
  	this.Loading = true;

  	this.CurrentMaterialsReceiptData = this.eventBus.LastSelectedMaterialsReceiptData;

  	this.addNewScanAction.StateData.MaterialsListTableData = this.eventBus.LastMaterialsListTableData;

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
  	const materialIdList: number[] = [];

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
