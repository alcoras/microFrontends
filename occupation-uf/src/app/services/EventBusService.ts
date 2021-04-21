import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { CoreEvent } from "event-proxy-lib-src";

/**
 * Event bus for inter component/service communication in current module
 */
@Injectable({
  providedIn: "root"
})
export class EventBusService {

  public EventBus = new Subject<CoreEvent>();

  public RefreshTable = new  Subject<void>();
}
