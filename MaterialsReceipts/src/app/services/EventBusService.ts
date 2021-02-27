import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CoreEvent, MaterialsListTablePart } from 'event-proxy-lib-src';
import { MaterialReceiptSelectedData } from '../Adds/MaterialReceiptSelectedData';

/**
 * Event bus for inter component/service communication in current module
 */
@Injectable({
  providedIn: 'root'
})
export class EventBusService {

  public LastMaterialsListTableData: MaterialsListTablePart[];
  public LastSelectedMaterialsReceiptData: MaterialReceiptSelectedData;

  /**
   * Event bus for inter component/service communication in current module
   */
  public EventBus = new Subject<CoreEvent>();

  /**
   * Invoked by MaterialsReceiptsList component when a record is selected
   * passed to parent to active tab MaterialsReceiptsTable
   */
  public OnMaterialReceiptSelected = new Subject<void>();

  /**
   * Invoked by MaterialsReceiptsTable when a row is selected
   */
  public OnMaterialReceiptDataRowSelected = new Subject<MaterialsListTablePart>();

  /**
   * Invoked by ScanTable when row is selected, so Data Table can highlight a match
   */
  public OnScanTableRowSelected = new Subject<number>();

  /**
   * Event called when a row is selected in ScanTable
   * @param data MaterialsReceiptsTableId
   */
  public ScanTableRowSelected(data: number) {
    this.OnScanTableRowSelected.next(data);
  }

  /**
   * Event called MaterialsReceiptsTable when a row is selected
   * @param data Materials List Table Part
   */
  public MaterialReceiptDataRowSelected(data: MaterialsListTablePart): void {
    this.OnMaterialReceiptDataRowSelected.next(data);
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
