import { TestBed } from '@angular/core/testing';
import { SubscibeToEvent } from '@uf-shared-events/index';
import { uEvent, uEventsIds } from '@uf-shared-models/event';
import { EventProxyLibService, EventProxyLibModule } from '@uf-shared-libs/event-proxy-lib/';
import { APIGatewayResponse, EventResponse } from '@uf-shared-models/index';
import { ResponseStatus } from '@uf-shared-libs/event-proxy-lib/lib/ResponseStatus';
import { BackendPort, BackendURL } from './helpers/helpers';

/**
 * generates random number
 * @param max max value
 * @param min min value (default 1)
 * @returns random number
 */
function getRandomInt(max: number, min = 1): number {
  return Math.floor(Math.random() * Math.floor(max-min) + min);
}

/**
 * Returns promise after ms
 * @param ms miliseconds
 * @returns Promise
 */
function delay(ms: number): Promise<void> {
  return new Promise( resolve => setTimeout(resolve, ms) );
}

// TODO: these tests should be in backend or these are integration tests
// TODO: test with angular tests too (httpTestModule, to test requests)

/**
 * Test event
 */
class TestEvent extends uEvent {
}

for (let i = 0; i < 1; i++) {
describe('EventProxyLibService', () => {
    const httpErrorMsg = 'HTTP response with failure.';
    const defaultEventsTimeoutMs = 5500;
    const awaitAfterSendingEvent = 500;
    const backendURL = BackendURL;
    const backendPort = BackendPort;
    const tEvent = new TestEvent();
    tEvent.EventId = 1000;
    const testinID = '10';
    const testinName = 'testing';
    let service: EventProxyLibService;
    const serviceList: EventProxyLibService[] = new Array(3);

    beforeEach(
      async () => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 20 * 1000;
        window['__env'] = window['__env'] || {};

        // eslint-disable-next-line @typescript-eslint/camelcase
        window['__env'].one_language = false;
        // API url
        window['__env'].url = 'http://' + backendURL;
        window['__env'].apiGatewayUrl = window['__env'].url;
        window['__env'].apiGatewayPort = backendPort;

        TestBed.configureTestingModule({
          providers: [EventProxyLibService],
          imports: [EventProxyLibModule]
        });

        service = TestBed.inject(EventProxyLibService);
        service.ApiGatewayURL = backendURL;
        service.Retries = 0;
        await service.ConfirmEvents(testinID, [], true).toPromise();

        serviceList.forEach(async element => {
          element = TestBed.inject(EventProxyLibService);
          element.ApiGatewayURL = backendURL;
          await element.ConfirmEvents(testinID, [], true).toPromise();
        });

        tEvent.SourceId = testinID;
      }
    );

    afterEach(async () => {
        service.EndListeningToBackend();
        await service.ConfirmEvents(testinID, [], true).toPromise();

        serviceList.forEach(async (element) => {
          element.EndListeningToBackend();
          await element.ConfirmEvents(testinID, [], true).toPromise();
        });
      }
    );

    it('should init', () => {
      expect(service).toBeTruthy();
    });

    describe("InitializeConnectionToBackend tests", () => {

      xit("should not be sent to parse events", async (done) => {
        /**
         * Test
         * @param eventList Events
         * @returns Promise
         */
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        function eventParserMockAsync(eventList: uEvent[] | uEvent): Promise<void> {
          done.fail();
          return Promise.resolve();
        }

        service.InitializeConnectionToBackend(testinID,
          eventParserMockAsync,
          service.PerformResponseCheck);

        await delay(200);
        done();
      });

      xit("should pass event", async (done) => {
        const waitForEventId = getRandomInt(500);
        /**
         * Test
         * @param eventList Events
         * @returns Promise
         */
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        function eventParserMockAsync(eventList: uEvent[] | uEvent): Promise<void> {
          console.log(eventList);
          expect([].concat(eventList)[0].EventId).toEqual(waitForEventId);
          done();
          return Promise.resolve();
        }

        // 1. Subscribe to event
        const subEvent = new SubscibeToEvent(testinID, [[waitForEventId, 0, 0]], true);
        subEvent.SourceName = testinName;
        await service.DispatchEvent(subEvent).toPromise();

        // TODO: eventually it should wait till someone subscribed to it.
        await delay(awaitAfterSendingEvent);
        // 2. Fire event
        tEvent.EventId = waitForEventId;
        await service.DispatchEvent(tEvent).toPromise();
        await delay(awaitAfterSendingEvent);

        service.InitializeConnectionToBackend(testinID,
          eventParserMockAsync,
          service.PerformResponseCheck);
      })
    });

    it('should respond with empty response', async (done) => {
      service.StartQNA(testinID).subscribe(
        (res: ResponseStatus) => {
          expect(res.Failed).toBeFalse();
          expect(res.HttpResult.status).toBe(200, 'Status should be 200');
          done();
        },
        () => { done.fail(httpErrorMsg); },
      );
    }, defaultEventsTimeoutMs);

    it('should dispatchEvent and return list of ids with one element', async (done) => {
      service.DispatchEvent([tEvent]).subscribe(
        (res: ResponseStatus) => {
          expect(res.HttpResult.status).toEqual(200);

          const responseBody = res.HttpResult.body as APIGatewayResponse;

          expect(responseBody.EventId).toEqual(uEventsIds.RegisterEventIds);
          expect(responseBody.Ids.length).toEqual(1);

          done();
        },
        () => { fail(httpErrorMsg); },
      );

    });

    it('should dispatchEvent random amount and return list of id with random amount of elements', async (done) => {
      const random = getRandomInt(10) + 1;

      const array = [];
      for (let i = 0; i < random; i++) {
        const temp = new TestEvent();
        temp.SourceId = testinID;
        array.push(temp);
      }

      service.DispatchEvent(array).subscribe(
        (res: ResponseStatus) => {
          expect(res.HttpResult.status).toEqual(200);

          const responseBody = res.HttpResult.body as APIGatewayResponse;

          expect(responseBody.EventId).toEqual(uEventsIds.RegisterEventIds);
          expect(responseBody.Ids.length).toEqual(random);

          done();
        },
        () => { fail(httpErrorMsg); },
      );

    });

    for (let index = 0; index < 5; index++) {
      it('subscribe to one event, fire it, start listening and receive it', async (done) => {
        const waitForEventId = getRandomInt(500);

        // 1. Subscribe to event
        const subEvent = new SubscibeToEvent(testinID, [[waitForEventId, 0, 0]], true);
        subEvent.SourceName = testinName;
        await service.DispatchEvent(subEvent).toPromise();

        // TODO: eventually it should wait till someone subscribed to it.
        await delay(awaitAfterSendingEvent);
        // 2. Fire event
        tEvent.EventId = waitForEventId;
        await service.DispatchEvent(tEvent).toPromise();
        await delay(awaitAfterSendingEvent);

        // 3. Listening to events
        service.StartQNA(testinID).subscribe(
          (res: ResponseStatus) => {
            expect(res.Failed).toBeFalse();
            expect(res.HttpResult.status).toBe(200, 'Incorrect http status');

            const responseBody = res.HttpResult.body as EventResponse;

            expect(responseBody.EventId).toBe(uEventsIds.GetNewEvents, 'EventId incorrect');

            expect(responseBody.Events.length).toBe(1, 'Incorrect length');

            expect(responseBody.Events[0].EventId).toBe(waitForEventId, 'Incorrect expected eventid');

            service.DispatchEvent(new SubscibeToEvent(testinID, [], true)).toPromise();

            done();
          }
        );
      });
    }

    it('start listening, then should subscribe to one event, fire it, and receive it', async (done) => {
      const waitForEventId = getRandomInt(99999);

      // 1. Listening to events
      service.StartQNA(testinID).subscribe(
        (res: ResponseStatus) => {
          expect(res.Failed).toBeFalse();
          expect(res.HttpResult.status).toBe(200, 'Incorrect http status');

          const responseBody = res.HttpResult.body as EventResponse;

          expect(responseBody.EventId).toBe(uEventsIds.GetNewEvents, 'EventId incorrect');

          expect(responseBody.Events.length).toBe(1, 'Incorrect lenght');

          expect(responseBody.Events[0].EventId).toBe(waitForEventId, 'Incorrect expected eventid');

          service.DispatchEvent(new SubscibeToEvent(testinID, [], true)).toPromise();

          done();
        }
      );

      // 2. Subscribe to event
      const subEvent = new SubscibeToEvent(testinID, [[waitForEventId, 0, 0]], true);
      subEvent.SourceName = testinName;
      await service.DispatchEvent(subEvent).toPromise();

      // TODO: eventually it should wait till someone subscribed to it.
      await delay(awaitAfterSendingEvent);
      // 3. Fire event
      tEvent.EventId = waitForEventId;
      await service.DispatchEvent(tEvent).toPromise();
    });

    it('should subscribe to many events, fire them, and receive them', async (done) => {
      const randomAmount = 8;

      const eventArray = [];
      const randomSubList = [];
      for (let i = 0; i < randomAmount; i++) {
        const rnd = getRandomInt(1000);
        randomSubList.push([rnd, 0, 0]);
        const temp = Object.assign({}, tEvent);
        temp.EventId = rnd;
        temp.SourceId = testinID;
        eventArray.push(temp);
      }

      // 1. Subscribe to events
      const subEvent = new SubscibeToEvent(testinID, randomSubList, true);
      await service.DispatchEvent(subEvent).toPromise();

      // TODO: eventually it should wait till someone subscribed to it.
      await delay(awaitAfterSendingEvent);
      // 3. Fire event
      await service.DispatchEvent(eventArray).toPromise();
      await delay(awaitAfterSendingEvent);

      // 3. Listening to events
      service.StartQNA(testinID).subscribe(
        (res: ResponseStatus) => {
          console.log(res);
          expect(res.Failed).toBeFalse();
          expect(res.HttpResult.status).toEqual(200);

          const responseBody = res.HttpResult.body as EventResponse;

          expect(responseBody.EventId).toEqual(uEventsIds.GetNewEvents);

          expect(responseBody.Events.length).toEqual(randomAmount);

          service.DispatchEvent(new SubscibeToEvent(testinID, [], true)).toPromise();
          done();
        },
        () => { done.fail(httpErrorMsg); },
      );
    });

    it('few sources subscribe to same event and they receive them', async (done) => {
      const sourceIdBegin = 41;
      const rndEventId = getRandomInt(1000);
      const sourceAmount = 2;

      const subEventList = [];
      const fireEventList = [];
      for (let index = sourceIdBegin; index < sourceIdBegin + sourceAmount; index++) {
          // 1. Subscribe to them
          const subEvent = new SubscibeToEvent(index.toString(), [[rndEventId, 0, 0]], true);
          subEventList.push(subEvent);

          // 2. Fire event
          tEvent.EventId = rndEventId;
          fireEventList.push(tEvent);
      }

      await service.DispatchEvent(subEventList).toPromise();
      await delay(awaitAfterSendingEvent);
      await service.DispatchEvent(fireEventList).toPromise();
      await delay(awaitAfterSendingEvent);

      for (let index = sourceIdBegin; index < sourceIdBegin + sourceAmount; index++) {
        await service.GetLastEvents(index.toString()).toPromise().then(
          async (res: ResponseStatus) => {

            const responseBody = res.HttpResult.body as EventResponse;

            expect(responseBody.EventId === uEventsIds.GetNewEvents);

            expect(responseBody.Events[0].EventId === rndEventId);

            const idList = [];

            responseBody.Events.forEach(element => {
              idList.push(element.AggregateId);
            });

            await service.ConfirmEvents(index.toString(), idList).toPromise();

            await service.GetLastEvents(index.toString()).toPromise().then(
              (res2: ResponseStatus) => {
                expect(res2.HttpResult.body).toBeNull();
              }
            );

            await service.DispatchEvent(new SubscibeToEvent(index.toString(), [], true)).toPromise();
          }
        );
      }

      done();
    });
});
}
