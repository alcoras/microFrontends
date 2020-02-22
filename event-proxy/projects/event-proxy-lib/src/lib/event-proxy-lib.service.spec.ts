import { TestBed } from '@angular/core/testing';

import { EventProxyLibService } from './event-proxy-lib.service';
import { HttpClientModule, HttpResponse, HttpEvent } from '@angular/common/http';
import { uEvent, uParts, uEventsIds } from '@protocol-shared/models/event';
import { EventSubscibeToEvent } from "@protocol-shared/events/EventSubscibeToEvent";

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
function delay(ms: number) {
  return new Promise( resolve => setTimeout(resolve, ms) );
}

//TODO: these tests should be in backend or these are integration tests
//TODO: test with angular tests too (httpTestModule, to test requests)
//TODO: reset server for each test
describe('EventProxyLibService', () =>
{
    let tEvent = new uEvent();
    let service: EventProxyLibService;

    beforeEach
    (
      () =>
      {
        TestBed.configureTestingModule({
          providers: [EventProxyLibService],
          imports:[HttpClientModule]
        });

        let eID = getRandomInt(100), trackID = getRandomInt(3), srcID = getRandomInt(50);
        tEvent.EventId = eID;
        tEvent.SourceEventUniqueId = trackID;
        tEvent.SourceId = srcID.toString();

        service = TestBed.get(EventProxyLibService);
      }
    );

    it("#service.confirmEvents() should confirm received events", async(done)=>
    {
      var srcId = 1000;
      var list:number[] = [100, 200];

      var data = { "SourceId": srcId, "ids": list };

      service.confirmEvents(srcId, list).subscribe
      (
        (response:HttpResponse<any>) =>
        {
          var expected = JSON.parse(JSON.stringify(list));
          var actual = JSON.parse(JSON.stringify(response.body));

          //console.log(expected, actual)
          expect(actual).toEqual(expected);
          expect(response.status).toEqual(201);

          done();
        }
      );
    });

    fit("#la land",  async(done) =>
    {
      let tempSub = service.qnaWithTheGateway.subscribe
      (
        (value: string) => { console.log(value); },
        (error: string) => { console.log(error); },
        () => { },
      );

      done();

    })

    it("should dispatchEvent and return same element", async (done) =>
    {
      service.dispatchEvent(tEvent).subscribe
      (
        (response:HttpResponse<any>) =>
        {
          var expected = JSON.parse(JSON.stringify(tEvent));
          var actual = JSON.parse(JSON.stringify(response.body));

          //console.log(expected, actual)
          actual.AggregateId = expected.AggregateId;

          expect(actual).toEqual(expected);
          expect(response.status).toEqual(201);

          done();
        }
      );

    });

    it("should connect and disconnect with status 204 after X seconds ", async(done)=>
    {
      var timeoutMS = 4; // max 5 cuz Jasmine defaults for each task
      service.getLastEvents(0, 0, timeoutMS).subscribe
      (
        (next:HttpResponse<any>) => { expect(next.status).toEqual(204); },
        () => {},
        () => { }
      )

      await delay(timeoutMS*1000);

      done();
    });

    it("should send subscription event and return it", async (done) =>
    {
      //TODO: should check if it was added to sub list in db
      var subEvent = new EventSubscibeToEvent([[500, 0, 0]], false);
      subEvent.EventId = uEventsIds.SubscribeToEvent;
      subEvent.SourceEventUniqueId = getRandomInt(500);
      subEvent.SourceId = "1000";

      service.dispatchEvent(subEvent).subscribe
      (
        (response:HttpResponse<any>) =>
        {
          var expected = JSON.parse(JSON.stringify(subEvent));
          var actual = JSON.parse(JSON.stringify(response.body));

          actual.AggregateId = expected.AggregateId;

          expect(actual).toEqual(expected);
          expect(response.status).toEqual(201);

        }
      );
      done();
    });

    it("should receive event to subscribed event", async (done) =>
    {
      // 1. Fire subscribe event
      // 2. Fire event with subscribed event id
      // 3. get subscribed event

      var uniqueId = getRandomInt(500);
      var waitForEventId = 500;

      var subEvent = new EventSubscibeToEvent([[waitForEventId, 0, 0]], false);
      subEvent.EventId = uEventsIds.SubscribeToEvent;
      subEvent.SourceEventUniqueId = uniqueId++;
      subEvent.SourceId = "1000";

      service.dispatchEvent(subEvent).subscribe
      (
        (response:HttpResponse<any>) =>
        {
          var expected = JSON.parse(JSON.stringify(subEvent));
          var actual = JSON.parse(JSON.stringify(response.body));

          actual.AggregateId = expected.AggregateId;

          expect(actual).toEqual(expected);
          expect(response.status).toEqual(201);
        }
      );

      tEvent.EventId = waitForEventId;
      tEvent.SourceEventUniqueId = uniqueId++;

      service.dispatchEvent(tEvent).subscribe
      (
        (response:HttpResponse<any>) =>
        {
          var expected = JSON.parse(JSON.stringify(tEvent));
          var actual = JSON.parse(JSON.stringify(response.body));

          actual.AggregateId = expected.AggregateId;

          expect(actual).toEqual(expected);
          expect(response.status).toEqual(201);
        }
      );

      var timeoutMS = 4; // max 5 cuz Jasmine defaults for each task

      service.getLastEvents(+subEvent.SourceId, 0, timeoutMS).subscribe
      (
        (response:HttpResponse<any>) =>
        {
          //TODO: should check results
          //var expected = JSON.parse(JSON.stringify(tEvent));
          //var actual = JSON.parse(JSON.stringify(response.body));

          expect(response.status).toEqual(200);
        }
      )

      done();
      //await delay(timeoutMS*1000);

    });

    it("#dispatchEvent should fail", async (done) =>
    {
      //spyOn(service, "handleErrors");

      service.changeApiGatewayURL("asdfasdf");

      service.dispatchEvent(tEvent).subscribe
      (
        result =>
        {
          //expect(service.handleErrors).toHaveBeenCalled();
          expect(result).toEqual("");
          done();
        }
      )

    });
});
