import { TestBed } from '@angular/core/testing';
import { PersonnelAPIService } from '@personnel-services/PersonnelAPI.service';
import { EventProxyLibService, EventProxyLibModule } from '@uf-shared-libs/event-proxy-lib';
import { EventBusService } from '@personnel-services/EventBus.service';
import { HttpResponse } from '@angular/common/http';
import { uParts, uEventsIds, EventResponse, IPersonnel } from '@uf-shared-models/index';
import { SubscibeToEvent } from '@uf-shared-events/index';

/**
 * Gets random number
 * @param max max int value
 * @returns random number
 */
function genRandomNumber(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

fdescribe('PersonnelAPI service', () => {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 20 * 1000;
  let service: PersonnelAPIService;
  let eProxyService: EventProxyLibService;
  let eventBusService: EventBusService;
  const sourceId = uParts.Personnel;
  const backendURL = 'http://localhost:54366';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EventProxyLibModule],
      providers: [
        EventProxyLibService,
        EventBusService,
      ]
    });
    service = TestBed.inject(PersonnelAPIService);
    eProxyService = TestBed.inject(EventProxyLibService);
    eventBusService = TestBed.inject(EventBusService);
    eProxyService.ChangeApiGatewayURL(backendURL);
  });

  afterEach(async () => {
    eProxyService.EndQNA();

    console.log('AfterEach cleanup End');
  });

  it('should create new PersonData entry', async (done) => {

    const newPersonnelData: IPersonnel = {
      PersonDataID: 0,
      DateValue: new Date().toISOString(),
      DocReestratorID: genRandomNumber(100),
      KodDRFO: genRandomNumber(100).toString(),
      Oklad: genRandomNumber(100),
      Stavka: genRandomNumber(100),
      PIP: genRandomNumber(100).toString(),
      DataPriyomu: new Date().toISOString(),
      Posada: genRandomNumber(100),
      PodatkovaPilga: genRandomNumber(100),
    };

    // 1. Sub to ReadPersonData
    const subEvent = new SubscibeToEvent([[uEventsIds.ReadPersonData, 0, 0]]);
    subEvent.SourceId = sourceId;
    await eProxyService.DispatchEvent(subEvent).toPromise();

    // 2. Get current length
    let currentLen;
    service.Get(null, null, null, null).then(
      (res: IPersonnel[]) => {
        currentLen = res.length;
      }
    );

    // 3. Start listenting to events
    eProxyService.StartQNA(sourceId).subscribe(
      (res: HttpResponse<EventResponse>) => {
        if (res.body) {
          res.body.Events.forEach(element => {
            if (element.EventId === uEventsIds.ReadPersonData) {
              eventBusService.EventBus.next(element);
              eProxyService.ConfirmEvents(sourceId, [element.AggregateId]).toPromise();
            }
          });
        }
    });

    // 4. create new persondata
    service.CreateUpdate(newPersonnelData).then(
      () => {
        // 5. compare length
        service.Get(null, null, null, null).then(
          (res: IPersonnel[]) => {
            expect(res.length).toBeGreaterThan(currentLen);
            done();
          }
        );
      },
      (rejected) => {
        done.fail(rejected);
      }
    );
  });

  it('should get events after ReadPersonDataQuery', async (done) => {
    // 1. Sub to ReadPersonData
    const subEvent = new SubscibeToEvent([[uEventsIds.ReadPersonData, 0, 0]]);
    subEvent.SourceId = sourceId;
    await eProxyService.DispatchEvent(subEvent).toPromise();

    // 2. Start listenting to events
    eProxyService.StartQNA(sourceId).subscribe(
      (res: HttpResponse<any>) => {
        if (res.body) {
          res.body.Events.forEach(element => {
            if (element.EventId === uEventsIds.ReadPersonData) {
              eventBusService.EventBus.next(element);
              eProxyService.ConfirmEvents(sourceId, [element.AggregateId]).toPromise();
            }
          });
        }
    });

    // 3. Send ReadPersonDataQuery event
    service.Get(null, null, null, null).then(
      (res: IPersonnel[]) => {
        res.forEach(element => {
          expect(element.PersonDataID).toBeDefined();
          expect(element.DataPriyomu).toBeDefined();
          expect(element.Oklad).toBeDefined();
        });
        done();
      }
    );

  });
});
