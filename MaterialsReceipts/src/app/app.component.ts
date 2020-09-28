import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { environment } from '../environments/environment';
import { EventBusService } from './services/EventBus.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  styles: [`
    :host ::ng-deep .p-datatable .p-datatable-thead > tr > th {
        position: -webkit-sticky;
        position: sticky;
        top: 10px;
    }

    @media screen and (max-width: 64em) {
        :host ::ng-deep .p-datatable .p-datatable-thead > tr > th {
            top: 99px;
        }
    }
  `]
})
export class AppComponent implements OnDestroy {

  public MaterialReceiptsDataTabDisabled = true;
  public ActiveTabIndex = 0;
  public languages = ['en', 'lt', 'ru', 'ua'];

  private subscriptionList = new Subscription();

  public constructor(private eventBus: EventBusService) {
    this.subscriptionList.add(this.eventBus.OnMaterialReceiptSelected.subscribe(() => {
      this.ActiveTabIndex = 1;
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
