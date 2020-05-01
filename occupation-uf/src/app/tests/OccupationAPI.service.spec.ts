import { OccupationAPIService } from '../services/OccupationAPI.service';
import { EventBusService } from '../services/EventBus.service';
import { TestBed } from '@angular/core/testing';
import { EventProxyLibService } from '@uf-shared-libs/event-proxy-lib';
import { eProxyServiceMock } from './mocks/event-proxy-service.mock';
import { HttpResponse } from '@angular/common/http';
import { genRandomNumber, delay } from './helpers/helpers';
import { OccupationData, uEventsIds } from '@uf-shared-models/index';
import { OccupationsReadResults } from '@uf-shared-events/index';
import { IGetResponse } from '../services/interfaces/IGetResponse';

/**
 * Test Occupation data
 */
const newOccupationData = new OccupationData();
newOccupationData.DocReestratorId = 24;
newOccupationData.Name = 'testName';
newOccupationData.OccupationAggregateIdHolderId = 0;
newOccupationData.TariffCategory = genRandomNumber(100);

describe('Occupation API service', () => {
  let service: OccupationAPIService;
  let eventBus: EventBusService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: EventProxyLibService, useValue: eProxyServiceMock}
      ]
    });

    service = TestBed.inject(OccupationAPIService);
    eventBus = TestBed.inject(EventBusService);
  });

  describe('Delete', () => {
    it('testing response', (done) => {
      service.Delete(19).then(
        (res: HttpResponse<any>) => {
          expect(res.status).toBe(200);
          done();
        },
        (rej) => {
          done.fail(rej);
        }
      );
    });

    it('testing content', (done) => {
      const id = genRandomNumber(200);
      service.Delete(id).then(
        (res: HttpResponse<any>) => {
          expect(res.body.Events[0].ObjectAggregateId).toBe(id);
          done();
        },
        (rej) => {
          done.fail(rej);
        }
      );
    });
  });

  describe('Update', () => {

    it('testing response', (done) => {
      service.Update(newOccupationData).then(
        (res: HttpResponse<any>) => {
          expect(res.status).toBe(200);
          done();
        },
        (rej) => {
          done.fail(rej);
        }
      );
    });

    it('testing content', (done) => {
      const dateTimeVal = new Date().toISOString();
      service.Update(newOccupationData).then(
        (res: HttpResponse<any>) => {
          expect(res.body.Events[0].DateTimeValue).toBe(dateTimeVal);
          expect(res.body.Events[0].EventId).toBe(uEventsIds.OccupationsUpdate);
          expect(res.body.Events[0].Name).toBe(newOccupationData.Name);
          expect(res.body.Events[0].TariffCategory).toBe(newOccupationData.TariffCategory);
          done();
        },
        (rej) => {
          done.fail(rej);
        }
      );
    });

  });

  describe('Create', () => {

    it('testing response', (done) => {
      service.Create(newOccupationData).then(
        (res: HttpResponse<any>) => {
          expect(res.status).toBe(200);
          done();
        },
        (rej) => {
          done.fail(rej);
        }
      );
    });

    it('testing content', (done) => {
      service.Create(newOccupationData).then(
        (res: HttpResponse<any>) => {
          expect(res.body.Events[0].EventId).toBe(uEventsIds.OccupationsCreate);
          expect(res.body.Events[0].Name).toBe(newOccupationData.Name);
          expect(res.body.Events[0].TariffCategory).toBe(newOccupationData.TariffCategory);
          done();
        },
        (rej) => {
          done.fail(rej);
        }
      );
    });

  });

  describe('Get', () => {

    it('passing to EventBus', () => {
      eventBus.EventBus.subscribe( (data: OccupationsReadResults) => {
        expect(data.OccupationDataList.length).toBe(1);
        expect(data.OccupationDataList[0]).toBe(newOccupationData);
      });

      const testEvent = new OccupationsReadResults();

      // 123 just as in  event-proxy-service-mock.ts
      testEvent.SourceEventUniqueId = 123;
      testEvent.OccupationDataList = [];
      testEvent.OccupationDataList.push(newOccupationData);
      eventBus.EventBus.next(testEvent);
    });

    it('get passed data, then get response', async (done) => {
      service.Get(null, null).then(
        (res: IGetResponse) => {
          expect(res.items.length).toBe(1);
          expect(res.items[0]).toBe(newOccupationData);
          done();
        }
      );

      await delay(1000);

      const testEvent = new OccupationsReadResults();

      // 123 just as in  event-proxy-service-mock.ts
      testEvent.ParentSourceEventUniqueId = 123;
      testEvent.OccupationDataList = [];
      testEvent.OccupationDataList.push(newOccupationData);
      eventBus.EventBus.next(testEvent);
    });

    it('get passed data many times', async (done) => {
      let resp = 0;
      service.Get(null, null).then(
        (res: IGetResponse) => {
          expect(res.items.length).toBe(1);
          expect(res.items[0]).toBe(newOccupationData);
          resp++;
        }
      );

      service.Get(null, null).then(
        (res: IGetResponse) => {
          resp++;
          expect(res.items.length).toBe(1);
          expect(res.items[0]).toBe(newOccupationData);
        }
      );

      service.Get(null, null).then(
        (res: IGetResponse) => {
          expect(res.items.length).toBe(1);
          expect(res.items[0]).toBe(newOccupationData);
          resp++;
          expect(resp).toBe(3);
          done();
        }
      );

      await delay(1000);

      const testEvent = new OccupationsReadResults();

      // 123 just as in  event-proxy-service-mock.ts
      testEvent.ParentSourceEventUniqueId = 123;
      testEvent.OccupationDataList = [];
      testEvent.OccupationDataList.push(newOccupationData);
      eventBus.EventBus.next(testEvent);
      eventBus.EventBus.next(testEvent);
      eventBus.EventBus.next(testEvent);
    });
  });

});
