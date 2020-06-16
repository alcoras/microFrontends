import { EventProxyLibService } from '@uf-shared-libs/event-proxy-lib';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginSuccess } from '@uf-shared-events/index';
import { uEventsIds } from '@uf-shared-models/event';
import * as moment from 'moment';

export const tokenConst = '0x125';

export const eventProxyServiceMock: Partial<EventProxyLibService> = {
  LogIn(ts: string, signature: string): Observable<HttpResponse<LoginSuccess>> {
    return new Observable(sub => {

      const gatewayLoginResponse = new LoginSuccess();
      gatewayLoginResponse.EventId = uEventsIds.LoginSuccess;
      gatewayLoginResponse.Token = tokenConst;
      gatewayLoginResponse.TokenBegins = ts;
      gatewayLoginResponse.TokenExpires = moment(ts).add(1, 'hours').toISOString();


      sub.next(new HttpResponse({
        status: 200,
        body: gatewayLoginResponse
      }));

      sub.complete();
    })
  }
};
