import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { EventIds, EventProxyLibService, LoginSuccess, ValidationStatus } from 'event-proxy-lib-src';

export const tokenConst = '0x125';

export const eventProxyServiceMock: Partial<EventProxyLibService> = {
  LogIn(ts: string, signature: string): Observable<ValidationStatus> {
    return new Observable(sub => {

      const gatewayLoginResponse = new LoginSuccess();
      gatewayLoginResponse.EventId = EventIds.LoginSuccess;
      gatewayLoginResponse.Token = tokenConst;
      gatewayLoginResponse.TokenBegins = ts;
      gatewayLoginResponse.TokenExpires = moment(ts).add(1, 'hours').toISOString();

      const responseStatus = new ValidationStatus();
      responseStatus.HttpResult = new HttpResponse({
        status: 200,
        body: gatewayLoginResponse
      });

      sub.next(responseStatus);

      sub.complete();
    })
  }
};
