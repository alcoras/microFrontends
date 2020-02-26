import { Component } from '@angular/core';

import { EventProxyLibService } from "event-proxy-lib";
import { Observable, Subscription } from 'rxjs';
import { uParts } from "@protocol-shared/models/event";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  private subs: Subscription = new Subscription();
  private obs:Observable<any>;
  private title = 'personnel';

  constructor(
    private eProxyService: EventProxyLibService)
  {
    let sub = eProxyService.startQNA(uParts.Personnel).subscribe
    (
      (value:any) => {},
      (error:any) => {},
      () => {},
    )

    this.subs.add(sub);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
