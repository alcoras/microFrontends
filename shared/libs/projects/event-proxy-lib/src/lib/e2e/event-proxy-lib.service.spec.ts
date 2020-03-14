import { HttpClientModule, HttpResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { SubscibeToEvent } from '../shared/events/index';
import { uEvent, uEventsIds, uParts } from '../shared/models/event';
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

describe('EventProxyLibService', () => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10 * 1000;
    const tEvent = new uEvent();
    tEvent.EventId = 1000;
    const testinID = '1000';
    let service: EventProxyLibService;

    beforeEach
    (
      () => {
        TestBed.configureTestingModule({
          providers: [EventProxyLibService, EnvService],
          imports: [HttpClientModule]
        });

        service = TestBed.inject(EventProxyLibService);
        service.changeApiGatewayURL('http://localhost:54366');

        tEvent.SourceId = testinID;
      }
    );

    afterEach(
      () => {
        service.endQNA();
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

    it('Should respond with nothing JSON', async (done) => {
      service.StartQNA(testinID).subscribe
      (
        (res: HttpResponse<any>) => {
          expect(res.status).toEqual(200);

          // const expected = JSON.parse(JSON.stringify(expectedJSONtoGetNewEvents));
          // const actual = JSON.parse(JSON.stringify(res.body));

          // expect(actual).toEqual(expected);
          done();
        },
        () => { fail('HTTP response with failure.'); },
        () => { done(); }
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
        const temp = new uEvent();
        temp.EventId = i + 1;
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
      const waitForEventId = getRandomInt(999999);

      // // 1. Listening to events
      service.StartQNA(testinID).subscribe
      (
        (res: HttpResponse<any>) => {
          expect(res.status).toEqual(200, 'Incorrect http status');
          expect(res.body.EventId).toEqual(uEventsIds.GetNewEvents, 'EventId incorrect');

          expect(res.body.Events.length).toEqual(1, 'Incorrect lenght');

          expect(res.body.Events[0].EventId).toEqual(waitForEventId, 'Incorrect expected eventid');

          done();
        },
        () => { fail('HTTP response with failure.'); },
        () => { }
      );

      // 2. Subscribe to event
      const subEvent = new SubscibeToEvent([[waitForEventId, 0, 0]], false);
      subEvent.SourceId = testinID;
      await service.dispatchEvent([subEvent]).toPromise();

      // TODO: eventually it should wait till someone subscribed to it.
      await delay(1000);
      // 3. Fire event
      tEvent.EventId = waitForEventId;
      await service.dispatchEvent([tEvent]).toPromise();

    });

    it('should subscribe to many events, fire them, and receive them', async (done) => {
      // TODO: unxit when fixed issue on backend
      const waitForEventId = getRandomInt(500);

      const randomAmount = 3;

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
          console.log(res);
          expect(res.status).toEqual(200);
          expect(res.body.EventId).toEqual(uEventsIds.GetNewEvents);

          expect(res.body.Events.length).toEqual(randomAmount);

          done();
        },
        () => { done.fail(); },
        () => { }
      );
    });
});
