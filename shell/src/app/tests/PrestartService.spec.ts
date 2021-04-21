import { TestBed } from "@angular/core/testing";

import { PrestartService } from "../services/PrestartService";
import { eventProxyServiceMock } from "./mocks/event-proxy-service.mock";
import { ResourceLoaderService } from "../services/ResourceLoaderService";
import { resourceLoaderMock } from "./mocks/resource-loader.mock";
import { EnvironmentService } from "event-proxy-lib-src";

describe("PrestartService", () => {
  let service: PrestartService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        EnvironmentService,
        { provide: eventProxyServiceMock, useValue: eventProxyServiceMock},
        { provide: ResourceLoaderService, useValue: resourceLoaderMock}
      ]
    });
    service = TestBed.inject(PrestartService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should set up scripts", async (done) => {
    spyOn(resourceLoaderMock, "LoadResources");
    service.InitScripts(["gg"]);

    expect(resourceLoaderMock.LoadResources).toHaveBeenCalled();
    done();
  });
});
