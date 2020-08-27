/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, Subject, Observer, Subscriber, of } from 'rxjs';
import { uEvent, uEventsIds } from './models/event';
import { EnvironmentService } from './services/EnvironmentService';
import { retryWithBackoff } from './retry/retry.pipe';
import { ResponseStatus } from './ResponseStatus';
import { catchError, timeout } from 'rxjs/operators';

/**
 * Event Proxy service for communication with API gateway
 * micro service
 */
@Injectable({
  providedIn: 'root'
})
export class EventProxyLibService {

  /**
   * Connection timeout before retry
   */
  public Timeout = 1000;
  /**
   * delay before retry
   */
  public DelayMs = 1000;
  /**
   * maximum tries before giving up
   */
  public Retries = 10;

  /**
   * add to delay before each retry
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
   * Api gateway's URL
   */
  private apiGatewayURL: string;


  /**
   * Gets/Sets api gateway url
   * @returns api gateway url
   */
  public get ApiGatewayURL(): string {
    return this.apiGatewayURL;
  }

  public set ApiGatewayURL(value: string) {
    this.apiGatewayURL = value;
  }

  /**
   * Stop is being used as a flag to stop QNA with backend
   * when EndListeningToBackend is called
   */
  private stop = new Subject();

  /**
   * status
   */
  private status = false;

  /**
   * Gets/Sets status which true if there QNA (connection with constant request for new
   * events) with backend.
   * @returns status
   */
  public get Status(): boolean {
    return this.status;
  }

  public set Status(val: boolean) {
    this.status = val;
  }

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
   * Establishes communication with backend to receive new events (only listening).
   * It maintains it and if fails resets it.
   * @param sourceId Source ID, used for registering receiver.
   * @param eventPerserFunctionAsync async function which will parse events
   */
  public InitializeConnection(
    sourceId: string,
    eventPerserFunctionAsync: (eventList: uEvent[] | uEvent) => Promise<void>): void {

    this.StartQNA(sourceId).subscribe(
      (response: ResponseStatus) => {
        if (!response.HttpResult) { throw new Error('Can\'t connect to backend'); }

        if (!response.HttpResult.body) { return; }

        if (!Object.prototype.hasOwnProperty.call(response.HttpResult.body, 'EventId')) {
          throw new Error('No EventId in message');
        }

        if (response.HttpResult.body['EventId'] === uEventsIds.GetNewEvents) {
          eventPerserFunctionAsync(response.HttpResult.body.Events);
        } else if (response.HttpResult.body['EventId'] === uEventsIds.TokenFailure) {
          throw new Error("Token failure");
        } else {
          console.error(response);
          throw new Error("Unrecognized eventId");
        }
      },
      (error: ResponseStatus) => {
        throw new Error(error.Error);
      }
    )
  }

  public StartQNA(sourceID: string): Observable<ResponseStatus> {

    if (!sourceID) {
      throw new Error('SourceID was not provided in StartListeningToBackend');
    }

    this.sourceID = sourceID;
    this.Status = true;

    console.log(`${this.sourceID} starts listening to events on ${this.apiGatewayURL}`);

    return new Observable<ResponseStatus>( sub => {
      this.push(sub);
    });
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
    this.stop.next(true);
    console.log(`${this.sourceID} Ending listening.`);
  }

  /**
   * Confirms events
   * @param srcId Source Id
   * @param [idList] Array of ids to confirm specific events
   * @param [confirmAll] if set true will confirm all outstanding events
   * @returns HttpResponse observable
   */
  public ConfirmEvents(srcId: string, idList?: number[], confirmAll = false): Observable<ResponseStatus> {
    const body = {
      EventID: uEventsIds.FrontEndEventReceived,
      SourceID: srcId,
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
  public DispatchEvent(event: | uEvent | uEvent[]): Observable<ResponseStatus> {
    const eventList = [].concat(event);
    const body = {
      EventID: uEventsIds.RegisterNewEvent,
      events: eventList
    };

    return this.sendMessage('DispatchEvent', body);
  }

  /**
   * Gets all unconfirmed events from backend
   * @param srcId SourceID
   * @returns HTTPResponse (or error) with events
   */
  public GetLastEvents(srcId: string): Observable<ResponseStatus> {

    const body = {
      EventID: uEventsIds.GetNewEvents,
      SourceId: srcId,
    };

    return this.sendMessage('GetLastEvents', body);
  }

  /**
   * Tries to log in into system
   * @param timestamp ISO formatted time string
   * @param signature Signature
   * @returns HTTPResponse (or error) with events
   */
  public LogIn(timestamp: string, signature: string): Observable<ResponseStatus> {

    const body = {
      EventId: uEventsIds.LoginRequested,
      LoginTimestamp: timestamp,
      LoginSignature: signature
    }

    return this.sendMessage('LogIn', body, true);
  }

  /**
   * Sends existing token to get new token
   * @returns  HTTPResponse (or error) with events
   */
  public RenewToken(): Observable<any> {

    const body = {
      EventId: uEventsIds.RenewToken
    }

    return this.sendMessage('RenewToken', body);
  }

  /**
   * Sends http message to backend (APIGateway microservice)
   * @param caller function which called
   * @param body message body
   * @param anonymous (default false) if set to true will not include LoginToken field
   * @returns HttpResponse observable
   */
  private sendMessage(caller: string, body: any, anonymous = false): Observable<ResponseStatus> {

    const result = new ResponseStatus();
    if (!this.apiGatewayURL) {
      throw Error('ApiGateway URL is undefined');
    }

    const headers = this.jsonHeaders;
    const url = this.apiGatewayURL + this.endpoint;

    if (!anonymous) {
      body['Token'] = this.environmentService.AuthorizationToken;
    }

    console.log(`${caller}, source:${this.sourceID} sends to ${url} body: ${JSON.stringify(body)}`);

    return new Observable( (res: Subscriber<ResponseStatus>) => {

      this.httpClient.post(
        url,
        body,
        { headers, observe: 'response' }
      )
      .pipe(
        timeout(this.Timeout),
        retryWithBackoff(this.DelayMs, this.Retries, this.BackOffMS),
        catchError(error => {
          result.Failed = true;
          result.Error = error;
          return of(error);
        })
      ).toPromise().then( (resp: HttpResponse<any>) => {
        if (result.Failed) {
          res.error(result);
        }
        else {
          result.Failed = false;
          result.HttpResult = resp;
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
  private push(sub: Observer<any>): void {
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
        setTimeout(() => {
          sub.next(reject);
          this.push(sub);
        }, 1000);
      }
    );
  }
}
