import { Component, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { environment } from "../environments/environment";
import { EventBusService } from "./services/EventBusService";

@Component({
  selector: "app-root",
  templateUrl: "./MaterialsReceiptsView.html",
  styleUrls: ["./MaterialsReceiptsStyle.scss"],
})
export class MaterialsReceiptsComponent implements OnDestroy {

  public MaterialReceiptsDataTabDisabled = true;
  public ActiveTabIndex = 3;
  public languages = ["en", "lt", "ru", "ua"];

  private subscriptionList = new Subscription();

  public constructor(private eventBus: EventBusService) {
		this.subscriptionList.add(this.eventBus.OnMaterialReceiptSelected.subscribe(() => {
			this.ActiveTabIndex = 4;
			this.MaterialReceiptsDataTabDisabled = false;
		}));
  }

  public ngOnDestroy(): void {
		this.subscriptionList.unsubscribe();
  }

  public onLanguageSelected(languageSelected: string): void {
		environment.currentLanguage = languageSelected;
  }
}
