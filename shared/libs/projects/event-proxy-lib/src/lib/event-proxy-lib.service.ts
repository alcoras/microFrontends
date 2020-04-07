import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import { catchError, repeat, takeUntil } from 'rxjs/operators';
import { uEvent, uEventsIds } from './models/event';
import { EnvService } from './env/env.service';

/**
 * Injects method name
 * @param target ?
 * @param name name of method
 * @param desc ?
 */
export function annotateName(target, name, desc) {
  const method = desc.value;
  desc.value = function() {
      const prevMethod = this.currentMethod;
      this.currentMethod = name;
      method.apply(this, arguments);
      this.currentMethod = prevMethod;
  };
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
   * API gateway to which all http requests will be sent
   */
  private readonly endpoint = '/newEvents';

  /**
   * Header which which will be used in all requests
   */
  private readonly jsonHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  /**
   * directive annotateName uses it to populate with current method name
   */
  private currentMethod: string;

  /**
   * Source id
   */
  private sourceID = '';

  /**
   * Api gateway's URL
   */
  private apiGatewayURL: string;

  /**
   * variable for Status getter, setter
   */
  private status;

  /**
   * Stop is being used as a flag to stop QNA with backend
   * when EndQNA is called
   */
  private Stop = new Subject();

  /**
   * Gets status
   */
  get Status(): boolean {
    return this.status;
  }

  /**
   * Sets status
   */
  set Status(val: boolean) {
    this.status = val;
  }

  /**
   * Creates an instance of event proxy lib service.
   * @param env Injects Environment settings
   * @param httpClient Injects Angular HttpClient
   */
  constructor(
    public env: EnvService,
    private httpClient: HttpClient) {
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
    // TODO: should check if apigateway is correct url
    this.Status = false;

    console.log(`${this.sourceID} starts listening to events on ${this.apiGatewayURL}`);

    // TODO: integrate retry and test it
    return this.GetLastEvents(this.sourceID)
      .pipe(
        repeat(9999), // stack too deep error if more than 9999
        takeUntil(this.Stop),
      );
  }

  /**
   * Ends qna - sends complete to StartQNA observable
   */
  public EndQNA() {
    this.Status = false;
    this.Stop.next(true);
    console.log(`${this.sourceID} Ending listening `);
  }

  /**
   * Changes APi gateway URL
   * @param newURL new url string
   */
  public ChangeApiGatewayURL(newURL: string) {
    this.apiGatewayURL = newURL;
    console.log(`${this.sourceID} changing api gateway to ${this.apiGatewayURL}`);
  }

  /**
   * Confirms events
   * @param srcId Source Id
   * @param [idList] Array of ids to confirm specific events
   * @param [confirmAll] if set true will confirm all outstanding events
   * @returns HttpResponse observable
   */
  @annotateName
  public ConfirmEvents(srcId: string, idList?: number[], confirmAll = false): Observable<HttpResponse<any>> {

    const body = {
      EventID: uEventsIds.FrontEndEventReceived,
      SourceID: srcId,
      Ids: idList,
      MarkAllReceived: confirmAll };

    return this.sendEvent(this.currentMethod, body);
  }

  /**
   * Dispatches event to backend
   * @param event array of events one wish to register
   * @returns Observable with response or error
   */
  @annotateName
  public DispatchEvent(event: | uEvent | uEvent[]): Observable<HttpResponse<any>> {
    const eventList = [].concat(event);
    const body = { EventID: uEventsIds.RegisterNewEvent, events: eventList };

    return this.sendEvent(this.currentMethod, body);
  }

  /**
   * Gets unreceived events from backend
   * @param srcId SourceID
   * @param [traceId] unused
   * @param [timeout] unused
   * @returns HTTPResponse (or error) with events
   */
  @annotateName
  public GetLastEvents(srcId: string): Observable<HttpResponse<any>> {

    const body = { EventID: uEventsIds.GetNewEvents, SourceId: srcId };

    return this.sendEvent(this.currentMethod, body);
  }

  /**
   * Sends event to backend (APIGateway microservice)
   * @param caller function which called
   * @param body message body
   * @returns HttpResponse observable
   */
  private sendEvent(caller: string, body: any): Observable<HttpResponse<any>> {
    const headers = this.jsonHeaders;
    const url = this.apiGatewayURL + this.endpoint;
    const debug = url + JSON.stringify(body);

    console.log(`${caller}, source:${this.sourceID} sends to ${url} body: ${JSON.stringify(body)}`);

    return this.httpClient.post
    (
      url,
      body,
      { headers, observe: 'response' }
    )
    .pipe
    (
      catchError((err, result) => this.handleErrors<any>(caller, err, result, debug)),
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
  private handleErrors<T>(op = 'operation', errorMsg?: any, result?: T, data?: string) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${op} failed: ${errorMsg}`);
      console.log(data);

      return of(result);
    };
  }
}
