import { Component, ElementRef } from '@angular/core';

import { EventProxyLibService } from "event-proxy-lib";
import { Observable, Subscription } from 'rxjs';

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
    let sub = eProxyService.qnaWithTheGateway.subscribe
    (
      (value:any) => {},
      (error:any) => {},
      () => {},
    )

    this.subs.add(sub);
  }

  ngAfterViewInit()
  {
  }

  onClick(event)
  {
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.subs.unsubscribe();
  }
}
