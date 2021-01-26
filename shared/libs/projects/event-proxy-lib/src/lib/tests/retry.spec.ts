import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { EventProxyLibService } from '../EventProxyLibService';
import { EnvironmentService } from '../services/EnvironmentService';
import { CoreEvent } from '../DTOs/CoreEvent';
import { RetryWithBackoff, errorMsg } from '../retry/RetryWithBackoff';
import { timeout } from 'rxjs/operators';
import { ValidationStatus } from '../DTOs/ValidationStatus';
import { BackendToFrontendEvent } from '../DTOs/BackendEvents/BackendToFrontendEvent';

class TestEvent extends CoreEvent {

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

  it('retry with backoff within httpclient', async (done) => {
    const retries = 2;
    const spy = spyOn(httpClient, 'post').and.callThrough();

    const request = httpClient.post('http://funnybot:2000','', )
      .pipe(
        timeout(100),
        RetryWithBackoff(0, retries, 0),
      ).toPromise();

    expect(spy).toHaveBeenCalled();

    request.catch((error: string) => {
      expect(error).toEqual(errorMsg(retries));
      done();
    })
  });

  it('Retry with backoff within event proxy lib', async (done) => {
    const retries = 2;

    eventProxyLibService.TimeoutMs = 10;
    eventProxyLibService.DelayMs = 0;
    eventProxyLibService.BackOffMS = 0;
    eventProxyLibService.Retries = retries;
    eventProxyLibService.DispatchEventAsync(new TestEvent())
      .then(()=> {
        fail();
      })
      .catch((res: ValidationStatus<BackendToFrontendEvent>) => {
        expect(res.HasErrors()).toBeTrue();
        expect(res.ErrorList.toString()).toEqual(errorMsg(retries));
        done();
    })
  });
})
