import { TestBed } from '@angular/core/testing';
import { EventProxyLibService } from '@uf-shared-libs/event-proxy-lib';
import { EventBusService } from '../services/EventBus.service';
import { PersonnelAPIService } from '../services/PersonnelAPI.service';
import { IPersonnel, PersonDataRead } from '@uf-shared-models/index';
import { HttpResponse } from '@angular/common/http';
import { eProxyServiceMock } from './mocks/event-proxy-service.mock';
import { delay, genRandomNumber, TestEvent } from './helpers/helpers';

/**
 * Test personnel data
 */
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

describe('PersonnelAPI service', () => {
  let service: PersonnelAPIService;
  let eventBus: EventBusService;

  beforeEach(
    async () => {
      TestBed.configureTestingModule({
        providers: [
          { provide: EventProxyLibService, useValue: eProxyServiceMock},
        ],
      });

      service = TestBed.inject(PersonnelAPIService);
      eventBus = TestBed.inject(EventBusService);
    }
  );

  afterEach(() => {
  });

  describe('CreateUpdate', () => {

    it('testing response', (done) => {
      service.CreateUpdate(newPersonnelData).then(
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
      service.CreateUpdate(newPersonnelData).then(
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

  describe('Get', () => {

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
      service.Get(null, null, null, null).then(
        (res: IPersonnel[]) => {
          expect(res.length).toBe(1);
          expect(res[0]).toBe(newPersonnelData);
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
      service.Get(null, null, null, null).then(
        (res: IPersonnel[]) => {
          expect(res.length).toBe(1);
          expect(res[0]).toBe(newPersonnelData);
          resp++;
        }
      );

      service.Get(null, null, null, null).then(
        (res: IPersonnel[]) => {
          resp++;
          expect(res.length).toBe(1);
          expect(res[0]).toBe(newPersonnelData);
        }
      );

      service.Get(null, null, null, null).then(
        (res: IPersonnel[]) => {
          expect(res.length).toBe(1);
          expect(res[0]).toBe(newPersonnelData);
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
