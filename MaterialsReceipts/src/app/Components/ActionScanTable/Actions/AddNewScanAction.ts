import { Injectable } from "@angular/core";
import { EventBusService } from "@shared/services/EventBusService";
import { MaterialsReceiptsAPI } from "@shared/services/MaterialsReceiptsAPI";
import { FunctionStage, StateMachine, WaitEventAsync } from "@shared/StateMachine";
import { BarCodeCast } from "event-proxy-lib-src";
import { Subject } from "rxjs";

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

enum UserInterfaceEventIds {
  reset = -1,
  waitForNewScanClick = 0,
  barcodeInputChanged = 10,
  materialRelationSelected = 20,
  materialRelationUnSelected = 25,
  materialRelationConfirmed = 29,
  saveScanButtonClicked = 30,
}

@Injectable({
  providedIn: "root"
})
export class AddNewScanAction {

	private barCodesOfMaterialReceipt: BarCodeCast[] = [];

	private flagRequestBarCodeRelation = true;
	private localEventBus: Subject<number>;

	public constructor(private materialsReceiptsAPI: MaterialsReceiptsAPI, private eventBus: EventBusService ) {
	}

	public Init(localEventBus: Subject<number>) {
		this.localEventBus = localEventBus;

		const stages: FunctionStage[] = [
  		{ Index: StateRoutines.Initial, FunctionReference: this.newScanStarted },

  		// { Index: StateRoutines.WaitForBarcodeInputChange, FunctionReference: this.addNewScan_waitForBarcodeInputChange },
  		// { Index: StateRoutines.ValidateBarcode, FunctionReference: this.addNewScan_validateBarcode },
  		// { Index: StateRoutines.WaitingForClickOnSaveAndSave, FunctionReference: this.addNewScan_waitForSaveAndSave },
  		// { Index: StateRoutines.MaterialRelation_WaitForSelection, FunctionReference: this.addNewScan_materialSelection },
  		// { Index: StateRoutines.MaterialRelation_Selected, FunctionReference: this.addNewScan_materialSelected },
  		// { Index: StateRoutines.MaterialRelation_NewMaterial, FunctionReference: this.addNewScan_newMaterial },

  		// { Index: StateRoutines.End, FunctionReference: this.addNewScan_end },
  	];
	}

	private async newScanStarted(): Promise<number> {
  	await WaitEventAsync(UserInterfaceEventIds.waitForNewScanClick, this.localEventBus);

  	// TODO: if we await this function then user will be waiting when he first clicks on Add Scan
  	this.requestBarCodeRelationAsync();

  	//this.resetNewScanDataEntry();

  	return StateRoutines.WaitForBarcodeInputChange;
	}

	private async requestBarCodeRelationAsync(): Promise<void> {
			// we do it only once per material receipt change
			if (!this.flagRequestBarCodeRelation)
				return;

			const response = await this.materialsReceiptsAPI.BarCodesByMaterialReceiptQueryAsync(this.eventBus.LastSelectedMaterialsReceiptData.Id);

			this.barCodesOfMaterialReceipt = response.Result.BarCodeDetails;

			this.flagRequestBarCodeRelation = false;
	}
}
