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
	templateUrl: "./ActionScanTableView.html",
	providers: [ AddNewScanAction ]
})
export class ActionScanTableComponent {

	// Reference to state data for View
	public Action: NewScanStateAggregate;

  // Material relation dialog
  public MaterialReceiptTableColumns = [
  	// eslint-disable-next-line no-mixed-spaces-and-tabs
  	{ field: "Id", header: "Id"},
  	{ field: "NameSOne", header: "Name"},
  	{ field: "PersonMRP", header: "Person MRP"},
  	{ field: "Quantity", header: "Expected"},
  	{ field: "ScannedQuantity", header: "Left to scan"},
  ];

  // Scan Table
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

  public CurrentMaterialsReceiptData: MaterialReceiptSelectedData;

	private scanTableData: ScanTableAggregate[];
	private subscriptions: Subscription[] = [];
	private actionEventBus = new Subject<number>();

  public constructor(private materialsReceiptsAPI: MaterialsReceiptsAPI, private eventBus: EventBusService, private addNewScanAction: AddNewScanAction) {
		// TODO: hardcoding id for time being
  	//this.keyString = this.materialsReceiptsAPI.CreateDraftKeyString("ScanTableData", "0", "MaterialElement");
  	this.Loading = true;
  	//this.NewEntry = new ScanTableAggregate();

		this.actionConfiguration();

		this.subscriptions.push(this.eventBus.OnMaterialReceiptSelected.subscribe(async () => {
  		this.addNewScanAction.StateData.RequestBarCodeRelation = true;
  		await this.refreshScanTableTableAsync();

  		// reset AddNewScan
  		this.UIEventEmit(this.UIEventIds.reset);
		}));

	}

	private actionConfiguration(): void {
		// action configuration
		this.addNewScanAction.Init(this.actionEventBus);
		this.Action = this.addNewScanAction.StateData;
		this.subscriptions.push(this.eventBus.OnRequestScanTableRefresh.subscribe(async () => await this.refreshScanTableTableAsync()));
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
  public get UIEventIds(): typeof UserInterfaceEventIds {
  	return UserInterfaceEventIds;
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

  // public async OnSaveDraft(): Promise<void> {
  // 	const materialDraft: MaterialsData = {
  // 		Name: this.NewEntry.Name,
  // 		Comment: this.NewEntry.Comment,
  // 		BarCode: this.NewEntry.BarCode
  // 	};

  // 	// save or update MaterialElement draft
  // 	if (this.draftId > 0) {
  // 		await this.materialsReceiptsAPI.DraftsUpdateAsync(this.draftId, this.keyString, JSON.stringify(materialDraft));
  // 	} else {
  // 		await this.materialsReceiptsAPI.DraftsCreateAsync(this.keyString, JSON.stringify(materialDraft));
  // 	}
  // }

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
