import { TestBed } from '@angular/core/testing';
import {
  CoreEvent,
  EventIds,
  EventProxyLibModule,
  EventProxyLibService,
  ValidationStatus,
  SubscibeToEvent,
  BackendToFrontendEvent} from 'event-proxy-lib-src';
import { BackendPort, BackendURL } from './Adds/helpers';

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

/**
 * Test event
 */
class TestEvent extends CoreEvent {
}

for (let i = 0; i < 1; i++) {
describe('EventProxyLibService', () => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10 * 1000;
    const httpErrorMsg = 'HTTP response with failure.';
    const defaultEventsTimeoutMs = 6000;
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
        await service.ConfirmEventsAsync(testinID, [], true);

        serviceList.forEach(async element => {
          element = TestBed.inject(EventProxyLibService);
          element.ApiGatewayURL = backendURL;
          service.Retries = 0;
          await element.ConfirmEventsAsync(testinID, [], true);
        });

        tEvent.SourceId = testinID;
      }
    );

    afterEach(async () => {
        service.EndListeningToBackend();
        await service.ConfirmEventsAsync(testinID, [], true);

        serviceList.forEach(async (element) => {
          element.EndListeningToBackend();
          await element.ConfirmEventsAsync(testinID, [], true);
        });
      }
    );

    it('should init', () => {
      expect(service).toBeTruthy();
    });

    describe("InitializeConnectionToBackend tests", () => {

      it("should pass event", async (done) => {
        const waitForEventId = getRandomInt(500);
        /**
         * Test
         * @param eventList Events
         * @returns Promise
         */
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        function eventParserMockAsync(eventList: CoreEvent[] | CoreEvent): Promise<void> {
          expect([].concat(eventList)[0].EventId).toEqual(waitForEventId);
          done();
          return Promise.resolve();
        }

        // 1. Subscribe to event
        const subEvent = new SubscibeToEvent(testinID, [[waitForEventId, 0, 0]], true);
        subEvent.SourceName = testinName;
        await service.DispatchEventAsync(subEvent);

        // TODO: eventually it should wait till someone subscribed to it.
        await delay(awaitAfterSendingEvent);
        // 2. Fire event
        tEvent.EventId = waitForEventId;
        await service.DispatchEventAsync(tEvent);
        await delay(awaitAfterSendingEvent);

        service.InitializeConnectionToBackend(testinID).subscribe(
          (response: ValidationStatus<BackendToFrontendEvent>) => {
            if (service.PerformResponseCheck(response)) {
              eventParserMockAsync(response.Result.Events);
            }
          },
          (error: ValidationStatus<BackendToFrontendEvent>) => {
            fail();
            service.EndListeningToBackend();
            throw new Error(error.ErrorList.toString());
          }
        );

      })
    });

    it('should respond with empty response', async (done) => {
      service.InitializeConnectionToBackend(testinID).subscribe(
        (res: ValidationStatus<BackendToFrontendEvent>) => {
          expect(res.HasErrors()).toBeFalse();
          done();
        },
        () => { done.fail(httpErrorMsg); },
      );
    }, defaultEventsTimeoutMs);

    it('should DispatchEventAsync and return list of ids with one element', async () => {
      const resposne = await service.DispatchEventAsync([tEvent]);
      expect(resposne.HasErrors()).toBeFalse();

      expect(resposne.Result.EventId).toEqual(EventIds.RegisterEventIds);
      expect(resposne.Result.Ids.length).toEqual(1);
    });

    it('should DispatchEventAsync random amount and return list of id with random amount of elements', async () => {
      const random = getRandomInt(10) + 1;

      const array = [];
      for (let i = 0; i < random; i++) {
        const temp = new TestEvent();
        temp.SourceId = testinID;
        array.push(temp);
      }

      const resposne = await service.DispatchEventAsync(array);
      expect(resposne.HasErrors()).toBeFalse();

      expect(resposne.Result.EventId).toEqual(EventIds.RegisterEventIds);
      expect(resposne.Result.Ids.length).toEqual(random);
    });

    for (let index = 0; index < 5; index++) {
      it('subscribe to one event, fire it, start listening and receive it', async (done) => {
        const waitForEventId = getRandomInt(500);

        // 1. Subscribe to event
        const subEvent = new SubscibeToEvent(testinID, [[waitForEventId, 0, 0]], true);
        subEvent.SourceName = testinName;
        await service.DispatchEventAsync(subEvent);

        // TODO: eventually it should wait till someone subscribed to it.
        // it does and it's 2003 event
        // 2. Fire event
        await delay(awaitAfterSendingEvent);
        tEvent.EventId = waitForEventId;
        await service.DispatchEventAsync(tEvent);
        await delay(awaitAfterSendingEvent);

        // 3. Listening to events
        service.InitializeConnectionToBackend(testinID).subscribe(
          async (res: ValidationStatus<BackendToFrontendEvent>) => {
            expect(res.HasErrors()).toBeFalse();

            const responseBody = res.Result;

            expect(responseBody.EventId).toBe(EventIds.GetNewEvents, 'EventId incorrect');

            expect(responseBody.Events.length).toBe(1, 'Incorrect length');

            expect(responseBody.Events[0].EventId).toBe(waitForEventId, 'Incorrect expected eventid');

            service.DispatchEventAsync(new SubscibeToEvent(testinID, [], true));

            done();
          }
        );
      });
    }

    it('start listening, then should subscribe to one event, fire it, and receive it', async (done) => {
      const waitForEventId = getRandomInt(99999);

      // 1. Listening to events
      service.InitializeConnectionToBackend(testinID).subscribe(
        (res: ValidationStatus<BackendToFrontendEvent>) => {
          expect(res.HasErrors()).toBeFalse();

          const responseBody = res.Result;

          expect(responseBody.EventId).toBe(EventIds.GetNewEvents, 'EventId incorrect');

          expect(responseBody.Events.length).toBe(1, 'Incorrect lenght');

          expect(responseBody.Events[0].EventId).toBe(waitForEventId, 'Incorrect expected eventid');

          service.DispatchEventAsync(new SubscibeToEvent(testinID, [], true));

          done();
        }
      );

      // 2. Subscribe to event
      const subEvent = new SubscibeToEvent(testinID, [[waitForEventId, 0, 0]], true);
      subEvent.SourceName = testinName;
      await service.DispatchEventAsync(subEvent);

      // TODO: eventually it should wait till someone subscribed to it.
      await delay(awaitAfterSendingEvent);
      // 3. Fire event
      tEvent.EventId = waitForEventId;
      await service.DispatchEventAsync(tEvent);
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
      await service.DispatchEventAsync(subEvent);

      // TODO: eventually it should wait till someone subscribed to it.
      await delay(awaitAfterSendingEvent);
      // 3. Fire event
      await service.DispatchEventAsync(eventArray);
      await delay(awaitAfterSendingEvent);

      // 3. Listening to events
      service.InitializeConnectionToBackend(testinID).subscribe(
        (res: ValidationStatus<BackendToFrontendEvent>) => {
          expect(res.HasErrors()).toBeFalse();

          const responseBody = res.Result;
          expect(responseBody.EventId).toEqual(EventIds.GetNewEvents);
          expect(responseBody.Events.length).toEqual(randomAmount);

          service.DispatchEventAsync(new SubscibeToEvent(testinID, [], true));
          done();
        },
        () => { done.fail(httpErrorMsg); },
      );
    });

   it('few sources subscribe to same event and they receive them', async (done) => {
      const sourceIdBegin = 41;
      const rndEventId = getRandomInt(500) + 1;
      const sourceAmount = 2;

      const subEventList = [];
      const fireEventList = [];
      for (let index = sourceIdBegin; index < sourceIdBegin + sourceAmount; index++) {
          // 1. Subscribe to them
          const subEvent = new SubscibeToEvent(index.toString(), [[rndEventId, 0, 0]], true);
          subEventList.push(subEvent);
      }

      // 2. Fire event
      tEvent.EventId = rndEventId;
      fireEventList.push(tEvent);

      await service.DispatchEventAsync(subEventList);
      await delay(awaitAfterSendingEvent);

      await service.DispatchEventAsync(fireEventList);
      await delay(awaitAfterSendingEvent);

      //
      let sourceCount = 0;
      for (let index = sourceIdBegin; index < sourceIdBegin + sourceAmount; index++) {
        const test = service.GetLastEventsAsync(index.toString()).then(
          (res: ValidationStatus<BackendToFrontendEvent>) => {

            const responseBody = res.Result;

            expect(responseBody.EventId === EventIds.GetNewEvents);

            expect(responseBody.Events[0].EventId === rndEventId);

            const idList = [];

            responseBody.Events.forEach(element => {
              idList.push(element.AggregateId);
            });

            service.ConfirmEventsAsync(index.toString(), idList);

            service.DispatchEventAsync(new SubscibeToEvent(index.toString(), [], true));

            sourceCount++;

            if (sourceCount == sourceAmount)
              done();
          }
        );
        expectAsync(test).toBeResolved();
      }
    });
});
}
