import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { BarCodeCast, CoreEvent, MaterialsListTablePart } from 'event-proxy-lib-src';
import { MaterialReceiptSelectedData } from '../Adds/MaterialReceiptSelectedData';

/**
 * Event bus for inter component/service communication in current module
 */
@Injectable({
  providedIn: 'root'
})
export class EventBusService {

  public LastMaterialsListTableData: MaterialsListTablePart[];
  public LastBarCodesOfMaterialReceipt: BarCodeCast[];
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
   * Invoked by Scan Table when row is selected so MaterialsReceiptsTable
   * can highlight matching row with Scan Table
   */
  public OnScanTableRowSelected = new Subject<number>();

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
