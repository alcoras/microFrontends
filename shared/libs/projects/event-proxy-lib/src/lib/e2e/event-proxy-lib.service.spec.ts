import { HttpClientModule, HttpResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { SubscibeToEvent } from '@uf-shared-events/index';
import { uEvent, uEventsIds } from '@uf-shared-models/event';
import { EventProxyLibService } from '../event-proxy-lib.service';
import { EnvService } from '../env/env.service';

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
function delay(ms: number) {
  return new Promise( resolve => setTimeout(resolve, ms) );
}

// TODO: these tests should be in backend or these are integration tests
// TODO: test with angular tests too (httpTestModule, to test requests)
// TODO: reset server for each test

class TestEvent extends uEvent {
}

describe('EventProxyLibService', () => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 20 * 1000;
    const backendURL = 'http://localhost:54366';
    const tEvent = new TestEvent();
    tEvent.EventId = 1000;
    const testinID = '1000';
    let service: EventProxyLibService;
    // tslint:disable-next-line: prefer-const
    let serviceList: EventProxyLibService[] = new Array(3);

    beforeEach
    (
      async () => {
        TestBed.configureTestingModule({
          providers: [EventProxyLibService, EnvService],
          imports: [HttpClientModule]
        });

        service = TestBed.inject(EventProxyLibService);
        service.changeApiGatewayURL(backendURL);

        serviceList.forEach(element => {
          element = TestBed.inject(EventProxyLibService);
          element.changeApiGatewayURL(backendURL);
        });

        tEvent.SourceId = testinID;
      }
    );

    afterEach(
      async () => {

        service.endQNA();
        await service.getLastEvents(testinID).toPromise().then(
          async (ret) => {
            if (!ret.body) {
              return;
            }
            if (ret.body.EventId === uEventsIds.GetNewEvents) {
              const idList = [];
              ret.body.Events.forEach(element => {
                idList.push(element.AggregateId);
              });
              await service.confirmEvents(testinID, idList).toPromise();
            }
          }
        );

      }
    );

    xit('should fail if cannot connect', async (done) => {
      service.changeApiGatewayURL('http://asdfdfsaafdsfadsadfs');

      expect(service.Status).toBe(false);

      service.StartQNA(testinID).subscribe
      (
        () => { console.log('msg'); expect(service.Status).toEqual(false); done(); },
        () => { console.log('err'); expect(service.Status).toEqual(false); done(); },
        () => { console.log('compl'); expect(service.Status).toEqual(false); done(); }
      );
    });

    it('Should respond with empty response', async (done) => {
      service.StartQNA(testinID).subscribe
      (
        (res: HttpResponse<any>) => {
          expect(res.status).toEqual(200);
          done();
        },
        (err: any) => { done.fail('HTTP response with failure.'); },
        () => { }
      );
    });

    it('should dispatchEvent and return list of id with one element', async (done) => {
      service.dispatchEvent([tEvent]).subscribe
      (
        (res: HttpResponse<any>) => {
          expect(res.status).toEqual(200);

          expect(res.body.EventId).toEqual(uEventsIds.RegisterEventIds);
          expect(res.body.Ids.length).toEqual(1);

          done();
        },
        () => { fail('HTTP response with failure.'); },
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

      service.dispatchEvent(array).subscribe
      (
        (res: HttpResponse<any>) => {
          expect(res.status).toEqual(200);

          expect(res.body.EventId).toEqual(uEventsIds.RegisterEventIds);
          expect(res.body.Ids.length).toEqual(random);

          done();
        },
        () => { fail('HTTP response with failure.'); },
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
        () => { fail('HTTP response with failure.'); },
        () => { }
      );

      // 2. Subscribe to event
      const subEvent = new SubscibeToEvent([[waitForEventId, 0, 0]], false);
      subEvent.SourceId = testinID;
      await service.dispatchEvent(subEvent).toPromise();

      // TODO: eventually it should wait till someone subscribed to it.
      await delay(1000);
      // 3. Fire event
      tEvent.EventId = waitForEventId;
      await service.dispatchEvent(tEvent).toPromise();
    });

    it('should subscribe to many events, fire them, and receive them', async (done) => {
      // TODO: unxit when fixed issue on backend
      const waitForEventId = getRandomInt(500);

      const randomAmount = 2;

      const eventArray = [];
      const randomEventId = [];
      const randomSubList = [];
      for (let i = 0; i < randomAmount; i++) {
        const rnd = getRandomInt(1000);
        randomEventId.push(rnd);
        randomSubList.push([rnd, 0, 0]);
        const temp = Object.assign({}, tEvent);
        temp.EventId = rnd;
        temp.SourceId = testinID;
        eventArray.push(temp);
      }

      // 1. Subscribe to events
      const subEvent = new SubscibeToEvent(randomSubList, false);
      subEvent.SourceId = testinID;
      await service.dispatchEvent([subEvent]).toPromise();

      // TODO: eventually it should wait till someone subscribed to it.
      await delay(3000);
      // 3. Fire event
      await service.dispatchEvent(eventArray).toPromise();

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
        () => { done.fail('HTTP response with failure.'); },
        () => { }
      );
    });

    it('few sources subscribed to same event and they receive them', async (done) => {
      const sourceIdBegin = 41;
      const rndEventId = getRandomInt(1000);
      const sourceAmount = 2;

      const subEventList = [];
      const fireEventList = [];
      for (let index = sourceIdBegin; index < sourceIdBegin + sourceAmount; index++) {
          // 1. Subscribe to them
          const subEvent = new SubscibeToEvent([[rndEventId, 0, 0]], true);
          subEvent.SourceId = index.toString();
          subEventList.push(subEvent);

          // 2. Fire event
          tEvent.EventId = rndEventId;
          fireEventList.push(tEvent);
      }

      await service.dispatchEvent(subEventList).toPromise();
      await delay(3000);
      await service.dispatchEvent(fireEventList).toPromise();
      await delay(1000);

      for (let index = sourceIdBegin; index < sourceIdBegin + sourceAmount; index++) {
        await service.getLastEvents(index.toString()).toPromise().then(
          async (res: HttpResponse<any>) => {
            expect(res.body.EventId === uEventsIds.GetNewEvents);

            expect(res.body.Events[0].EventId === rndEventId);

            const idList = [];

            res.body.Events.forEach(element => {
              idList.push(element.AggregateId);
            });

            await service.confirmEvents(index.toString(), idList).toPromise();

            await service.getLastEvents(index.toString()).toPromise().then(
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
