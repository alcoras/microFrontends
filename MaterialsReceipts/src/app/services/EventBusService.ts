import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { CoreEvent, MaterialsListTablePart } from "event-proxy-lib-src";
import { ScanTableAggregate } from "@shared/Adds/ScanTableAggregate";
import { MaterialReceiptSelectedData } from "@shared/Adds/MaterialReceiptSelectedData";

/**
 * Event bus for inter component/service communication in current module
 */
@Injectable({
  providedIn: "root"
})
export class EventBusService {

  public LastMaterialsListTableData: MaterialsListTablePart[];
  public LastSelectedMaterialsReceiptData: MaterialReceiptSelectedData;
  public LastScanDataAggregateList: ScanTableAggregate[];

  /** Event bus for inter component/service communication for passing events in current module */
  public EventBus = new Subject<CoreEvent>();

  /** Invoked by MaterialsReceiptsList component when a record is selected passed to parent to active tab MaterialsReceiptsTable */
  public OnMaterialReceiptSelected = new Subject<void>();

  /** Invoked by Scan Table when row is selected so MaterialsReceiptsTable can highlight matching row with Scan Table */
  public OnScanTableRowSelected = new Subject<number>();

  /** Invoked by Scan Table when entries are updated */
  public OnScanTableChanged = new Subject<void>();

  /** Invoked by Scan Table when user tries to Sign */
	public OnScanTableSignButtonClicked = new Subject<void>();

	/** Invoked by Action in ScanTable */
	public OnRequestScanTableRefresh = new Subject<void>();

	/** Event called anyone wants to refresh scan table */
	public RequestScanTableRefresh(): void {
		this.OnRequestScanTableRefresh.next();
	}
  /** Event called when Scan Table button is pressed */
  public ScanTableSignButtonClicked(): void {
    this.OnScanTableSignButtonClicked.next();
  }

  /** Event called when Scan Table is updated */
  public ScanTableChanged(): void {
    this.OnScanTableChanged.next();
  }

  /**
   * Event called when a row is selected in ScanTable
   * @param materialsReceiptsTableId MaterialsReceiptsTableId
   */
  public ScanTableRowSelected(materialsReceiptsTableId?: number): void {
    this.OnScanTableRowSelected.next(materialsReceiptsTableId);
  }

  /**
   * Event called when in Material Receipt List a record is selected
   * @param data Materials Receipt Data
   */
  public MaterialReceiptSelected(data: MaterialReceiptSelectedData): void {
    this.LastSelectedMaterialsReceiptData = data;
    this.OnMaterialReceiptSelected.next();
  }
}
