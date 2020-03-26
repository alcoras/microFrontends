import { Component, OnDestroy } from '@angular/core';

import { Observable, Subscription } from 'rxjs';

import { uParts } from '@uf-shared-models/event';
import { EventProxyLibService } from '@uf-shared-libs/event-proxy-lib';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {

  private subs: Subscription = new Subscription();
  private obs: Observable<any>;
  private title = 'personnel';

  constructor(
    private eProxyService: EventProxyLibService) {
    const sub = eProxyService.StartQNA(uParts.Personnel).subscribe
    (
      (value: any) => {},
      (error: any) => {},
      () => {},
    );

    this.subs.add(sub);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
