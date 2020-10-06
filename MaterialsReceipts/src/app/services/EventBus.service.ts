import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CoreEvent } from 'event-proxy-lib-src';

/**
 * Event bus for inter component/service communication in current module
 */
@Injectable({
  providedIn: 'root'
})
export class EventBusService {

  public LastSelectedMaterialsReceiptId: number;

  /**
   * Event bus for inter component/service communication in current module
   */
  public EventBus = new Subject<CoreEvent>();

  /**
   * Invoked by MaterialsReceiptsList component when a record is selected
   * passed to parent to active tab MaterialsReceiptsTable
   */
  public OnMaterialReceiptSelected = new Subject<number>();

  /**
   * Component MaterialsReceiptsList calls when a record is selected
   * @param idSelected Materials Receipt Id
   */
  public MaterialReceiptSelected(idSelected: number): void {
    this.OnMaterialReceiptSelected.next(idSelected);
    this.LastSelectedMaterialsReceiptId = idSelected;
  }
}
