import { EventProxyLibService } from '@uf-shared-libs/event-proxy-lib';
import { Observable, Subject } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { EventButtonPressed } from '@uf-shared-events/index';
import { uEvent, uEventsIds } from '@uf-shared-models/event';
import { EventResponse } from '@uf-shared-models/index';
import { repeat, takeUntil } from 'rxjs/operators';

/* tslint:disable */
export let eProxyServiceMock: Partial<EventProxyLibService>;
const currentLang = 'en';
const currentURL = 'localhost';
/* tslint:enable */

eProxyServiceMock = {
  env: {
    lang: currentLang,
    url: currentURL,
    apiGatewayUrl: currentURL,
    apiGatewayPort: 80,
    uf: {},
    loadConfig: () => {
      window['__env'] = window['__env'] || {};
      window['__env']['lang'] = currentLang;
    }
  },

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
