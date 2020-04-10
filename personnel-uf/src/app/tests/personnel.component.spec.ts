import { PersonnelComponent } from '../personnel/personnel.component';
import { EventBusService } from '../services/EventBus.service';
import { EventProxyLibService } from '@uf-shared-libs/event-proxy-lib';
import { eProxyServiceMock } from './mocks/event-proxy-service.mock';
import { TestBed } from '@angular/core/testing';
import { EventResponse, uEventsIds, uEvent } from '@uf-shared-models/index';
import { EventButtonPressed } from '@uf-shared-events/index';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TestEvent, genRandomNumber } from './helpers/helpers';

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

  afterEach(() => {
  });

  it('should init and have called functions', async (done) => {
    const spies: jasmine.Spy<any>[] = [];
    spies.push(spyOn<any>(service, 'preparePlacements').and.callThrough());
    spies.push(spyOn<any>(service, 'subscribeToEventsAsync').and.callThrough());

    await service.InitAsync();

    expect(service).toBeTruthy();

    spies.forEach(spy => {
        expect(spy).toHaveBeenCalled();
    });
    done();
  });

  it('testing PerssonelButtonPressed should trigger some actions', async (done) => {
    const event = new EventResponse();
    const buttonEvent = new EventButtonPressed(uEventsIds.PerssonelButtonPressed, 'gg');

    event.EventId = uEventsIds.GetNewEvents;
    event.Events = [];
    event.Events.push(buttonEvent);

    const spies: jasmine.Spy<any>[] = [];
    spies.push(spyOn<any>(service, 'parseNewEvent').and.callThrough());
    spies.push(spyOn<any>(service, 'processButtonPressed').and.callThrough());
    spies.push(spyOn<any>(eProxyService, 'GetLastEvents').and.returnValue(
      new Observable(
        (val) => {
          val.next(new HttpResponse<any>({status: 200, body: event}));
          val.complete();
        }
      )
    ));
    spies.push(spyOn<any>(service, 'putToElement'));

    await service.InitAsync();
    service.StartQNA();

    spies.forEach(spy => {
      expect(spy).toHaveBeenCalled();
    });

    done();
  });

  it('testing ReadPersonData should trigger some actions', async (done) => {
    const event = new EventResponse();
    const personDataEvent = new TestEvent();

    const shouldNumber = genRandomNumber(1000).toString();

    event.EventId = uEventsIds.GetNewEvents;
    event.Events = [];
    personDataEvent.EventId = uEventsIds.ReadPersonData;
    personDataEvent.Comment = shouldNumber;

    event.Events.push(personDataEvent);

    spyOn<any>(eProxyService, 'GetLastEvents').and.returnValue(
      new Observable(
        (val) => {
          val.next(new HttpResponse<any>({status: 200, body: event}));
          val.complete();
        }
      )
    );

    eventBus.EventBus.subscribe(
      (data: uEvent) => {
        expect(data.Comment).toBe(shouldNumber);
        done();
      }
    );

    await service.InitAsync();
    service.StartQNA();
  });

});
