import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { catchError, timeout } from "rxjs/operators";
import { Observable, Observer, Subscriber, of } from "rxjs";
import { CoreEvent, EventIds, ErrorMessage, ValidationStatus, MicroFrontendParts } from "./DTOs/index";
import { EnvironmentService } from "./services/EnvironmentService";
import { RetryWithBackoff } from "./retry/RetryWithBackoff";
import { BackendToFrontendEvent } from "./DTOs/BackendEvents/BackendToFrontendEvent";
import { FrontendToBackendEvent } from "./DTOs/FrontendEvents/FrontendToBackendEvent";

/**
 * Event Proxy service for communication with API gateway
 * micro service
 */
@Injectable({
  providedIn: "root"
})
export class EventProxyLibService {

  /**
   * Status which true if there QNA (connection for new events) with backend.
   */
  public Status = false;

  public ApiGatewayURL: string;

  /**
   * Casual request timeout, used for API services
   */
  public RequestTimeoutMS = 5000;

  /**
   * Connection timeout before retry;
   * ideally ApiGateway should respond within 5 seconds with an empty (if no events)
   * but there is delay in network + apigateway logic
   */
  public TimeoutMs = 6000;
  /**
   * Delay before each retry when connection fails
   */
  public DelayMs = 1000;
  /**
   * Maximum tries before giving up
   */
  public Retries = 10;

  /**
   * Add to delay before each consecutive retry
   */
  public BackOffMS = 1000;

  /**
   * API gateway to which all http requests will be sent
   */
  private readonly endpoint = "/newEvents";

  /**
   * Header which which will be used in all requests
   */
  private readonly jsonHeaders = new HttpHeaders({"Content-Type": "application/json"});

  /**
   * Source id
   */
  private sourceID = "";

  /**
   * Creates an instance of event proxy lib service.
   * @param environmentService Injects Environment settings
   * @param httpClient Injects Angular HttpClient
   */
  public constructor(
    private environmentService: EnvironmentService,
    private httpClient: HttpClient) {
      this.ApiGatewayURL = `${this.environmentService.APIGatewayUrl}:${this.environmentService.APIGatewayPort}`;
  }

  /**
   * Creates a time race against given promise
   * @param promise promise to race against
   * @param timeoutMS timeout in ms (defaults to RequestTimeoutMS)
   * @returns Promise (resolve - success, reject - timeout)
   */
  public async RacePromiseAsync<T>(promise: Promise<T>, timeoutMS = this.RequestTimeoutMS): Promise<ValidationStatus<T>> {
    const responseStatus = new ValidationStatus<T>();

    const timeout = new Promise((_, reject) => {
      const id = setTimeout(() => {
        clearTimeout(id);
        reject("Timeout in " + timeoutMS);
      }, timeoutMS);
    });

    const raceResult = Promise.race([promise, timeout]);

    await raceResult
      .then((resolve: T) => responseStatus.Result = resolve)
      .catch((reject) => responseStatus.ErrorList.push(reject));

    return responseStatus;
  }

  /**
   * Starts recursive communication with API gateway (backend)
   * @param sourceId Source id, used letting know which part is asking for new events
   * @returns ValidationStatus
   */
  public InitializeConnectionToBackend(sourceId: string): Observable<ValidationStatus<BackendToFrontendEvent>> {

    if (!sourceId) {
      throw new Error("SourceID was not provided in StartListeningToBackend");
    }

    this.sourceID = sourceId;
    this.Status = true;

    console.log(`${this.sourceID} starts listening to events on ${this.ApiGatewayURL}`);

    return new Observable<ValidationStatus<BackendToFrontendEvent>>(sub => {
      this.push(sub);
    });
  }

  /**
   * Default implementation to check http response from backend
   * @param responseStatus Performs default checks
   * @returns error, or nothing if there is now new events
   */
  public PerformResponseCheck(responseStatus: ValidationStatus<BackendToFrontendEvent>): boolean {
    if (!responseStatus.Result) {
      // Empty return (no new events)
      return false;
    }

    if (!Object.prototype.hasOwnProperty.call(responseStatus.Result, "EventId")) {
      this.EndListeningToBackend();
      throw new Error(ErrorMessage.NoEventId);
    }

    switch (+responseStatus.Result["EventId"]) {
      case EventIds.GetNewEvents:
        return true;
      case EventIds.TokenFailure:
        this.EndListeningToBackend();
        throw new Error(ErrorMessage.TokenFailure);
      default:
        this.EndListeningToBackend();
        console.error(responseStatus);
        throw new Error(ErrorMessage.UnrecognizedEventId);
    }
  }

  /**
   * Ends qna - sends complete to StartListeningToBackend observable
   */
  public EndListeningToBackend(): void {
    if (!this.Status) {
      console.log(`${this.sourceID} Trying to end, but already ended.`);
      return;
    }
    this.Status = false;
    console.log(`${this.sourceID} Ending listening.`);
  }

  /**
   * Confirms events
   * @param srcId Source Id
   * @param [idList] Array of ids to confirm specific events
   * @param [confirmAll] if set true will confirm all outstanding events
   * @returns ValidationStatus observable
   */
  public ConfirmEventsAsync(srcId: string, idList?: number[], confirmAll = false): Promise<ValidationStatus<BackendToFrontendEvent>> {
    const body: FrontendToBackendEvent = {
      EventId: EventIds.FrontEndEventReceived,
      SourceId: srcId,
      Ids: idList,
      MarkAllReceived: confirmAll,
    };

    return this.sendMessageAsync("ConfirmEventsAsync", body);
  }

  /**
   * Dispatches event to backend
   * @param event array of events to be sent to API Gateway
   * @returns Observable with response or error
   */
  public DispatchEventAsync(event: | CoreEvent | CoreEvent[]): Promise<ValidationStatus<BackendToFrontendEvent>> {
    const eventList = [].concat(event);
    const body: FrontendToBackendEvent = {
      EventId: EventIds.RegisterNewEvent,
      Events: eventList
    };

    return this.sendMessageAsync("DispatchEventAsync", body);
  }

  /**
   * Gets all unconfirmed events from backend
   * @param sourceId SourceID
   * @returns ValidationStatus
   */
  public GetLastEventsAsync(sourceId: string): Promise<ValidationStatus<BackendToFrontendEvent>> {

    const body: FrontendToBackendEvent = {
      EventId: EventIds.GetNewEvents,
      SourceId: sourceId,
    };

    return this.sendMessageAsync("GetLastEventsAsync", body);
  }

  /**
   * Tries to log in into system
   * @param timestamp ISO formatted time string
   * @param signature Signature
   * @returns ValidationStatus
   */
  public async LogInAsync(timestamp: string, signature: string): Promise<ValidationStatus<BackendToFrontendEvent>> {

    const body = {
      EventId: EventIds.LoginRequested,
      LoginTimestamp: timestamp,
      LoginSignature: signature
    };

    return this.sendMessageAsync("LogInAsync", body, true);
	}

  /**
   * Sends existing token to get new token
   * @returns ValidationStatus
   */
  public RenewTokenAsync(): Promise<ValidationStatus<BackendToFrontendEvent>> {

    const body = {
      EventId: EventIds.RenewToken
    };

    return this.sendMessageAsync("RenewTokenAsync", body);
	}

	/**
	 * Request Qr code for authentication
	 */
	public async QrRequestAsync(): Promise<ValidationStatus<BackendToFrontendEvent>> {
		const body = {
			EventId: EventIds.GiveMeQRCode
		};

		return this.sendMessageAsync("QrRequestAsync", body, true);
	}

	/**
	 * Checks if logged in (with QR)
	 * @param qrCodeMessage message we used to login
	 */
	public async QrCheckAsync(qrCodeMessage: string): Promise<ValidationStatus<BackendToFrontendEvent>> {
		const body = {
			EventId: EventIds.LoginQRCodeRequested,
			QRCodeMessage: qrCodeMessage
		};

		return this.sendMessageAsync("QrCheckAsync", body, true);
	}

  /**
   * Sends http message to backend (APIGateway microservice)
   * @param caller function which called (for tracing purposes)
   * @param body message body
   * @param anonymous (default false) if set to true will not include LoginToken field
   * @returns ValidationStatus
   */
  private async sendMessageAsync(caller: string, body: FrontendToBackendEvent, anonymous = false): Promise<ValidationStatus<BackendToFrontendEvent>> {

    const result = new ValidationStatus<BackendToFrontendEvent>();

    if (!this.ApiGatewayURL) {
      throw Error("ApiGateway URL is undefined");
    }

    const headers = this.jsonHeaders;
    const url = this.ApiGatewayURL + this.endpoint;

    if (!anonymous) {
      body["Token"] = this.environmentService.AuthorizationToken;
    }

    const sourceName = MicroFrontendParts.TryGetSourceNameFromSourceID(this.sourceID);
    console.log(`${caller}, source id: ${this.sourceID}; name: ${sourceName} sends to ${url} body: ${JSON.stringify(body)}`);

    return await new Observable( (res: Subscriber<ValidationStatus<BackendToFrontendEvent>>) => {
      this.httpClient
      .post(
        url,
        body,
        { headers, observe: "response" }
      )
      .pipe(
        // if no repsonse within Timeout, retryWithBackoff will kick in and will try
        // to send message depending on parameters, if it fails, then we return failed result
        timeout(this.TimeoutMs),
        RetryWithBackoff(this.DelayMs, this.Retries, this.BackOffMS),
        catchError(error => {
          result.ErrorList.push(error);
          return of(error);
        })
      )
      .toPromise().then( (httpRespone: HttpResponse<BackendToFrontendEvent>) => {
        if (result.HasErrors()) {
          res.error(result);
        } else {
          result.Result = httpRespone.body;
          res.next(result);
          res.complete();
        }
      });

    }).toPromise();
  }

  /**
   * Recursive push for infinite (or until stopped) event requesting from backend
   * @param sub Observer
   */
  private push(sub: Observer<ValidationStatus<BackendToFrontendEvent>>): void {

    if (!this.Status) {
      sub.complete();
      return;
    }

    this.GetLastEventsAsync(this.sourceID).then(
      (resolve: ValidationStatus<BackendToFrontendEvent>) => {
        sub.next(resolve);
        this.push(sub);
      },
      (reject: ValidationStatus<BackendToFrontendEvent>) => {
        sub.error(reject);
      }
    );

  }
}
