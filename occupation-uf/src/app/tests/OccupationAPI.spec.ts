import { OccupationAPIService } from '../services/OccupationAPI';
import { EventBusService } from '../services/EventBusService';
import { TestBed } from '@angular/core/testing';
import { eProxyServiceMock } from './mocks/event-proxy-service.mock';
import { genRandomNumber, delay } from './Adds/helpers';

import {
  EventProxyLibService,
  EventIds,
  ResponseStatus,
  OccupationData,
  OccupationsCreateUpdate,
  OccupationsReadResults
} from 'event-proxy-lib-src';

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
        (res: ResponseStatus) => {
          expect(res.HttpResult.status).toBe(200);
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
        (res: any) => {
          expect(res.HttpResult.body.Events[0].ObjectAggregateId).toBe(id);
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
        (res: ResponseStatus) => {
          expect(res.HttpResult.status).toBe(200);
          done();
        },
        (rej) => {
          done.fail(rej);
        }
      );
    });

    it('testing content', (done) => {
      service.Update(newOccupationData).then(
        (res: ResponseStatus) => {
          const tempEvent = res.HttpResult.body.Events[0] as OccupationsCreateUpdate;

          expect(tempEvent.EventId).toBe(EventIds.OccupationsUpdate);
          expect(tempEvent.Name).toBe(newOccupationData.Name);
          expect(tempEvent.TariffCategory).toBe(newOccupationData.TariffCategory);
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
        (res: ResponseStatus) => {
          expect(res.HttpResult.status).toBe(200);
          done();
        },
        (rej) => {
          done.fail(rej);
        }
      );
    });

    it('testing content', (done) => {
      service.Create(newOccupationData).then(
        (res: ResponseStatus) => {

          const tempEvent = res.HttpResult.body.Events[0] as OccupationsCreateUpdate;

          expect(tempEvent.EventId).toBe(EventIds.OccupationsCreate);
          expect(tempEvent.Name).toBe(newOccupationData.Name);
          expect(tempEvent.TariffCategory).toBe(newOccupationData.TariffCategory);
          done();
        },
        (rej) => {
          done.fail(rej);
        }
      );
    });

  });

  describe('Get', () => {

    it('should throw if page 0', () => {
      expect( () => service.Get(0, 1)).toThrow();
    });

    it('should throw if pagesize 0', () => {
      expect( () => service.Get(1, 0)).toThrow();
    });

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
      service.Get(1, 1).then(
        (res: OccupationsReadResults) => {
          expect(res.OccupationDataList.length).toBe(1);
          expect(res.OccupationDataList[0]).toBe(newOccupationData);
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
      service.Get(1, 1).then(
        (res: OccupationsReadResults) => {
          expect(res.OccupationDataList.length).toBe(1);
          expect(res.OccupationDataList[0]).toBe(newOccupationData);
          resp++;
        }
      );

      service.Get(1, 1).then(
        (res: OccupationsReadResults) => {
          resp++;
          expect(res.OccupationDataList.length).toBe(1);
          expect(res.OccupationDataList[0]).toBe(newOccupationData);
        }
      );

      service.Get(1, 1).then(
        (res: OccupationsReadResults) => {
          expect(res.OccupationDataList.length).toBe(1);
          expect(res.OccupationDataList[0]).toBe(newOccupationData);
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
