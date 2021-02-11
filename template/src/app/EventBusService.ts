import { Injectable } from '@angular/core';
import { CoreEvent } from 'event-proxy-lib-src';
import { Subject } from 'rxjs';

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
  public EventBus = new Subject<CoreEvent>();
}
