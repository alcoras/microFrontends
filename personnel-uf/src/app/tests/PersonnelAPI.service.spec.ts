import { TestBed } from '@angular/core/testing';
import { BackendToFrontendEvent, EventIds, EventProxyLibService } from 'event-proxy-lib-src';
import { EventBusService } from '../services/EventBus.service';
import { PersonnelAPIService } from '../services/PersonnelAPI.service';
import { HttpResponse } from '@angular/common/http';
import { eProxyServiceMock } from './mocks/event-proxy-service.mock';
import { delay, genRandomNumber, TestEvent } from './helpers/helpers';
import { PersonData, PersonDataDTO, PersonDataRead } from '../Models/index';

/**
 * Test personnel data
 */
const newPersonnelData: PersonData = {
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

describe('PersonnelAPI service', () => {
  let service: PersonnelAPIService;
  let eventBus: EventBusService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
          { provide: EventProxyLibService, useValue: eProxyServiceMock},
        ],
      });

    service = TestBed.inject(PersonnelAPIService);
    eventBus = TestBed.inject(EventBusService);
  });

  describe('Delete', () => {

    it('testing response', (done) => {
      service.Delete(19).then(
        (res: HttpResponse<BackendToFrontendEvent>) => {
          expect(res.status).toBe(200);
          done();
        },
        (rej) => {
          done.fail(rej);
        }
      );
    });

    it('testing content', (done) => {
      const personDataId = genRandomNumber(200);
      service.Delete(personDataId).then(
        (res: HttpResponse<any>) => {
          expect(res.body.Events[0].PersonDataID).toBe(personDataId);
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
      service.Create(newPersonnelData).then(
        (res: HttpResponse<BackendToFrontendEvent>) => {
          expect(res.status).toBe(200);
          done();
        },
        (rej) => {
          done.fail(rej);
        }
      );
    });

    it('testing content', (done) => {
      service.Create(newPersonnelData).then(
        (res: HttpResponse<any>) => {
          expect(res.body.Events[0].KodDRFO).toBe(newPersonnelData.KodDRFO);
          expect(res.body.Events[0].Oklad).toBe(newPersonnelData.Oklad);
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
      service.Update(newPersonnelData).then(
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
      service.Update(newPersonnelData).then(
        (res: HttpResponse<any>) => {
          expect(res.body.Events[0].EventId).toBe(EventIds.UpdatePersonData);
          expect(res.body.Events[0].KodDRFO).toBe(newPersonnelData.KodDRFO);
          expect(res.body.Events[0].PIP).toBe(newPersonnelData.PIP);
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
      expect( () => service.Get(null, 0, 1)).toThrow();
    });

    it('should throw if pagesize 0', () => {
      expect( () => service.Get(null, 1, 0)).toThrow();
    });

    it('passing to EventBus', () => {
      eventBus.EventBus.subscribe( (data: PersonDataRead) => {
        expect(data.ListOutputEnterprisePersonData.length).toBe(1);
        expect(data.ListOutputEnterprisePersonData[0]).toBe(newPersonnelData);
      });

      const testEvent = new TestEvent();

      // 123 just as in  event-proxy-service-mock.ts
      testEvent.SourceEventUniqueId = 123;
      testEvent.ListOutputEnterprisePersonData = [];
      testEvent.ListOutputEnterprisePersonData.push(newPersonnelData);
      eventBus.EventBus.next(testEvent);
    });

    it('get passed data, then get response', async (done) => {
      service.Get(null, 1, 1).then(
        (res: PersonDataDTO) => {
          expect(res.items.length).toBe(1);
          expect(res.items[0]).toBe(newPersonnelData);
          done();
        }
      );

      await delay(1000);

      const testEvent = new TestEvent();

      // 123 just as in  event-proxy-service-mock.ts
      testEvent.ParentSourceEventUniqueId = 123;
      testEvent.ListOutputEnterprisePersonData = [];
      testEvent.ListOutputEnterprisePersonData.push(newPersonnelData);
      eventBus.EventBus.next(testEvent);
    });

    it('get passed data many times', async (done) => {
      let resp = 0;
      service.Get(null, 1, 1).then(
        (res: PersonDataDTO) => {
          expect(res.items.length).toBe(1);
          expect(res.items[0]).toBe(newPersonnelData);
          resp++;
        }
      );

      service.Get(null, 1, 1).then(
        (res: PersonDataDTO) => {
          resp++;
          expect(res.items.length).toBe(1);
          expect(res.items[0]).toBe(newPersonnelData);
        }
      );

      service.Get(null, 1, 1).then(
        (res: PersonDataDTO) => {
          expect(res.items.length).toBe(1);
          expect(res.items[0]).toBe(newPersonnelData);
          resp++;
          expect(resp).toBe(3);
          done();
        }
      );

      await delay(1000);

      const testEvent = new TestEvent();

      // 123 just as in  event-proxy-service-mock.ts
      testEvent.ParentSourceEventUniqueId = 123;
      testEvent.ListOutputEnterprisePersonData = [];
      testEvent.ListOutputEnterprisePersonData.push(newPersonnelData);
      eventBus.EventBus.next(testEvent);
      eventBus.EventBus.next(testEvent);
      eventBus.EventBus.next(testEvent);
    });
  });

});
