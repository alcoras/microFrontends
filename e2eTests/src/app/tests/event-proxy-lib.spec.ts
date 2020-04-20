import { HttpResponse, HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { SubscibeToEvent } from '@uf-shared-events/index';
import { uEvent, uEventsIds } from '@uf-shared-models/event';
import { EventProxyLibService, EventProxyLibModule } from '@uf-shared-libs/event-proxy-lib/';

/**
 * generates random number
 * @param max max value
 * @returns random number
 */
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

/**
 * Returns promise after ms
 * @param ms miliseconds
 * @returns Promise
 */
function delay(ms: number) {
  return new Promise( resolve => setTimeout(resolve, ms) );
}

// TODO: these tests should be in backend or these are integration tests
// TODO: test with angular tests too (httpTestModule, to test requests)

/**
 * Test event
 */
class TestEvent extends uEvent {
}


// tslint:disable-next-line: no-big-function
describe('EventProxyLibService', () => {
    const httpErrorMsg = 'HTTP response with failure.';

    const backendURL = 'http://localhost:54366';
    const backendPort = '54366';
    const tEvent = new TestEvent();
    tEvent.EventId = 1000;
    const testinID = '1000';
    const testinName = 'testing';
    let service: EventProxyLibService;
    // tslint:disable-next-line: prefer-const
    let serviceList: EventProxyLibService[] = new Array(3);

    beforeEach
    (
      async () => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 20 * 1000;
        window['__env'] = window['__env'] || {};

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

        // tslint:disable-next-line: no-ignored-initial-value
        serviceList.forEach(element => {
          element = TestBed.inject(EventProxyLibService);
          element.ApiGatewayURL = backendURL;
        });

        tEvent.SourceId = testinID;
      }
    );

    afterEach(
      async () => {
        service.EndQNA();
        await service.ConfirmEvents(testinID, [], true).toPromise();

        serviceList.forEach(async (element) => {
          element.EndQNA();
          await element.ConfirmEvents(testinID, [], true).toPromise();
        });
      }
    );

    fit('should init', () => {
      expect(service).toBeTruthy();
    });

    it('Should respond with empty response', async (done) => {
      service.StartQNA(testinID).subscribe
      (
        (res: HttpResponse<any>) => {
          expect(res.status).toBe(200, 'Status should be 200');
          done();
        },
        () => { done.fail(httpErrorMsg); },
        () => { }
      );
    });

    it('should dispatchEvent and return list of id with one element', async (done) => {
      service.DispatchEvent([tEvent]).subscribe
      (
        (res: HttpResponse<any>) => {
          expect(res.status).toEqual(200);

          expect(res.body.EventId).toEqual(uEventsIds.RegisterEventIds);
          expect(res.body.Ids.length).toEqual(1);

          done();
        },
        () => { fail(httpErrorMsg); },
        () => { }
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

      service.DispatchEvent(array).subscribe
      (
        (res: HttpResponse<any>) => {
          expect(res.status).toEqual(200);

          expect(res.body.EventId).toEqual(uEventsIds.RegisterEventIds);
          expect(res.body.Ids.length).toEqual(random);

          done();
        },
        () => { fail(httpErrorMsg); },
        () => { }
      );

    });

    it('should subscribe to one event, fire it, and receive it', async (done) => {
      const waitForEventId = getRandomInt(99999);

      // 1. Listening to events
      service.StartQNA(testinID).subscribe
      (
        (res: HttpResponse<any>) => {
          expect(res.status).toBe(200, 'Incorrect http status');
          expect(res.body.EventId).toBe(uEventsIds.GetNewEvents, 'EventId incorrect');

          expect(res.body.Events.length).toBe(1, 'Incorrect lenght');

          expect(res.body.Events[0].EventId).toBe(waitForEventId, 'Incorrect expected eventid');

          done();
        },
        () => { fail(httpErrorMsg); },
        () => { }
      );

      // 2. Subscribe to event
      const subEvent = new SubscibeToEvent(testinID, [[waitForEventId, 0, 0]], false);
      subEvent.SourceName = testinName;
      await service.DispatchEvent(subEvent).toPromise();

      // TODO: eventually it should wait till someone subscribed to it.
      await delay(1000);
      // 3. Fire event
      tEvent.EventId = waitForEventId;
      await service.DispatchEvent(tEvent).toPromise();
    });

    it('should subscribe to many events, fire them, and receive them', async (done) => {
      const randomAmount = 2;

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
      const subEvent = new SubscibeToEvent(testinID, randomSubList, false);
      await service.DispatchEvent([subEvent]).toPromise();

      // TODO: eventually it should wait till someone subscribed to it.
      await delay(3000);
      // 3. Fire event
      await service.DispatchEvent(eventArray).toPromise();

      await delay(3000);

      // 3. Listening to events
      service.StartQNA(testinID).subscribe
      (
        (res: HttpResponse<any>) => {
          expect(res.status).toEqual(200);
          expect(res.body.EventId).toEqual(uEventsIds.GetNewEvents);

          expect(res.body.Events.length).toEqual(randomAmount);
          done();
        },
        () => { done.fail(httpErrorMsg); },
        () => { }
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
      await delay(3000);
      await service.DispatchEvent(fireEventList).toPromise();
      await delay(1000);

      for (let index = sourceIdBegin; index < sourceIdBegin + sourceAmount; index++) {
        await service.GetLastEvents(index.toString()).toPromise().then(
          async (res: HttpResponse<any>) => {
            expect(res.body.EventId === uEventsIds.GetNewEvents);

            expect(res.body.Events[0].EventId === rndEventId);

            const idList = [];

            res.body.Events.forEach(element => {
              idList.push(element.AggregateId);
            });

            await service.ConfirmEvents(index.toString(), idList).toPromise();

            await service.GetLastEvents(index.toString()).toPromise().then(
              (res2: HttpResponse<any>) => {
                expect(res2.body).toBeNull();
              }
            );
          }
        );
      }

      done();
    });
});
