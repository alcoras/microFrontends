/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsdoc/require-jsdoc */
import { TestBed } from "@angular/core/testing";
import { EventProxyLibService } from "../EventProxyLibService";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { EnvironmentService } from "../services/EnvironmentService";
import { CoreEvent } from "../DTOs/CoreEvent";
import { BackendToFrontendEvent } from "../DTOs/BackendEvents/BackendToFrontendEvent";
import { ValidationStatus } from "../DTOs/ValidationStatus";
import { EventIds } from "../DTOs/EventIds";
import { ErrorMessage } from "../DTOs/Errors";

/**
 * Returns promise after ms
 * @param ms miliseconds
 * @returns Promise
 */
function delay(ms: number): Promise<any> {
  return new Promise( resolve => setTimeout(resolve, ms) );
}
jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
const envPrefix = "__env";
const TestSourceId = "1000";
const backendURL = "localhost";
const backendPath = "/newEvents";
const backendPort = "54366";
const URL = `http://${backendURL}:${backendPort}${backendPath}`;

window[envPrefix] = window[envPrefix] || {};

window[envPrefix].one_language = false;
// API url
window[envPrefix].url = "http://" + backendURL;
window[envPrefix].apiGatewayUrl = window[envPrefix].url;
window[envPrefix].apiGatewayPort = backendPort;

class TestEvent extends CoreEvent {

}

describe("EventProxyLibService", () => {
  let service: EventProxyLibService;
  let httpTestingController: HttpTestingController;

  beforeEach(
    () => {
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

  describe("PerformResponseCheck", () => {

    it("fail if unregonized event id", () => {
      const testEvent = new TestEvent();

      const events: BackendToFrontendEvent = {
        "EventId" : 4987997879,
        "Events": [ testEvent ]
      };

      const tempStatus = new ValidationStatus<BackendToFrontendEvent>();
      tempStatus.Result = events;

      expect(() => service.PerformResponseCheck(tempStatus))
      .toThrowError(ErrorMessage.UnrecognizedEventId);
    });

    it("fail if token Failure", () => {
      const testEvent = new TestEvent();

      const events: BackendToFrontendEvent = {
        "EventId" : EventIds.TokenFailure,
        "Events": [ testEvent ]
      };

      const tempStatus = new ValidationStatus<BackendToFrontendEvent>();
      tempStatus.Result = events;

      expect(() => service.PerformResponseCheck(tempStatus))
      .toThrowError(ErrorMessage.TokenFailure);
    });
  });

  describe("InitializeConnectionToBackend", () => {

    it("on init status should be false", () => {
      expect(service.Status).toBeFalse();
    });

    it("testing sendMessage fail states", async (done) => {
      const eventProxyLibService = TestBed.inject(EventProxyLibService);
      eventProxyLibService.TimeoutMs = 10;
      eventProxyLibService.DelayMs = 0;
      eventProxyLibService.BackOffMS = 0;
      eventProxyLibService.Retries = 0;

      const url = "http://akunamatata";
      eventProxyLibService.ApiGatewayURL = url;
      eventProxyLibService.InitializeConnectionToBackend(TestSourceId).subscribe(
        // we should fail by connecting nowhere
        () => {
          fail();
        },
        (error: ValidationStatus<BackendToFrontendEvent>) => {
          expect(error.HasErrors()).toBeTrue();
          done();
        }
      );

      const req = httpTestingController.expectOne(url + "/newEvents");
      req.error(new ErrorEvent("gg"));
    });

    it("on InitializeConnectionToBackend status should be true", (done) => {

      const tempStatus = new ValidationStatus<BackendToFrontendEvent>();
      tempStatus.Result = { EventId: 123 };

      spyOn(service, "GetLastEventsAsync")
        .and
        .returnValue(Promise.resolve(tempStatus));

      service.InitializeConnectionToBackend(TestSourceId).subscribe(
        () => {
          expect(service.Status).toBeTrue();
          service.EndListeningToBackend();
          done();
        }
      );
    });

    it("after EndListeningToBackend status should be false", (done) => {

      const tempStatus = new ValidationStatus<BackendToFrontendEvent>();
      tempStatus.Result = { EventId: 123};

      function fakeGetLastEvents(): Promise<ValidationStatus<BackendToFrontendEvent>> {
        return new Promise( (resolve => {
          setTimeout(() => {
            resolve(tempStatus);
          }, 100);
        }));
      }

      spyOn(service, "GetLastEventsAsync")
        .and
        .callFake(() => fakeGetLastEvents());

      service.InitializeConnectionToBackend(TestSourceId).subscribe(
        () => {
          service.EndListeningToBackend();
          expect(service.Status).toBeFalse();
          done();
        }
      );
    });

    // TODO: convert to marble test
    // https://rxjs-dev.firebaseapp.com/guide/testing/internal-marble-tests
    it("emulating work", async (done) => {
      const responseTimeMs = 100;
      const parsingTimeMs = 200;
      const emulationTimeMs = 600;
      let requestsSent = 0;
      let requestsParsed = 0;
      let doneParsing = 0;
      let launchedParsing = 0;
      // tslint:disable-next-line: completed-docs
      const tempStatus = new ValidationStatus<BackendToFrontendEvent>();
      tempStatus.Result = { EventId: 123 };

      function fakeGetLastEvents(): Promise<ValidationStatus<BackendToFrontendEvent>> {
        return new Promise((resolve) => {
          setTimeout(() => {
            requestsSent++;
            resolve(tempStatus);
          }, responseTimeMs);
        });
      }

      async function parseAsync(): Promise<void> {
        launchedParsing++;
        await delay(parsingTimeMs);
        doneParsing++;
      }

      spyOn(service, "GetLastEventsAsync")
        .and
        .callFake(() => fakeGetLastEvents());

      service.InitializeConnectionToBackend(TestSourceId).subscribe(
        () => {
          parseAsync();
          requestsParsed++;
        }
      );

      await delay(emulationTimeMs);
      expect(requestsSent + 1).toBe(emulationTimeMs / responseTimeMs, "requests in emulation time");
      // + 1 for requests because 100 ms delay thus always one less request
      expect(requestsParsed).toBe(requestsSent, "Parsed should equal reqeusts sent");
      expect(launchedParsing).toBe(requestsSent, "launchedParsing should be 2");
      expect(doneParsing).toBe( (emulationTimeMs - responseTimeMs - parsingTimeMs) / responseTimeMs);
      service.EndListeningToBackend();
      done();
    });

    it("testing InitializeConnectionToBackend", async (done) => {
      const tempStatus = new ValidationStatus<BackendToFrontendEvent>();
      tempStatus.Result = { EventId: 123 };

      const getLastEventsSpy = spyOn(service, "GetLastEventsAsync")
        .and
        .returnValue( Promise.resolve(tempStatus) );

      service.InitializeConnectionToBackend(TestSourceId).subscribe(
        (res) => {
          expect(res.HasErrors()).toBeFalse();
          service.EndListeningToBackend();
          expect(getLastEventsSpy).toHaveBeenCalled();
          done();
        }
      );

    });

    it("testing url which should have been set up in constructor", () => {
      expect(service.ApiGatewayURL).toBe(`http://${backendURL}:${backendPort}`);
    });
  });

  describe("errors", () => {

    it("should throw if apiGatewayURL is undefined", () => {
      service.ApiGatewayURL = "";

      expectAsync(service.DispatchEventAsync(null)).toBeRejected();

    });
  });

  describe("common spec for all requests", () => {

    it("testing method", () => {
      service.ConfirmEventsAsync(TestSourceId, [], true);

      const req = httpTestingController.expectOne(URL);

      expect(req.request.method).toEqual("POST");

      req.flush("");

    });

    it("testing headers", () => {
      service.ConfirmEventsAsync(TestSourceId, [], true);

      const req = httpTestingController.expectOne(
        (res) => res.headers.has("Content-Type")
      );

      expect(req.request.method).toEqual("POST");

      req.flush("");
    });

  });

  describe("ConfirmEventsAsync", () => {

    it("testing content MarkAllReceived=true Ids:[] ", () => {
      const testBody = {
        EventId: EventIds.FrontEndEventReceived,
        SourceId: TestSourceId,
        Ids: [],
        MarkAllReceived: true,
        Token: undefined
      };

      service.ConfirmEventsAsync(TestSourceId, [], true);

      const req = httpTestingController.expectOne(URL);
      expect(req.request.body).toEqual(testBody);

      req.flush("");
    });

    it("testing content MarkAllReceived=false Ids:[10, 20] ", () => {
      const testBody = {
        EventId: EventIds.FrontEndEventReceived,
        SourceId: TestSourceId,
        Ids: [10, 20, 30],
        MarkAllReceived: false,
        Token: undefined
      };

      service.ConfirmEventsAsync(TestSourceId, testBody.Ids);

      const req = httpTestingController.expectOne(URL);
      expect(req.request.body).toEqual(testBody);

      req.flush("");
    });
  });

  describe("DispatchEventAsync", () => {

    it("sending one event ", () => {

      const testBody = {
        EventId: EventIds.RegisterNewEvent,
        Events: [new TestEvent()],
        Token: undefined
      };

      service.DispatchEventAsync(new TestEvent());

      const req = httpTestingController.expectOne(URL);
      expect(req.request.body).toEqual(testBody);

      req.flush("");
    });

    it("sending many events", () => {

      const testBody = {
        EventId: EventIds.RegisterNewEvent,
        Events: [new TestEvent(), new TestEvent(), new TestEvent() ],
        Token: undefined
      };

      service.DispatchEventAsync([new TestEvent(), new TestEvent(), new TestEvent()]);

      const req = httpTestingController.expectOne(URL);
      expect(req.request.body).toEqual(testBody);

      req.flush("");
    });

  });

  describe("GetLastEventsAsync", () => {

    const testBody = {
      EventId: EventIds.GetNewEvents,
      SourceId: TestSourceId,
      Token: undefined
    };

    it("testing body", () => {
      service.Retries = 0;
      service.GetLastEventsAsync(TestSourceId);

      const req = httpTestingController.expectOne(URL);

      expect(req.request.body).toEqual(testBody);

      req.flush("");
    });

  });

});
