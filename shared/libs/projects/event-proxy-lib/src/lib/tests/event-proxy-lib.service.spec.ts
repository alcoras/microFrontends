/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsdoc/require-jsdoc */
import { TestBed } from '@angular/core/testing';
import { EventProxyLibService } from '../event-proxy-lib.service';
import { ResponseStatus } from "../ResponseStatus";
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { uEventsIds, uEvent } from '../models/event';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { of, Observable } from 'rxjs';
import { EnvironmentService } from '../services/EnvironmentService';

/**
 * Returns promise after ms
 * @param ms miliseconds
 * @returns Promise
 */
function delay(ms: number): Promise<any> {
  return new Promise( resolve => setTimeout(resolve, ms) );
}

const envPrefix = '__env';
const TestSourceId = '1000';
const backendURL = 'localhost';
const backendPath = '/newEvents';
const backendPort = '54366';
const URL = `http://${backendURL}:${backendPort}${backendPath}`;

window[envPrefix] = window[envPrefix] || {};

// eslint-disable-next-line @typescript-eslint/camelcase
window[envPrefix].one_language = false;
// API url
window[envPrefix].url = 'http://' + backendURL;
window[envPrefix].apiGatewayUrl = window[envPrefix].url;
window[envPrefix].apiGatewayPort = backendPort;

class TestEvent extends uEvent {

}
/* tslint:enable */

// tslint:disable-next-line: no-big-function
describe('EventProxyLibService', () => {
  let service: EventProxyLibService;
  let httpTestingController: HttpTestingController;

  beforeEach(
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
    service.EndListeningToBackend();
    httpTestingController.verify();
  });

  describe('StartQNA', () => {

    it('on init status should be false', () => {
      expect(service.Status).toBeFalse();
    });

    it('on StartQNA status should be true', (done) => {

      const tempStatus = new ResponseStatus();
      tempStatus.HttpResult = new HttpResponse({status: 200});

      spyOn(service, 'GetLastEvents')
        .and
        .returnValue(of(tempStatus));

      service.StartQNA(TestSourceId).subscribe(
        () => {
          expect(service.Status).toBeTrue();
          service.EndListeningToBackend();
          done();
        }
      );
    });

    it('after EndListeningToBackend status should be false', (done) => {

      const tempStatus = new ResponseStatus();
      tempStatus.HttpResult = new HttpResponse({status: 200});
      function fakeGetLastEvents(): Observable<ResponseStatus> {
        return new Observable( sub => {
          setTimeout(() => {
            sub.next(tempStatus);
            sub.complete();
          }, 100);
        });
      }

      spyOn(service, 'GetLastEvents')
        .and
        .callFake(() => fakeGetLastEvents());

      service.StartQNA(TestSourceId).subscribe(
        () => {
          service.EndListeningToBackend();
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
      const tempStatus = new ResponseStatus();
      tempStatus.HttpResult = new HttpResponse({status: 200});

      function fakeGetLastEvents(): Observable<ResponseStatus> {
        return new Observable(sub => {
          setTimeout(() => {
            sub.next(tempStatus);
            requestsSent++;
            sub.complete();
          }, responseTimeMs);
        });
      }

      async function parseAsync(): Promise<void> {
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
      service.EndListeningToBackend();
      done();
    });

    it('testing StartQNA', async (done) => {
      const tempStatus = new ResponseStatus();
      tempStatus.HttpResult = new HttpResponse({status: 200});
      const getLastEventsSpy = spyOn(service, 'GetLastEvents')
        .and
        .returnValue( of (tempStatus) );

      service.StartQNA(TestSourceId).subscribe(
        (res) => {
          expect(res.HttpResult.status).toBe(200);
          service.EndListeningToBackend();
          expect(getLastEventsSpy).toHaveBeenCalled();
          done();
        }
      );

    });

    it('testing url which should have been set up in constructor', () => {
      expect(service.ApiGatewayURL).toBe(`http://${backendURL}:${backendPort}`);
    });
  });

  describe('errors', () => {

    it('should throw if apiGatewayURL is undefined', () => {
      service.ApiGatewayURL = '';

      expect( () => service.DispatchEvent(null).toPromise() ).toThrow();

    });
  });

  describe('common spec for all requests', () => {

    it('testing method', () => {
      service.ConfirmEvents(TestSourceId, [], true).subscribe(
        (res) => {
          expect(res.HttpResult.status).toBe(200);
        }
      );

      const req = httpTestingController.expectOne(URL);

      expect(req.request.method).toEqual('POST');

      req.flush('');
    });

    it('testing headers', () => {
      service.ConfirmEvents(TestSourceId, [], true).toPromise();

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
        Token: undefined
      };

      service.ConfirmEvents(TestSourceId, [], true).subscribe(
        (res) => {
          expect(res.HttpResult.status).toBe(200);
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
        Token: undefined
      };

      service.ConfirmEvents(TestSourceId, testBody.Ids).subscribe(
        (res) => {
          expect(res.HttpResult.status).toBe(200);
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
        events: [new TestEvent()],
        Token: undefined
      };

      service.DispatchEvent(new TestEvent()).subscribe(
        (res) => {
          expect(res.HttpResult.status).toBe(200);
        }
      );

      const req = httpTestingController.expectOne(URL);
      expect(req.request.body).toEqual(testBody);

      req.flush('');
    });

    it('sending many events', () => {

      const testBody = {
        EventID: uEventsIds.RegisterNewEvent,
        events: [new TestEvent(), new TestEvent(), new TestEvent() ],
        Token: undefined
      };

      service.DispatchEvent([new TestEvent(), new TestEvent(), new TestEvent()]).subscribe(
        (res) => {
          expect(res.HttpResult.status).toBe(200);
        }
      );

      const req = httpTestingController.expectOne(URL);
      expect(req.request.body).toEqual(testBody);

      req.flush('');
    });

  });

  describe('GetLastEvents', () => {

    const testBody = {
      EventID: uEventsIds.GetNewEvents,
      SourceId: TestSourceId,
      Token: undefined
    };

    it('testing body', () => {
      service.GetLastEvents(TestSourceId).subscribe(
        (res) => {
          expect(res.HttpResult.status).toBe(200);
        }
      );

      const req = httpTestingController.expectOne(URL);

      expect(req.request.body).toEqual(testBody);

      req.flush('');
    });

  });

});
