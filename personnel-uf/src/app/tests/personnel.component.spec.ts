import { PersonnelComponent } from '../services/personnel.component';
import { EventBusService } from '../services/EventBus.service';
import { eProxyServiceMock } from './mocks/event-proxy-service.mock';
import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TestEvent, genRandomNumber } from './helpers/helpers';
import { CoreEvent, EventButtonPressed, EventIds, EventProxyLibService, EventResponse, ResponseStatus } from 'event-proxy-lib-src'
;

describe('Personnel micro frontend component', () => {
  let service: PersonnelComponent;
  let eventBus: EventBusService;
  let eProxyService: EventProxyLibService;

  beforeEach(
    async () => {
      TestBed.configureTestingModule({
        providers: [
          { provide: EventProxyLibService, useValue: eProxyServiceMock},
        ],
      });

      service = TestBed.inject(PersonnelComponent);
      eventBus = TestBed.inject(EventBusService);
      eProxyService = TestBed.inject(EventProxyLibService);
    }
  );


  it('should init and have called functions', async (done) => {
    const spies: jasmine.Spy<any>[] = [];
    spies.push(spyOn<any>(service, 'preparePlacements').and.callThrough());
    spies.push(spyOn<any>(service, 'SubscribeToEventsAsync').and.callThrough());

    await service.InitAsync();

    expect(service).toBeTruthy();

    spies.forEach(spy => {
        expect(spy).toHaveBeenCalled();
    });
    done();
  });

  it('testing PerssonelButtonPressed should trigger some actions', async (done) => {
    const event = new EventResponse();
    const buttonEvent = new EventButtonPressed(EventIds.PersonnelButtonPressed, 'gg');

    event.EventId = EventIds.GetNewEvents;
    event.Events = [];
    event.Events.push(buttonEvent);

    const responseStatus = new ResponseStatus();
    responseStatus.HttpResult = new HttpResponse<any>({status: 200, body: event});

    const spies: jasmine.Spy<any>[] = [];
    spies.push(spyOn<any>(eProxyService, 'PerformResponseCheck').and.callThrough());
    spies.push(spyOn<any>(service, 'processButtonPressed').and.callThrough());
    spies.push(spyOn<any>(eProxyService, 'GetLastEvents').and.returnValue(
      new Observable(
        (val) => {
          val.next(responseStatus);
          val.complete();
        }
      )
    ));
    spies.push(spyOn<any>(service, 'putToElement'));

    await service.InitAsync();
    service.InitializeConnectionWithBackend();

    spies.forEach(spy => {
      expect(spy).toHaveBeenCalled();
    });

    done();
  });

  it('testing ReadPersonData should trigger some actions', async (done) => {
    const event = new EventResponse();
    const personDataEvent = new TestEvent();

    const shouldNumber = genRandomNumber(1000).toString();

    event.EventId = EventIds.GetNewEvents;
    event.Events = [];
    personDataEvent.EventId = EventIds.ReadPersonData;
    personDataEvent.Comment = shouldNumber;

    event.Events.push(personDataEvent);

    const responseStatus = new ResponseStatus();
    responseStatus.HttpResult = new HttpResponse<any>({status: 200, body: event});

    spyOn<any>(eProxyService, 'GetLastEvents').and.returnValue(
      new Observable(
        (val) => {
          val.next(responseStatus);
          val.complete();
        }
      )
    );

    eventBus.EventBus.subscribe(
      (data: CoreEvent) => {
        expect(data.Comment).toBe(shouldNumber);
        done();
      }
    );

    await service.InitAsync();
    service.InitializeConnectionWithBackend();
  });

});
