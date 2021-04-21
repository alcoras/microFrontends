import { TestBed } from "@angular/core/testing";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { BackendToFrontendEvent, CreateUpdatePersonData, EnvironmentService, EventIds, EventProxyLibService, PersonData, ReadPersonDataQuery, RemoveEnterpisePersonData } from "event-proxy-lib-src";
import { EventBusService } from "../services/EventBus.service";
import { PersonnelAPI } from "../services/PersonnelAPI";
import { HttpResponse } from "@angular/common/http";
import { delay, genRandomNumber, TestEvent } from "./Adds/helpers";

const envPrefix = "__env";
const backendURL = "localhost";
const backendPath = "/newEvents";
const backendPort = "54366";
const URL = `http://${backendURL}:${backendPort}${backendPath}`;

/**
 * Test Occupation data
 */

window[envPrefix] = window[envPrefix] || {};

// eslint-disable-next-line @typescript-eslint/camelcase
window[envPrefix].one_language = false;
// API url
window[envPrefix].url = "http://" + backendURL;
window[envPrefix].apiGatewayUrl = window[envPrefix].url;
window[envPrefix].apiGatewayPort = backendPort;

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

describe("PersonnelAPI service", () => {
  let service: PersonnelAPI;
  let eventBus: EventBusService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EventProxyLibService, EnvironmentService],
      imports: [HttpClientTestingModule]
    });

    service = TestBed.inject(PersonnelAPI);
    eventBus = TestBed.inject(EventBusService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  describe("Delete", () => {

    it("testing content", () => {
      const id = genRandomNumber(200);
      service.DeleteAsync(id);

      const req = httpTestingController.expectOne(URL);

      const event = req.request.body.Events[0] as RemoveEnterpisePersonData;
      expect(event.PersonDataID).toBe(id);

      req.flush("");
    });
  });

  describe("Create", () => {

    it("testing content", () => {
      service.CreateAsync(newPersonnelData);

      const req = httpTestingController.expectOne(URL);

      const event = req.request.body.Events[0] as CreateUpdatePersonData;
      expect(event.KodDRFO).toBe(newPersonnelData.KodDRFO);
      expect(event.Oklad).toBe(newPersonnelData.Oklad);

      req.flush("");
    });
  });
  describe("Update", () => {

    it("testing response", () => {
      service.UpdateAsync(newPersonnelData);

      const req = httpTestingController.expectOne(URL);

      const event = req.request.body.Events[0] as CreateUpdatePersonData;
      expect(event.KodDRFO).toBe(newPersonnelData.KodDRFO);
      expect(event.Oklad).toBe(newPersonnelData.Oklad);

      req.flush("");
    });

  });

  describe("Get", () => {

    it("testing content", () => {
      service.GetAsync(null, 1, 2);

      const req = httpTestingController.expectOne(URL);

      const event = req.request.body.Events[0] as ReadPersonDataQuery;
      expect(event.EventId).toBe(EventIds.ReadPersonDataQuery);
      expect(event.NumberPageOutput).toBe(1);
      expect(event.NumberRecordsOnPage).toBe(2);

      req.flush("");
    });
  });
});
