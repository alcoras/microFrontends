import { Injectable } from "@angular/core";
import { CoreEvent } from "event-proxy-lib-src";
import { Subject } from "rxjs";

/**
 * Event bus for inter component/service communication in current module
 */
@Injectable({
  providedIn: "root"
})
export class EventBusService {
  /**
   * Event bus for inter component/service communication in current module
   */
	public EventBus = new Subject<CoreEvent>();

	/** Internal Event for shell to register qr login*/
	public OnDoneQrLogin = new Subject<void>();

	/** Event called when user logins using QR code */
	public DoneQrLogin(): void {
		this.OnDoneQrLogin?.next();
	}
}
