/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, of, Subject, Observer } from 'rxjs';
import { catchError  } from 'rxjs/operators';
import { uEvent, uEventsIds } from './models/event';
import { EnvironmentService } from './services/EnvironmentService';

/**
 * Event Proxy service for communication with API gateway
 * micro service
 */
@Injectable({
  providedIn: 'root'
})
export class EventProxyLibService {
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
   * when EndQNA is called
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
   * Establishes communication with backend to receive new events.
   * It maintains it and if fails resets it.
   * @param sourceID Source ID, used for registering receiver.
   * @returns Observable with respones from backend
   */
  public StartQNA(sourceID: string): Observable<HttpResponse<any>> {

    if (!sourceID) {
      throw new Error('SourceID was not provided in StartQNA');
    }

    this.sourceID = sourceID;
    this.Status = true;

    console.log(`${this.sourceID} starts listening to events on ${this.apiGatewayURL}`);

    return new Observable<HttpResponse<any>>( sub => {
      this.push(sub);
    });
  }

  /**
   * Ends qna - sends complete to StartQNA observable
   */
  public EndQNA(): void {
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
  public ConfirmEvents(srcId: string, idList?: number[], confirmAll = false): Observable<HttpResponse<any>> {
    const body = {
      EventID: uEventsIds.FrontEndEventReceived,
      SourceID: srcId,
      Ids: idList,
      MarkAllReceived: confirmAll,
    };

    return this.sendEvent('ConfirmEvents', body);
  }

  /**
   * Dispatches event to backend
   * @param event array of events one wish to register
   * @returns Observable with response or error
   */
  public DispatchEvent(event: | uEvent | uEvent[]): Observable<HttpResponse<any>> {
    const eventList = [].concat(event);
    const body = {
      EventID: uEventsIds.RegisterNewEvent,
      events: eventList
    };

    return this.sendEvent('DispatchEvent', body);
  }

  /**
   * Gets all unconfirmed events from backend
   * @param srcId SourceID
   * @returns HTTPResponse (or error) with events
   */
  public GetLastEvents(srcId: string): Observable<HttpResponse<any>> {

    const body = {
      EventID: uEventsIds.GetNewEvents,
      SourceId: srcId,
    };

    return this.sendEvent('GetLastEvents', body);
  }

  /**
   * Tries to log in into system
   * @param timestamp ISO formatted time string
   * @param signature Signature
   * @returns HTTPResponse (or error) with events
   */
  public LogIn(timestamp: string, signature: string): Observable<HttpResponse<any>> {

    const body = {
      EventId: uEventsIds.LoginRequested,
      LoginTimestamp: timestamp,
      LoginSignature: signature
    }

    return this.sendEvent('LogIn', body, true);
  }

  /**
   * Sends event to backend (APIGateway microservice)
   * @param caller function which called
   * @param body message body
   * @param anonymous (default false) if set to true will not include LoginToken field
   * @returns HttpResponse observable
   */
  private sendEvent(caller: string, body: any, anonymous = false): Observable<any> {

    if (!this.apiGatewayURL) {
      throw Error('ApiGateway URL is undefined');
    }

    const headers = this.jsonHeaders;
    const url = this.apiGatewayURL + this.endpoint;

    if (!anonymous) {
      body['LoginToken'] = this.environmentService.AuthorizationToken;
    }

    console.log(`${caller}, source:${this.sourceID} sends to ${url} body: ${JSON.stringify(body)}`);

    // TODO: integrate retryWithBackoff and test it
    return this.httpClient.post(
      url,
      body,
      { headers, observe: 'response' }
    )
    .pipe(
      catchError(this.handleErrors<any>(caller)),
    );
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
      (resolve: HttpResponse<any>) => {
        sub.next(resolve);
        this.push(sub);
      },
      (reject) => {
        setTimeout(() => {
          sub.next(reject);
          this.push(sub);
        }, 1000);
      }
    );
  }

  /**
   * Handles errors
   * @param operation method/function name
   * @param result result observer
   * @returns Error observable
   */
  private handleErrors<T>(operation = 'operation', result?: T) {
    return (error): Observable<T> => {

      console.error(`${operation} failed: ${error.message}`);
      console.error(error);

      // keep app running by returning an empty result
      return of(result);
    };
  }
}
