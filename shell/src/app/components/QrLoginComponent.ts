import { Component } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { EventProxyLibService, LoginSuccess, QRCodeInformation } from 'event-proxy-lib-src';
import { AuthenticationService } from '../services/AuthenticationService';
import { EventBusService } from '../services/EventBusService';

export function delay(ms: number): Promise<void> {
  return new Promise( resolve => setTimeout(resolve, ms) );
}

@Component({
  selector: 'shell-qr-login-component',
  templateUrl: './QrLoginView.html',
})
export class QrLoginComponent {
  public ImageUrl: SafeUrl;
  constructor(
		private sanitizer: DomSanitizer,
		private eventProxyService: EventProxyLibService,
		private authService: AuthenticationService,
		private eventBus: EventBusService) { }

  public async ngOnInit(): Promise<void> {
		const qrRequest = await this.eventProxyService.QrRequestAsync();

		if (qrRequest.HasErrors()) {
			throw new Error(qrRequest.ErrorList.toString());
		}

		const qrEvent = qrRequest.Result as QRCodeInformation;
		const objectURL = 'data:image/jpeg;base64,' + qrEvent.QRCodeImage;
		this.ImageUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);

		console.log("Waiting for 1 minute for user to login using phone app...");
		const checkRequest = await this.eventProxyService.QrCheckAsync(qrEvent.QRCodeMessage);

		if (checkRequest.HasErrors()) {
			throw new Error(qrRequest.ErrorList.toString());
		}

		const loginSuccess = checkRequest.Result as LoginSuccess;

		this.authService.SetSession(loginSuccess);

		this.eventBus.DoneQrLogin();
	}
}
