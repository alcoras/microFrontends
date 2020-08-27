import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { EventProxyLibService } from '../event-proxy-lib.service';
import { ResponseStatus } from "../ResponseStatus";
import { EnvironmentService } from '../services/EnvironmentService';
import { uEvent } from '../models/event';
import { retryWithBackoff, errorMsg } from '../retry/retry.pipe';
import { timeout } from 'rxjs/operators';

class TestEvent extends uEvent {

}

describe('rety with Backoff', () => {
  let httpClient: HttpClient;
  let eventProxyLibService: EventProxyLibService;

  beforeEach(
    () => {
      TestBed.configureTestingModule({
        providers: [
          HttpClient,
          EventProxyLibService,
          EnvironmentService],
        imports: [HttpClientModule]
      });

      eventProxyLibService = TestBed.inject(EventProxyLibService);
      httpClient = TestBed.inject(HttpClient);
    }
  );

  it('retry with backoff withing httpclient', async (done) => {
    const retries = 2;
    const spy = spyOn(httpClient, 'post').and.callThrough();

    const request = httpClient.post('http://funnybot:2000','', )
      .pipe(
        timeout(100),
        retryWithBackoff(0, retries, 0),
      ).toPromise();

    expect(spy).toHaveBeenCalled();

    request.catch((error: string) => {
      expect(error).toEqual(errorMsg(retries));
      done();
    })
  });

  it('Retry with backoff withing event proxy lib', async (done) => {
    const retries = 2;

    eventProxyLibService.Timeout = 10;
    eventProxyLibService.DelayMs = 0;
    eventProxyLibService.BackOffMS = 0;
    eventProxyLibService.Retries = retries;
    eventProxyLibService.DispatchEvent(new TestEvent()).toPromise()
      .then(()=> {
        fail();
      })
      .catch((res: ResponseStatus) => {
        expect(res.Failed).toBeTrue();
        expect(res.Error).toEqual(errorMsg(retries));
        done();
    })
  });
})
