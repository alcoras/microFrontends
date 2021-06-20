import { AuthenticationService } from "../services/AuthenticationService";
import { TestBed } from "@angular/core/testing";
import { EnvironmentService, EventProxyLibService, LoginRequest } from "event-proxy-lib-src";
import { eventProxyServiceMock, tokenConst } from "./mocks/event-proxy-service.mock";
import * as moment from "moment";

const envPrefix = "__env";
window[envPrefix] = window[envPrefix] || {};

describe("AuthenticationService", () =>{
  let service: AuthenticationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EnvironmentService,
        { provide: EventProxyLibService, useValue: eventProxyServiceMock},
      ],
    });
    service = TestBed.inject(AuthenticationService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("LoginAsync emulation", async (done) => {
    const loginRequest = new LoginRequest();
    loginRequest.Timestamp = new Date().toISOString();
    loginRequest.Signature = "0x123123123";

    spyOn<any>(service, "createMessageAndSignature").and.returnValue(
        new Promise<LoginRequest>((resolve) => {
          resolve(loginRequest);
        })
    );

    await service.LoginAsync();

    expect(service.GetToken()).toBe(tokenConst);

    done();
  });

  it("testing moment", () => {
    const now = moment("2020-04-04T10:20:24.185Z");
    const anHourLater = moment(now).add(1, "hours").toISOString();

    expect(anHourLater).toBe("2020-04-04T11:20:24.185Z");
  });

});
