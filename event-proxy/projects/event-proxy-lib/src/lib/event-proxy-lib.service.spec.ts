import { TestBed } from '@angular/core/testing';

import { EventProxyLibService } from './event-proxy-lib.service';
import { HttpClientModule, HttpResponse } from '@angular/common/http';
import { uEvent, uParts, uEventsIds } from '@protocol-shared/models/event';
import { EventSubscibeToEvent } from '@protocol-shared/events/EventSubscibeToEvent';

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
function delay(ms: number) {
  return new Promise( resolve => setTimeout(resolve, ms) );
}

describe('EventProxyLibService', () =>
{
  let tEvent = new uEvent();
  let service: EventProxyLibService;

  beforeEach
  (
    () =>
    {
      TestBed.configureTestingModule({
        imports:[HttpClientModule]
      });

      let eID = getRandomInt(100), trackID = getRandomInt(3), srcID = getRandomInt(50);
      tEvent.EventId = eID;
      tEvent.SourceEventUniqueId = trackID;
      tEvent.SourceId = srcID;

      service = TestBed.get(EventProxyLibService);
    }
  );

  it('should be created', () =>
  {
    expect(service).toBeTruthy();
  });

  it("should dispatchEvent and return same element", async (done) =>
  {
    service.dispatchEvent(tEvent).subscribe
    (
      (result) =>
      {
        var expected = JSON.parse(JSON.stringify(tEvent));
        var actual = JSON.parse(JSON.stringify(result));

        expect(actual).toEqual(expected, "failed on dispatchEvent");
        done();
      }
    )

  });

  it("should testing_getLastEvent and return same element", async (done) =>
  {
    service.dispatchEvent(tEvent).subscribe
    (
      (result) =>
      {
        var expected = JSON.parse(JSON.stringify(tEvent));
        var actual = JSON.parse(JSON.stringify(result));

        expect(actual).toEqual(expected, "failed on dispatchEvent");

      }
    )

    await delay(1000);

    service.testing_getLastEvent().subscribe
    (
      (result) =>
      {
        var expected = JSON.parse(JSON.stringify(tEvent))
        var actual = JSON.parse(JSON.stringify(result))

        expect(actual).toEqual(expected, "failed on testing_getLastEvent");

        done();
      }
    )
  });

  it("should subscribe to event and return same element", async (done) =>
  {
    var event = new EventSubscibeToEvent(0);

    event.SourceId = uParts.Personnel;
    event.SourceEventUniqueId = 0;
    event.SubscribeToEventId = uEventsIds.PerssonelButtonPressed;
    event.Comment = "gg";

    service.dispatchEvent(event).subscribe
    (
      (result) =>
      {
        // TODO: so terrible
        var expected = JSON.parse(JSON.stringify(event))
        var actual = JSON.parse(JSON.stringify(result))

        expect(actual).toEqual(expected);

        done();
      }
    )
  });

  it("should dispatchEvent and fail", async (done) =>
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

  xit("testing web worker", () =>
  {
    service.testing_run();
  });
});
