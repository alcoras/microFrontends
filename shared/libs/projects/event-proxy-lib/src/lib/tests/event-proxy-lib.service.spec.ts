import { TestBed } from '@angular/core/testing';
import { EventProxyLibService } from '../event-proxy-lib.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { uEventsIds, uEvent } from '../models/event';
import { HttpResponse } from '@angular/common/http';
import { of, Observable } from 'rxjs';
import { EnvironmentService } from '../services/environment.service';

/**
 * Returns promise after ms
 * @param ms miliseconds
 * @returns Promise
 */
function delay(ms: number) {
  return new Promise( resolve => setTimeout(resolve, ms) );
}

/* tslint:disable */
const TestSourceId = '1000';
const backendURL = 'localhost';
const backendPath = '/newEvents';
const backendPort = '54366';
const URL = `http://${backendURL}:${backendPort}${backendPath}`;

window['__env'] = window['__env'] || {};

window['__env'].one_language = false;
// API url
window['__env'].url = 'http://' + backendURL;
window['__env'].apiGatewayUrl = window['__env'].url;
window['__env'].apiGatewayPort = backendPort;

class TestEvent extends uEvent {

}
/* tslint:enable */

// tslint:disable-next-line: no-big-function
describe('EventProxyLibService', () => {
  let service: EventProxyLibService;
  let httpTestingController: HttpTestingController;

  beforeEach
  (
    async () => {
      TestBed.configureTestingModule({
        providers: [EventProxyLibService, EnvironmentService],
        imports: [HttpClientTestingModule]
      });

      service = TestBed.inject(EventProxyLibService);
      httpTestingController = TestBed.inject(HttpTestingController);
    }
  );

  afterEach(() => {
    service.EndQNA();
    httpTestingController.verify();
  });

  describe('StartQNA', () => {

    it('on init status should be false', () => {
      expect(service.Status).toBeFalse();
    });

    it('on StartQNA status should be true', (done) => {

      spyOn(service, 'GetLastEvents')
        .and
        .returnValue(of(new HttpResponse({status: 200})));

      service.StartQNA(TestSourceId).subscribe(
        () => {
          expect(service.Status).toBeTrue();
          service.EndQNA();
          done();
        }
      );
    });

    it('after EndQNA status should be false', (done) => {
      // tslint:disable-next-line: completed-docs
      function fakeGetLastEvents(): Observable<HttpResponse<any>> {
        return new Observable( sub => {
          setTimeout(() => {
            sub.next(new HttpResponse({status: 200}));
            sub.complete();
          }, 100);
        });
      }

      spyOn(service, 'GetLastEvents')
        .and
        .callFake(() => fakeGetLastEvents());

      service.StartQNA(TestSourceId).subscribe(
        () => {
          service.EndQNA();
          expect(service.Status).toBeFalse();
          done();
        }
      );
    });

    // TODO: convert to marble test
    // https://rxjs-dev.firebaseapp.com/guide/testing/internal-marble-tests
    it('emulating work', async (done) => {
      const responseTimeMs = 100;
      const parsingTimeMs = 200;
      const emulationTimeMs = 600;
      let requestsSent = 0;
      let requestsParsed = 0;
      let doneParsing = 0;
      let launchedParsing = 0;
      // tslint:disable-next-line: completed-docs
      function fakeGetLastEvents(): Observable<HttpResponse<any>> {
        return new Observable(sub => {
          setTimeout(() => {
            sub.next(new HttpResponse({status: 200}));
            requestsSent++;
            sub.complete();
          }, responseTimeMs);
        });
      }

      // tslint:disable-next-line: completed-docs
      async function parseAsync() {
        launchedParsing++;
        await delay(parsingTimeMs);
        doneParsing++;
      }

      spyOn(service, 'GetLastEvents')
        .and
        .callFake(() => fakeGetLastEvents());

      service.StartQNA(TestSourceId).subscribe(
        () => {
          parseAsync();
          requestsParsed++;
        }
      );

      await delay(emulationTimeMs);
      expect(requestsSent + 1).toBe(emulationTimeMs / responseTimeMs, 'requests in emulation time');
      // + 1 for requests because 100 ms delay thus always one less request
      expect(requestsParsed).toBe(requestsSent, 'Parsed should equal reqeusts sent');
      expect(launchedParsing).toBe(requestsSent, 'launchedParsing should be 2');
      expect(doneParsing).toBe( (emulationTimeMs - responseTimeMs - parsingTimeMs) / responseTimeMs);
      service.EndQNA();
      done();
    });

    it('testing startQNA', async (done) => {
      const getLastEventsSpy = spyOn(service, 'GetLastEvents')
        .and
        .returnValue( of (new HttpResponse({status: 200})) );

      service.StartQNA(TestSourceId).subscribe(
        (res) => {
          expect(res.status).toBe(200);
          service.EndQNA();
          expect(getLastEventsSpy).toHaveBeenCalled();
          done();
        }
      );

    });

    it('testing url which should have been set up in constructor', () => {
      expect(service.ApiGatewayURL).toBe(`http://${backendURL}:${backendPort}`);
    });

    it('testing if env service load was correct', () => {
      expect(service.env.APIGatewayUrl).toBe(`http://${backendURL}`);
      expect(service.env.APIGatewayPort).toBe(backendPort);
    });

  });

  describe('errors', () => {

    it('should throw if apiGatewayURL is undefined', () => {
      service.ApiGatewayURL = '';

      expect( () => service.DispatchEvent(null).toPromise() ).toThrow();

    });

    it('handleErrors is triggered on error', () => {
      const spies: jasmine.Spy<any>[] = [];
      spies.push(spyOn<any>(service, 'handleErrors').and.callThrough());

      service.DispatchEvent(null).toPromise();
      httpTestingController.expectOne(URL).error(new ErrorEvent('Something went wrong'));

      spies.forEach(spy => {
        expect(spy).toHaveBeenCalled();
      });
    });

  });

  describe('common spec for all requests', () => {

    it('testing method', () => {
      service.ConfirmEvents(TestSourceId, [], true).subscribe(
        (res) => {
          expect(res.status).toBe(200);
        }
      );

      const req = httpTestingController.expectOne(URL);

      expect(req.request.method).toEqual('POST');

      req.flush('');
    });

    it('testing headers', () => {
      service.ConfirmEvents(TestSourceId, [], true).subscribe(
        (res) => {
          expect(res.status).toBe(200);
        }
      );

      const req = httpTestingController.expectOne(
        (res) => res.headers.has('Content-Type')
      );

      req.flush('');
    });

  });

  describe('ConfirmEvents', () => {

    it('testing content MarkAllReceived=true Ids:[] ', () => {
      const testBody = {
        EventID: uEventsIds.FrontEndEventReceived,
        SourceID: TestSourceId,
        Ids: [],
        MarkAllReceived: true,
      };

      service.ConfirmEvents(TestSourceId, [], true).subscribe(
        (res) => {
          expect(res.status).toBe(200);
        }
      );

      const req = httpTestingController.expectOne(URL);
      expect(req.request.body).toEqual(testBody);

      req.flush('');
    });

    it('testing content MarkAllReceived=false Ids:[10, 20] ', () => {
      const testBody = {
        EventID: uEventsIds.FrontEndEventReceived,
        SourceID: TestSourceId,
        Ids: [10, 20, 30],
        MarkAllReceived: false,
      };

      service.ConfirmEvents(TestSourceId, testBody.Ids).subscribe(
        (res) => {
          expect(res.status).toBe(200);
        }
      );

      const req = httpTestingController.expectOne(URL);
      expect(req.request.body).toEqual(testBody);

      req.flush('');
    });
  });

  describe('DispatchEvent', () => {

    it('sending one event ', () => {

      const testBody = {
        EventID: uEventsIds.RegisterNewEvent,
        events: [new TestEvent()]
      };

      service.DispatchEvent(new TestEvent()).subscribe(
        (res) => {
          expect(res.status).toBe(200);
        }
      );

      const req = httpTestingController.expectOne(URL);
      expect(req.request.body).toEqual(testBody);

      req.flush('');
    });

    it('sending many events', () => {

      const testBody = {
        EventID: uEventsIds.RegisterNewEvent,
        events: [new TestEvent(), new TestEvent(), new TestEvent() ]
      };

      service.DispatchEvent([new TestEvent(), new TestEvent(), new TestEvent()]).subscribe(
        (res) => {
          expect(res.status).toBe(200);
        }
      );

      const req = httpTestingController.expectOne(URL);
      expect(req.request.body).toEqual(testBody);

      req.flush('');
    });

  });

  describe('GetLastEvents', () => {

    const testBody = { EventID: uEventsIds.GetNewEvents, SourceId: TestSourceId };

    it('testing body', () => {
      service.GetLastEvents(TestSourceId).subscribe(
        (res) => {
          expect(res.status).toBe(200);
        }
      );

      const req = httpTestingController.expectOne(URL);

      expect(req.request.body).toEqual(testBody);

      req.flush('');
    });

  });

});
