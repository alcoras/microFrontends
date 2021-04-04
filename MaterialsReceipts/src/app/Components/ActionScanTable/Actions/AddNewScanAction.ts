import { Injectable } from "@angular/core";
import { ScanTableAggregate } from "@shared/Adds/ScanTableAggregate";
import { EventBusService } from "@shared/services/EventBusService";
import { MaterialsReceiptsAPI } from "@shared/services/MaterialsReceiptsAPI";
import { FunctionStage, StateMachine, WaitEventAsync } from "@shared/StateMachine";
import { BarCodeCast, MaterialsData, MaterialsListTablePart, ScanTableData } from "event-proxy-lib-src";
import { Subject } from "rxjs";

/**
 * Returns promise after ms
 * @param ms miliseconds
 * @returns Promise
 */
function delay(ms: number): Promise<void> {
	return new Promise( resolve => setTimeout(resolve, ms) );
}

export enum StateRoutines {
  Initial = 0,
  WaitForBarcodeInputChange = 10,
  ValidateBarcode = 20,
  WaitingForClickOnSaveAndSave = 30,
  MaterialRelation_WaitForSelection = 40,
  MaterialRelation_Selected = 50,
  MaterialRelation_NewMaterial = 60,
  End = 70
}

export enum UserInterfaceEventIds {
  reset = -1,
  waitForNewScanClick = 0,
  barcodeInputChanged = 10,
  materialRelation_Selected = 20,
  materialRelation_UnSelected = 25,
  materialRelation_Confirmed = 29,
  saveScanButtonClicked = 30,
}

/**
 * Aggregate which will contain everything data which needs to be communicated between Action and Component(s)
 */
export class NewScanStateAggregate {
	/** header for new scan dialog */
	public NewScanHeader: string;
	/** our output */
	public NewEntry: ScanTableAggregate;
	/** show/hide new scan dialog flag */
	public NewScanDialogVisible: boolean;
	/** Adding new scan button enabled/disabled flag */
	public NewEntriesAddingDisabled: boolean;
	/** Button for selection of material relation */
	public ButtonConfirmMaterialRelationDisabled: boolean;
	/** Existing ScanTable Aggregates */
	public ScanTableData: ScanTableAggregate[];
	/** Show/hide dialog for material selection flag */
	public SelectMaterialForBarcodeDialog: boolean;
	/** What material is selected */
	public SelectedMaterialForBarcode: MaterialsListTablePart;
	/** Do we need to request bar code relation flag */
	public RequestBarCodeRelation: boolean;
	/** data provided by other components/services */
	public MaterialsListTableData: MaterialsListTablePart[];
}

@Injectable({
  providedIn: "root"
})
export class AddNewScanAction {

	/** Exchange data between action and components/services */
	public StateData: NewScanStateAggregate;

	private stateMachine: StateMachine<NewScanStateAggregate>;

	/** unique identifier for draft */
	private keyString: string;
	private draftId: number;

	private actionEventBus: Subject<number>;

	private barCodeInputTimeoutMS = 1000;

	/** data provided by other components/services */
	private barCodesOfMaterialReceipt: BarCodeCast[] = [];

	public constructor(private materialsReceiptsAPI: MaterialsReceiptsAPI, private eventBus: EventBusService ) { }

	public Init(actionEventBus: Subject<number>) {
		this.actionEventBus = actionEventBus;

		const stages: FunctionStage[] = [
  		{ Index: StateRoutines.Initial, FunctionReference: this.newScanStarted },

  		{ Index: StateRoutines.WaitForBarcodeInputChange, FunctionReference: this.waitForBarcodeInputChange },
  		{ Index: StateRoutines.ValidateBarcode, FunctionReference: this.validateBarcode },
  		{ Index: StateRoutines.WaitingForClickOnSaveAndSave, FunctionReference: this.waitForSaveAndSave },
  		{ Index: StateRoutines.MaterialRelation_WaitForSelection, FunctionReference: this.materialSelection },
  		{ Index: StateRoutines.MaterialRelation_Selected, FunctionReference: this.materialSelected },
  		{ Index: StateRoutines.MaterialRelation_NewMaterial, FunctionReference: this.newMaterial },

  		{ Index: StateRoutines.End, FunctionReference: this.end },
		];

		this.StateData = new NewScanStateAggregate();
		this.StateData.NewEntry = {};
		this.stateMachine = new StateMachine<NewScanStateAggregate>(NewScanStateAggregate, stages, this, true, { Index: UserInterfaceEventIds.reset, FunctionReference: this.addNewScan_interrupt });
	}

	private async addNewScan_interrupt(): Promise<number> {
  	await WaitEventAsync(UserInterfaceEventIds.reset, this.actionEventBus);

  	return StateRoutines.Initial;
  }

	private async newScanStarted(): Promise<number> {
  	await WaitEventAsync(UserInterfaceEventIds.waitForNewScanClick, this.actionEventBus);

  	// TODO: if we await this function then user will be waiting when he first clicks on Add Scan
  	this.requestBarCodeRelationAsync();

  	this.resetNewScanDataEntry();

  	return StateRoutines.WaitForBarcodeInputChange;
	}

	private async waitForBarcodeInputChange(): Promise<number> {
		this.StateData.NewEntry.BarCode = this.StateData.NewEntry.BarCode?.trim();

		// wait till we stop typing after each change
		for (;;) {
  		const res = await Promise.race([
  			WaitEventAsync(UserInterfaceEventIds.barcodeInputChanged, this.actionEventBus),
  			delay(this.barCodeInputTimeoutMS)
  		]);

  		if (res) // barcode input changes, delay returns null
  			continue;

  		if (!this.StateData.NewEntry.BarCode || this.StateData.NewEntry.BarCode?.trim().length == 0) {
  			this.StateData.NewEntriesAddingDisabled = true;
  			continue;
  		}

  		break;
  	}

  	return StateRoutines.ValidateBarcode;
	}

	private async validateBarcode(): Promise<number> {
  	this.StateData.MaterialsListTableData = this.eventBus.LastMaterialsListTableData;

  	// 1. check if we already have barcode
  	// look up relation between one s
  	let barcodeRelationFound = false;

  	for (let barCodeIndex = 0; barCodeIndex < this.barCodesOfMaterialReceipt.length; barCodeIndex++) {
  		if (this.StateData.NewEntry.BarCode == this.barCodesOfMaterialReceipt[barCodeIndex].BarCode) {
  			//  1. 2. Yes - we extract name and scanning buttons are active
  			this.StateData.NewScanHeader = "New Scan > Material found";
  			barcodeRelationFound = true;
  			const materialId = this.barCodesOfMaterialReceipt[barCodeIndex].MaterialsId;
  			const material = await this.materialsReceiptsAPI.MaterialsQueryAsync(materialId);

  			this.StateData.NewEntry.MaterialsId = materialId;
  			this.StateData.NewEntry.Name = material.Result.MaterialsDataList[0].Name;
  			this.StateData.NewEntry.Comment = material.Result.MaterialsDataList[0].Comment;

  			let found = false;
  			for (let listTableIndex = 0; listTableIndex < this.StateData.MaterialsListTableData.length; listTableIndex++) {
  				if (this.StateData.MaterialsListTableData[listTableIndex].Id == this.barCodesOfMaterialReceipt[barCodeIndex].Id) {
  					this.StateData.NewEntry.MaterialsReceiptsListId = this.StateData.MaterialsListTableData[listTableIndex].MaterialsReceiptsListId;
  					this.StateData.NewEntry.MaterialsReceiptsTableId = this.StateData.MaterialsListTableData[listTableIndex].Id;
  					this.StateData.NewEntry.Unit = this.StateData.MaterialsListTableData[listTableIndex].Unit;
  					found = true;
  					break;
  				}
  			}

  			if (!found)
  				throw new Error("Could not find MaterialsListTablePart which must be found");

  			// allow to save
  			this.StateData.NewEntriesAddingDisabled = false;

  			return StateRoutines.WaitingForClickOnSaveAndSave;
  		}
		}
		// look up in existing scans in case we did not found in s one relations
  	if (!barcodeRelationFound) {
  		for (let barcodeIndex = 0; barcodeIndex < this.StateData.ScanTableData.length; barcodeIndex++) {
  			if (this.StateData.NewEntry.BarCode == this.StateData.ScanTableData[barcodeIndex].BarCode) {
  				this.StateData.NewScanHeader = "New Scan > Material found";
  				barcodeRelationFound = true;

  				this.StateData.NewEntry.MaterialsId = this.StateData.ScanTableData[barcodeIndex].MaterialsId;
  				this.StateData.NewEntry.MaterialsReceiptsListId = this.StateData.ScanTableData[barcodeIndex].MaterialsReceiptsListId;
  				this.StateData.NewEntry.MaterialsReceiptsTableId = this.StateData.ScanTableData[barcodeIndex].MaterialsReceiptsTableId;
  				this.StateData.NewEntry.Comment = this.StateData.ScanTableData[barcodeIndex].Comment;
  				this.StateData.NewEntry.Name = this.StateData.ScanTableData[barcodeIndex].Name;
  				this.StateData.NewEntry.Unit = this.StateData.ScanTableData[barcodeIndex].Unit;

  				// allow to save
  				this.StateData.NewEntriesAddingDisabled = false;

  				return StateRoutines.WaitingForClickOnSaveAndSave;
  			}
  		}
  	}
  	//  1. 1. No - we have to select existing - Material relation dialog enabled
  	this.StateData.SelectMaterialForBarcodeDialog = true;
  	this.StateData.ButtonConfirmMaterialRelationDisabled = true;

  	return StateRoutines.MaterialRelation_WaitForSelection;
  }

	private async materialSelection(): Promise<number> {
		const waitForOne = [
			WaitEventAsync(UserInterfaceEventIds.materialRelation_Selected, this.actionEventBus),
			WaitEventAsync(UserInterfaceEventIds.materialRelation_UnSelected, this.actionEventBus)
		];

		const result = await Promise.race(waitForOne);

		if (result == UserInterfaceEventIds.materialRelation_Selected)
			return StateRoutines.MaterialRelation_Selected;
		else
			return StateRoutines.MaterialRelation_WaitForSelection;
	}

	private async materialSelected(): Promise<number> {
  	// allow to confirm material selection
  	this.StateData.ButtonConfirmMaterialRelationDisabled = false;

  	const index = await Promise.race([
  		WaitEventAsync(UserInterfaceEventIds.materialRelation_UnSelected, this.actionEventBus),
  		WaitEventAsync(UserInterfaceEventIds.materialRelation_Confirmed, this.actionEventBus)
  	]);

  	if (index == UserInterfaceEventIds.materialRelation_UnSelected) {
  		this.StateData.ButtonConfirmMaterialRelationDisabled = true;
  		return StateRoutines.MaterialRelation_WaitForSelection;
  	}
  	else if (index == UserInterfaceEventIds.materialRelation_Confirmed)
  		return StateRoutines.MaterialRelation_NewMaterial;

  	throw Error("index was incorrect");
	}

	private async newMaterial(): Promise<number> {
  	if (this.StateData.SelectedMaterialForBarcode == null)
  		return StateRoutines.MaterialRelation_WaitForSelection;

  	this.StateData.SelectMaterialForBarcodeDialog = false;
  	this.StateData.NewEntry.Name = this.StateData.SelectedMaterialForBarcode.NameSOne;
  	this.StateData.NewEntry.Unit = this.StateData.SelectedMaterialForBarcode.Unit;
  	this.StateData.NewEntry.MaterialsReceiptsListId = this.StateData.SelectedMaterialForBarcode.MaterialsReceiptsListId;
  	this.StateData.NewEntry.MaterialsReceiptsTableId = this.StateData.SelectedMaterialForBarcode.Id;

  	// creating new material entry and load draft if exists, currently we need draft just for a comment
  	this.StateData.NewScanHeader = "New Scan > New Material";
  	const resposne = await this.materialsReceiptsAPI.DraftsGetAsync(this.keyString);

  	if (resposne.HasErrors()) {
  		throw Error(resposne.ErrorList.toString());
  	}

  	if (resposne.Result.DraftDataList.length > 0) {
  		this.StateData.NewScanHeader = "New Scan > New Material (draft)";
  		const material: MaterialsData = JSON.parse(resposne.Result.DraftDataList[0].Draft);
  		this.draftId = resposne.Result.DraftDataList[0].Id;
  		this.StateData.NewEntry.Comment = material.Comment;
  	}
  	// allow to save new ScanDataTable
  	this.StateData.NewEntriesAddingDisabled = false;
  	return StateRoutines.WaitingForClickOnSaveAndSave;
	}

	private async waitForSaveAndSave(): Promise<number> {
  	await WaitEventAsync(UserInterfaceEventIds.saveScanButtonClicked, this.actionEventBus);

  	const scanTabledata: ScanTableData = {
  		MaterialsId: this.StateData.NewEntry.MaterialsId,
  		MaterialsReceiptsListId: this.StateData.NewEntry.MaterialsReceiptsListId,
  		MaterialsReceiptsTableId: this.StateData.NewEntry.MaterialsReceiptsTableId,
  		Quantity: this.StateData.NewEntry.Quantity,
  		Unit: this.StateData.NewEntry.Unit
  	};

  	// add new material if we could not find existing one
  	if (!this.StateData.NewEntry.MaterialsId) {
  		const material: MaterialsData = {
  			Name: this.StateData.NewEntry.Name,
  			Comment: this.StateData.NewEntry.Comment,
  			BarCode: this.StateData.NewEntry.BarCode
  		};

  		const materialCreateResponse = await this.materialsReceiptsAPI.MaterialCreateAsync(material);
  		scanTabledata.MaterialsId = materialCreateResponse.Result.Id;
  	}

  	this.resetNewScanDataEntry();

  	await this.materialsReceiptsAPI.ScanTableCreateAsync(scanTabledata);
  	this.eventBus.RequestScanTableRefresh();

		return StateRoutines.WaitForBarcodeInputChange;
	}

	private async end(): Promise<number> {
  	// reset scan
  	this.draftId = 0;
  	this.StateData.NewScanHeader = "New Scan";
  	this.StateData.NewEntry = new ScanTableAggregate();
  	this.StateData.NewScanDialogVisible = true;
  	this.StateData.NewEntry.Quantity = 1;
  	this.StateData.NewEntriesAddingDisabled = true;
  	console.log("End of new scan routine");
  	return 0;
  }

	private resetNewScanDataEntry(): void {
  	this.draftId = 0;
  	this.StateData.NewScanHeader = "New Scan";

		this.StateData.NewEntry = {};

  	this.StateData.NewScanDialogVisible = true;
  	this.StateData.NewEntry.Quantity = 1;
  	this.StateData.NewEntriesAddingDisabled = true;
  }

	private async requestBarCodeRelationAsync(): Promise<void> {
			// we do it only once per material receipt change
			if (!this.StateData.RequestBarCodeRelation)
				return;

			const response = await this.materialsReceiptsAPI.BarCodesByMaterialReceiptQueryAsync(this.eventBus.LastSelectedMaterialsReceiptData.Id);

			this.barCodesOfMaterialReceipt = response.Result.BarCodeDetails;

			this.StateData.RequestBarCodeRelation = false;
	}
}
