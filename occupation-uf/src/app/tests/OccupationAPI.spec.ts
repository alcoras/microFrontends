import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { OccupationAPIService } from '../services/OccupationAPI';
import { EventBusService } from '../services/EventBusService';
import { TestBed } from '@angular/core/testing';
import { genRandomNumber } from './Adds/helpers';

import {
  EventProxyLibService,
  EventIds,
  OccupationData,
  OccupationsCreateUpdate,
  OccupationsReadResults,
  EnvironmentService,
  OccupationsDeleteEvent,
  OccupationsReadQuery
} from 'event-proxy-lib-src';

const envPrefix = '__env';
const backendURL = 'localhost';
const backendPath = '/newEvents';
const backendPort = '54366';
const URL = `http://${backendURL}:${backendPort}${backendPath}`;

/**
 * Test Occupation data
 */

window[envPrefix] = window[envPrefix] || {};

// eslint-disable-next-line @typescript-eslint/camelcase
window[envPrefix].one_language = false;
// API url
window[envPrefix].url = 'http://' + backendURL;
window[envPrefix].apiGatewayUrl = window[envPrefix].url;
window[envPrefix].apiGatewayPort = backendPort;

const newOccupationData = new OccupationData();
newOccupationData.DocReestratorId = 24;
newOccupationData.Name = 'testName';
newOccupationData.OccupationAggregateIdHolderId = 0;
newOccupationData.TariffCategory = genRandomNumber(100);

describe('Occupation API service', () => {
  let service: OccupationAPIService;
  let eventBus: EventBusService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EventProxyLibService, EnvironmentService],
      imports: [HttpClientTestingModule]
    });

    eventBus = TestBed.inject(EventBusService);
    service = TestBed.inject(OccupationAPIService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  describe('Delete', () => {
    it('testing response', () => {

      service.DeleteAsync(123);

      const req = httpTestingController.expectOne(URL);

      expect(req.request.method).toEqual("POST");

      req.flush("");
    });

    it("testing content", () => {
      const id = genRandomNumber(200);
      service.DeleteAsync(id);

      const req = httpTestingController.expectOne(URL);

      const event = req.request.body.Events[0] as OccupationsDeleteEvent;
      expect(event.ObjectAggregateId).toBe(id);

      req.flush("");
    });
  });

  describe('Update', () => {

    it('testing content', () => {
      service.UpdateAsync(newOccupationData);

      const req = httpTestingController.expectOne(URL);

      const event = req.request.body.Events[0] as OccupationsCreateUpdate;
      expect(event.EventId).toBe(EventIds.OccupationsUpdate);
      expect(event.Name).toBe(newOccupationData.Name);
      expect(event.TariffCategory).toBe(newOccupationData.TariffCategory);

      req.flush("");
    });
  });

  describe('Create', () => {

    it('testing content', () => {
      service.CreateAsync(newOccupationData);

      const req = httpTestingController.expectOne(URL);

      const event = req.request.body.Events[0] as OccupationsCreateUpdate;
      expect(event.EventId).toBe(EventIds.OccupationsCreate);
      expect(event.Name).toBe(newOccupationData.Name);
      expect(event.TariffCategory).toBe(newOccupationData.TariffCategory);

      req.flush("");
    });
  });

  describe('Testing Event Bus', () => {

    it('passing to EventBus', () => {
      eventBus.EventBus.subscribe( (data: OccupationsReadResults) => {
        expect(data.OccupationDataList.length).toBe(1);
        expect(data.OccupationDataList[0]).toBe(newOccupationData);
      });

      const testEvent = new OccupationsReadResults();
      testEvent.OccupationDataList = [];
      testEvent.OccupationDataList.push(newOccupationData);

      eventBus.EventBus.next(testEvent);
    });
  });

  describe('Get', () => {

    it('testing content', () => {
      service.GetAsync(1, 2);

      const req = httpTestingController.expectOne(URL);

      const event = req.request.body.Events[0] as OccupationsReadQuery;
      expect(event.EventId).toBe(EventIds.OccupationsReadQuery);
      expect(event.Page).toBe(1);
      expect(event.Limit).toBe(2);

      req.flush("");
    });
  });
});
