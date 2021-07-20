import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { EventProxyLibService, QRCodeInformation } from 'event-proxy-lib-src';
import { EventBusService } from '../services/EventBusService';
import { QRAuthenticationService } from '../services/QRAuthenticationService';

interface QrImageJson {
	image: string;
	qr: string;
}

@Component({
  selector: 'shell-qr-login-component',
  templateUrl: './QrLoginView.html',
})
export class QrLoginComponent {
  public ImageUrl: SafeUrl;
  constructor(
		private sanitizer: DomSanitizer,
		private eventProxyService: EventProxyLibService) { }

  public async ngOnInit(): Promise<void> {
		const qrRequest = await this.eventProxyService.QrRequestAsync();

		if (qrRequest.HasErrors()) {
			throw new Error(qrRequest.ErrorList.toString());
		}

		const qrEvent = qrRequest.Result as QRCodeInformation;
		const objectURL = 'data:image/jpeg;base64,' + qrEvent.QRCodeImage;
		this.ImageUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
	}
}
