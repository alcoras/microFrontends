import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { MaterialReceiptSelectedData } from '../Models/MaterialReceiptSelectedData';
import { CoreEvent } from 'event-proxy-lib-src';

/**
 * Event bus for inter component/service communication in current module
 */
@Injectable({
  providedIn: 'root'
})
export class EventBusService {

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
   * Event called when in Material Receipt List a record is selected
   * @param data Materials Receipt Data
   */
  public MaterialReceiptSelected(data: MaterialReceiptSelectedData): void {
    this.LastSelectedMaterialsReceiptData = data;
    this.OnMaterialReceiptSelected.next();
  }
}
