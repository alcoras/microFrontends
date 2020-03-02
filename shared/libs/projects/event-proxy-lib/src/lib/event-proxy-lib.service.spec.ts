import { HttpClientModule, HttpResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { SubscibeToEvent } from '@protocol-shared/events/SubscibeToEvent';
import { uEvent, uEventsIds, uParts } from '@protocol-shared/models/event';
import { EventProxyLibService } from './event-proxy-lib.service';


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
    const tEvent = new uEvent();
    let service: EventProxyLibService;

    beforeEach
    (
      () => {
        TestBed.configureTestingModule({
          providers: [EventProxyLibService],
          imports: [HttpClientModule]
        });

        const eID = getRandomInt(100), trackID = getRandomInt(3), srcID = getRandomInt(50);
        tEvent.EventId = eID;
        tEvent.SourceEventUniqueId = trackID;
        tEvent.SourceId = srcID.toString();

        service = TestBed.get(EventProxyLibService);
      }
    );

    it('#service.confirmEvents() should confirm received events', async (done) => {
      const srcId = 1000;
      const list: number[] = [100, 200];

      service.confirmEvents(srcId, list).subscribe
      (
        (response: HttpResponse<any>) => {
          const expected = JSON.parse(JSON.stringify(list));
          const actual = JSON.parse(JSON.stringify(response.body));

          // console.log(expected, actual)
          expect(actual).toEqual(expected);
          expect(response.status).toEqual(201);

          done();
        }
      );
    });

    fit('# example on how to subscribe',  () => {

      jasmine.DEFAULT_TIMEOUT_INTERVAL = 999999;
      service.startQNA(uParts.FrontendShell).subscribe
      (
        (value: string) => { console.log('value:', value); },
        (error: string) => { console.log('error:', error); },
        () => { console.log('END'); },
      );

      jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
    });

    it('should dispatchEvent and return same element', async (done) => {
      service.dispatchEvent(tEvent).subscribe
      (
        (response: HttpResponse<any>) => {
          const expected = JSON.parse(JSON.stringify(tEvent));
          const actual = JSON.parse(JSON.stringify(response.body));

          // console.log(expected, actual)
          actual.AggregateId = expected.AggregateId;

          expect(actual).toEqual(expected);
          expect(response.status).toEqual(201);

          done();
        }
      );

    });

    it('should connect and disconnect with status 204 after X seconds ', async (done) => {
      const timeoutMS = 4; // max 5 cuz Jasmine defaults for each task
      service.getLastEvents(0, 0, timeoutMS).subscribe
      (
        (next: HttpResponse<any>) => { expect(next.status).toEqual(204); },
        () => {},
        () => { }
      );

      await delay(timeoutMS * 1000);

      done();
    });

    it('should send subscription event and return it', async (done) => {
      // TODO: should check if it was added to sub list in db
      const subEvent = new SubscibeToEvent([[500, 0, 0]], false);
      subEvent.EventId = uEventsIds.SubscribeToEvent;
      subEvent.SourceEventUniqueId = getRandomInt(500);
      subEvent.SourceId = '1000';

      service.dispatchEvent(subEvent).subscribe
      (
        (response: HttpResponse<any>) => {
          const expected = JSON.parse(JSON.stringify(subEvent));
          const actual = JSON.parse(JSON.stringify(response.body));

          actual.AggregateId = expected.AggregateId;

          expect(actual).toEqual(expected);
          expect(response.status).toEqual(201);

        }
      );
      done();
    });

    it('should receive event to subscribed event', async (done) => {
      // 1. Fire subscribe event
      // 2. Fire event with subscribed event id
      // 3. get subscribed event

      let uniqueId = getRandomInt(500);
      const waitForEventId = 500;

      const subEvent = new SubscibeToEvent([[waitForEventId, 0, 0]], false);
      subEvent.EventId = uEventsIds.SubscribeToEvent;
      subEvent.SourceEventUniqueId = uniqueId++;
      subEvent.SourceId = '1000';

      service.dispatchEvent(subEvent).subscribe
      (
        (response: HttpResponse<any>) => {
          const expected = JSON.parse(JSON.stringify(subEvent));
          const actual = JSON.parse(JSON.stringify(response.body));

          actual.AggregateId = expected.AggregateId;

          expect(actual).toEqual(expected);
          expect(response.status).toEqual(201);
        }
      );

      tEvent.EventId = waitForEventId;
      tEvent.SourceEventUniqueId = uniqueId++;

      service.dispatchEvent(tEvent).subscribe
      (
        (response: HttpResponse<any>) => {
          const expected = JSON.parse(JSON.stringify(tEvent));
          const actual = JSON.parse(JSON.stringify(response.body));

          actual.AggregateId = expected.AggregateId;

          expect(actual).toEqual(expected);
          expect(response.status).toEqual(201);
        }
      );

      const timeoutMS = 4; // max 5 cuz Jasmine defaults for each task

      service.getLastEvents(+subEvent.SourceId, 0, timeoutMS).subscribe
      (
        (response: HttpResponse<any>) => {
          // TODO: should check results
          // var expected = JSON.parse(JSON.stringify(tEvent));
          // var actual = JSON.parse(JSON.stringify(response.body));

          expect(response.status).toEqual(200);
        }
      );

      done();
      // await delay(timeoutMS*1000);

    });

    it('#dispatchEvent should fail', async (done) => {
      // spyOn(service, "handleErrors");

      service.changeApiGatewayURL('asdfasdf');

      service.dispatchEvent(tEvent).subscribe
      (
        result => {
          // expect(service.handleErrors).toHaveBeenCalled();
          expect(result).toEqual('');
          done();
        }
      );

    });
});
