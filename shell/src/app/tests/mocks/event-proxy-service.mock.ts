import * as moment from 'moment';
import { BackendToFrontendEvent, EventIds, EventProxyLibService, LoginSuccess, ValidationStatus } from 'event-proxy-lib-src';

export const tokenConst = '0x125';

export const eventProxyServiceMock: Partial<EventProxyLibService> = {
  LogInAsync(ts: string, signature: string): Promise<ValidationStatus<BackendToFrontendEvent>> {
    const gatewayLoginResponse = new LoginSuccess();
    gatewayLoginResponse.EventId = EventIds.LoginSuccess;
    gatewayLoginResponse.Token = tokenConst;
    gatewayLoginResponse.TokenBegins = ts;
    gatewayLoginResponse.TokenExpires = moment(ts).add(1, 'hours').toISOString();

    const responseStatus = new ValidationStatus<BackendToFrontendEvent>();
    responseStatus.Result = gatewayLoginResponse;
    return Promise.resolve(responseStatus);
  }
};

