import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { uEvent } from '@uf-shared-models/index';

/**
 * Event bus for inter component/service communication in current module
 */
@Injectable({
  providedIn: 'root'
})
export class EventBusService {
  /**
   * Event bus for inter component/service communication in current module
   */
  public EventBus = new Subject<uEvent>();

  public RefreshTable = new  Subject<void>();
}
