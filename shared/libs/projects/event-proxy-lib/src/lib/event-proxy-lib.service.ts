import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { catchError, timeout } from 'rxjs/operators';
import { Observable, Observer, Subscriber, of } from 'rxjs';
import { CoreEvent, EventIds, ErrorMessage, ResponseStatus, MicroFrontendParts } from './models/index';
import { EnvironmentService } from './services/EnvironmentService';
import { retryWithBackoff } from './retry/retry.pipe';

class FrontendToBackendEvent {
  public EventId: number;
  public SourceId?: string;
  public Ids?: number[];
  public MarkAllReceived?: boolean;
  public Events?: CoreEvent[];
}

class BackendToFrontendEvent {
  public EventId: number;
  public Ids?: number[];
  public Events?: CoreEvent[];
}

/**
 * Event Proxy service for communication with API gateway
 * micro service
 */
@Injectable({
  providedIn: 'root'
})
export class EventProxyLibService {

  /**
   * Status which true if there QNA (connection for new events) with backend.
   */
  public Status = false;

  public ApiGatewayURL: string;

  /**
   * Connection timeout before retry;
   * ideally ApiGateway should respond within 5 seconds with an empty (if no events)
   * but there is delay in network + apigateway logic
   */
  public Timeout = 6000;
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
  private readonly endpoint = '/newEvents';

  /**
   * Header which which will be used in all requests
   */
  private readonly jsonHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  /**
   * Source id
   */
  private sourceID = '';

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
   * Starts recursive communication with API gateway (backend)
   * @param sourceId Source id, used letting know which part is asking for new events
   * @returns ResponseStatus with success (and result) or failure (error)
   */
  public InitializeConnectionToBackend(sourceId: string): Observable<ResponseStatus> {

    if (!sourceId) {
      throw new Error('SourceID was not provided in StartListeningToBackend');
    }

    this.sourceID = sourceId;
    this.Status = true;

    console.log(`${this.sourceID} starts listening to events on ${this.ApiGatewayURL}`);

    return new Observable<ResponseStatus>( sub => {
      this.push(sub);
    });
  }

  /**
   * Default implementation to check http response from backend
   * @param responseStatus Performs default checks
   * @returns error, or nothing if there is now new events
   */
  public PerformResponseCheck(responseStatus: ResponseStatus): boolean {
    if (!responseStatus.HttpResult.body) {
      // Empty return (no new events)
      return false;
    }

    if (!Object.prototype.hasOwnProperty.call(responseStatus.HttpResult.body, 'EventId')) {
      this.EndListeningToBackend();
      throw new Error(ErrorMessage.NoEventId);
    }

    switch (+responseStatus.HttpResult.body['EventId']) {
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
   * @returns ResponseStatus observable
   */
  public ConfirmEvents(srcId: string, idList?: number[], confirmAll = false): Observable<ResponseStatus> {
    const body: FrontendToBackendEvent = {
      EventId: EventIds.FrontEndEventReceived,
      SourceId: srcId,
      Ids: idList,
      MarkAllReceived: confirmAll,
    };

    return this.sendMessage('ConfirmEvents', body);
  }

  /**
   * Dispatches event to backend
   * @param event array of events one wish to register
   * @returns Observable with response or error
   */
  public DispatchEvent(event: | CoreEvent | CoreEvent[]): Observable<ResponseStatus> {
    const eventList = [].concat(event);
    const body: FrontendToBackendEvent = {
      EventId: EventIds.RegisterNewEvent,
      Events: eventList
    };

    return this.sendMessage('DispatchEvent', body);
  }

  /**
   * Gets all unconfirmed events from backend
   * @param srcId SourceID
   * @returns ResponseStatus
   */
  public GetLastEvents(srcId: string): Observable<ResponseStatus> {

    const body: FrontendToBackendEvent = {
      EventId: EventIds.GetNewEvents,
      SourceId: srcId,
    };

    return this.sendMessage('GetLastEvents', body);
  }

  /**
   * Tries to log in into system
   * @param timestamp ISO formatted time string
   * @param signature Signature
   * @returns ResponseStatus
   */
  public LogIn(timestamp: string, signature: string): Observable<ResponseStatus> {

    const body = {
      EventId: EventIds.LoginRequested,
      LoginTimestamp: timestamp,
      LoginSignature: signature
    }

    return this.sendMessage('LogIn', body, true);
  }

  /**
   * Sends existing token to get new token
   * @returns ResponseStatus
   */
  public RenewToken(): Observable<ResponseStatus> {

    const body = {
      EventId: EventIds.RenewToken
    }

    return this.sendMessage('RenewToken', body);
  }

  /**
   * Sends http message to backend (APIGateway microservice)
   * @param caller function which called
   * @param body message body
   * @param anonymous (default false) if set to true will not include LoginToken field
   * @returns ResponseStatus
   */
  private sendMessage(caller: string, body: FrontendToBackendEvent, anonymous = false): Observable<ResponseStatus> {

    const result = new ResponseStatus();

    if (!this.ApiGatewayURL) {
      throw Error('ApiGateway URL is undefined');
    }

    const headers = this.jsonHeaders;
    const url = this.ApiGatewayURL + this.endpoint;

    if (!anonymous) {
      body['Token'] = this.environmentService.AuthorizationToken;
    }

    const sourceName = MicroFrontendParts.GetSourceNameFromSourceID(this.sourceID);
    console.log(`
    ${caller}, source:${this.sourceID} ${sourceName} sends to ${url} body: ${JSON.stringify(body)}`);

    return new Observable( (res: Subscriber<ResponseStatus>) => {

      this.httpClient
      .post(
        url,
        body,
        { headers, observe: 'response' }
      )
      .pipe(
        // if no repsonse within Timeout, retryWithBackoff will kick in and will try
        // to connect depending on parameters, if it fails, then we return failed result
        timeout(this.Timeout),
        retryWithBackoff(this.DelayMs, this.Retries, this.BackOffMS),
        catchError(error => {
          result.Failed = true;
          result.Error = error;
          return of(error);
        })
      )
      .toPromise().then( (httpRespone: HttpResponse<BackendToFrontendEvent>) => {
        if (result.Failed) {
          res.error(result);
        } else {
          result.Failed = false;
          result.HttpResult = httpRespone;
          res.next(result);
          res.complete();
        }
      })

    })
  }

  /**
   * Recursive push for infinite (or until stopped) event requesting from backend
   * @param sub Observer
   */
  private push(sub: Observer<ResponseStatus>): void {

    if (!this.Status) {
      sub.complete();
      return;
    }

    this.GetLastEvents(this.sourceID).toPromise().then(
      (resolve: ResponseStatus) => {
        sub.next(resolve);
        this.push(sub);
      },
      (reject: ResponseStatus) => {
        sub.error(reject);
      }
    );

  }
}
