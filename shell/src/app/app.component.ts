import { Component } from "@angular/core";
import { environment } from "src/environments/environment";

/**
 * Component Placeholder
 */
@Component({
  selector: "app-root",
	template: `
	<div *ngIf=\"EnableQrLogin\">
		<shell-qr-login-component></shell-qr-login-component>
	</div>
	`,
})
export class AppComponent {
	public EnableQrLogin = false;

	public async ngOnInit(): Promise<void> {
		this.EnableQrLogin = environment.qrLoginEnable;
	}
}
