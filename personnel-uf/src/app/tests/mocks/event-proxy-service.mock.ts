import { EventProxyLibService } from '@uf-shared-libs/event-proxy-lib';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { uEvent } from '@uf-shared-models/event';

/* tslint:disable */
export let eProxyServiceMock: Partial<EventProxyLibService>;
const currentLang = 'en';
const currentURL = 'localhost';
/* tslint:enable */

eProxyServiceMock = {

  StartQNA(sourceID: string) {
    return this.GetLastEvents(sourceID);
  },

  GetLastEvents(sourceID: string) {
    return new Observable(
      (val) => {
        val.next(new HttpResponse<any>({status: 200, body: {
          Events: [],
          Ids: [123]
        }}));
        val.complete();
      }
    );
  },

  DispatchEvent(event: uEvent | uEvent[]) {
    return new Observable(
      (val) => {
        val.next(new HttpResponse<any>({status: 200, body: {
          Events: [event],
          Ids: [123]
        }}));
        val.complete();
      }
    );
  },

  ConfirmEvents(srcId: string, idList?: number[], confirmAll = true) {
    return new Observable(
      (val) => {
        val.complete();
      }
    );
  }
};
