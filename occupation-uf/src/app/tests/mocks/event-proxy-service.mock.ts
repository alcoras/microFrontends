import { CoreEvent, EventProxyLibService, ValidationStatus } from 'event-proxy-lib-src';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';

export const eProxyServiceMock: Partial<EventProxyLibService> = {

  InitializeConnectionToBackend(sourceID: string) {
    return this.GetLastEvents(sourceID);
  },

  GetLastEvents(sourceID: string) {

    const responseStatus = new ValidationStatus();
    responseStatus.HttpResult = new HttpResponse<any>({status: 200, body: {
      Events: [ ],
      Ids: [123]
    }});

    return new Observable(
      (val) => {
        val.next(responseStatus);
        val.complete();
      }
    );
  },

  DispatchEventAsync(event: CoreEvent | CoreEvent[]) {
    const responseStatus = new ValidationStatus();
    responseStatus.HttpResult = new HttpResponse<any>({status: 200, body: {
      Events: [event ],
      Ids: [123]
    }});

    return new Observable(
      (val) => {
        val.next(responseStatus);
        val.complete();
      }
    );
  },

  ConfirmEventsAsync(srcId: string, idList?: number[], confirmAll = true) {
    return new Observable(
      (val) => {
        val.complete();
      }
    );
  }
};
