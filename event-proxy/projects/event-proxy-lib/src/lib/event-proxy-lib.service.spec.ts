import { TestBed } from '@angular/core/testing';

import { EventProxyLibService } from './event-proxy-lib.service';
import { HttpClientModule } from '@angular/common/http';
import { IEvent, uEvents, uParts } from '@protocol-shared/models/event';
import { IEventSubscibeToEvent } from '@protocol-shared/events/IEventSubscibeToEvent';

describe('EventProxyLibService', () =>
{
  beforeEach(() => TestBed.configureTestingModule({
    imports:[ HttpClientModule ]
  }));

  it('should be created', () =>
  {
    const service: EventProxyLibService = TestBed.get(EventProxyLibService);
    expect(service).toBeTruthy();
  });

  it("should dispatchEvent and return same element", async (done) =>
  {
    const service: EventProxyLibService = TestBed.get(EventProxyLibService);

    let eID = 1202, trackID = 2, srcID = 3;
    var event:IEvent =
    {
      EventId: eID,
      SourceEventUniqueId: trackID,
      SourceId: srcID,
    }

    service.dispatchEvent(event).subscribe
    (
      result => { expect(result).toEqual(event); done(); }
    )
  });

  it("should subscribe to event and return same element", async (done) =>
  {
    const service: EventProxyLibService = TestBed.get(EventProxyLibService);

    var event:IEventSubscibeToEvent =
    {
      EventId: uEvents.SubscribeToEvent.EventId,
      SourceEventUniqueId: 0,
      SourceId: uParts.Personnel,
      SubscribeToEventId: uEvents.PerssonelButtonPressed.EventId
    }

    service.dispatchEvent(event).subscribe
    (
      result => { expect(result).toEqual(event); done(); }
    )
  });

  it("should dispatchEvent and fail", (done) =>
  {
    const service: EventProxyLibService = TestBed.get(EventProxyLibService);

    //spyOn(service, "handleErrors");

    let eID = 1202, trackID = 2, srcID = 3;
    var event:IEvent =
    {
      EventId: eID,
      SourceEventUniqueId: trackID,
      SourceId: srcID,
    }

    service.changeApiGatewayURL("asdfasdf");

    service.dispatchEvent(event).subscribe
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
