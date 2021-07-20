import { Injectable } from "@angular/core";
import {
  CoreEvent,
  EnvironmentService,
  EventIds,
  EventProxyLibService,
  LoginSuccess,
	LoginRequest,
	QrLoginRequest,
	ValidationStatus,
	BackendToFrontendEvent,
	MicroFrontendInfo,
	MicroFrontendParts} from "event-proxy-lib-src";
import { EventBusService } from "./EventBusService";

@Injectable({
	providedIn: "root"
})
export class QRAuthenticationService {
	public SourceInfo: MicroFrontendInfo = MicroFrontendParts.FrontendShell;

	public constructor(private eventBusService: EventBusService, private environmentService: EnvironmentService, private eventProxyService: EventProxyLibService)
	{ }

	public async RequestQRCodeAsync(): Promise<ValidationStatus<BackendToFrontendEvent>> {
		const event = new QrLoginRequest(this.SourceInfo);

		var result = await this.eventProxyService.DispatchEventAsync(event);

		return result;
	}
}
