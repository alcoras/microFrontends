import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, of, Subject, throwError } from 'rxjs';
import { catchError, repeat, takeUntil, timeout, retry, repeatWhen } from 'rxjs/operators';
import { uEvent, uEventsIds } from './models/event';
import { EnvironmentService } from './services/environment.service';

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
   * How many times new connection will be
   * established in StartQNA observable
   * Note: stack too deep error if more than 9999
   */
  private readonly repeatTimes = 9999;

  /**
   * Gets/Sets api gateway url
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
   */
  public get Status(): boolean {
    return this.status;
  }

  public set Status(val: boolean) {
    this.status = val;
  }

  /**
   * Creates an instance of event proxy lib service.
   * @param env Injects Environment settings
   * @param httpClient Injects Angular HttpClient
   */
  constructor(
    public env: EnvironmentService,
    private httpClient: HttpClient) {
      const url = `${this.env.APIGatewayUrl}:${this.env.APIGatewayPort}`;
      this.ApiGatewayURL = url;
  }

  /**
   * Establisheds communication with backend to receive new events.
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

    return this.GetLastEvents(this.sourceID)
      .pipe(
        repeatWhen(() => this.GetLastEvents(this.sourceID)),
        takeUntil(this.stop),
      );
  }

  /**
   * Ends qna - sends complete to StartQNA observable
   */
  public EndQNA() {
    this.Status = false;
    this.stop.next(true);
    console.log(`${this.sourceID} Ending listening`);
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
      MarkAllReceived: confirmAll };

    return this.sendEvent('ConfirmEvents', body);
  }

  /**
   * Dispatches event to backend
   * @param event array of events one wish to register
   * @returns Observable with response or error
   */
  public DispatchEvent(event: | uEvent | uEvent[]): Observable<HttpResponse<any>> {
    const eventList = [].concat(event);
    const body = { EventID: uEventsIds.RegisterNewEvent, events: eventList };

    return this.sendEvent('DispatchEvent', body);
  }

  /**
   * Gets unreceived events from backend
   * @param srcId SourceID
   * @param [traceId] unused
   * @param [timeout] unused
   * @returns HTTPResponse (or error) with events
   */
  public GetLastEvents(srcId: string): Observable<HttpResponse<any>> {

    const body = { EventID: uEventsIds.GetNewEvents, SourceId: srcId };

    return this.sendEvent('GetLastEvents', body);
  }

  /**
   * Sends event to backend (APIGateway microservice)
   * @param caller function which called
   * @param body message body
   * @returns HttpResponse observable
   */
  private sendEvent(caller: string, body: any) {

    if (!this.apiGatewayURL) {
      throw Error('ApiGateway URL is undefined');
    }

    const headers = this.jsonHeaders;
    const url = this.apiGatewayURL + this.endpoint;

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
   * Handles errors
   * @template T type of error
   * @param [op] name of method
   * @param [errorMsg] error message provided by result
   * @param [result] error Observable
   * @returns Error Observable
   */
  private handleErrors<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      console.error(`${operation} failed: ${error.message}`);
      console.error(error);

      // keep app running by returning an empty result
      return of(result);
    };
  }
}
