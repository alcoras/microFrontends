import { TestBed } from '@angular/core/testing';
import { EventProxyLibService } from '../event-proxy-lib.service';
import { EnvService } from '../env/env.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { uEventsIds, uEvent } from '../models/event';
import { HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';

/* tslint:disable */
const TestSourceId = '1000';
const backendURL = 'localhost';
const backendPath = '/newEvents';
const URL = backendURL + backendPath;

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
        providers: [EventProxyLibService, EnvService],
        imports: [HttpClientTestingModule]
      });

      service = TestBed.inject(EventProxyLibService);
      service.ChangeApiGatewayURL(backendURL);
      httpTestingController = TestBed.inject(HttpTestingController);
    }
  );

  afterEach(() => {
    httpTestingController.verify();
  });

  describe('StartQNA', () => {

    it('testing startQNA', async (done) => {
      const getLastEventsSpy = spyOn(service, 'GetLastEvents').and
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