import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, of, Subject, throwError } from 'rxjs';
import { catchError, repeat, takeUntil } from 'rxjs/operators';
import { uEvent, uEventsIds } from './models/event';
import { EnvService } from './env/env.service';

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
   * Gets api gateway url
   */
  public get ApiGatewayURL(): string {
    return this.apiGatewayURL;
  }

  /**
   * Sets api gateway url
   */
  public set ApiGatewayURL(value: string) {
    this.apiGatewayURL = value;
  }

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
    console.log(`${this.sourceID} changing api gateway to ${this.apiGatewayURL}`);
  }

  /**
   * Creates an instance of event proxy lib service.
   * @param env Injects Environment settings
   * @param httpClient Injects Angular HttpClient
   */
  constructor(
    public env: EnvService,
    private httpClient: HttpClient) {
      this.env.ReadEnvironmentVars();
      const url = `${this.env.apiGatewayUrl}:${this.env.apiGatewayPort}`;
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
   * Confirms events
   * @param srcId Source Id
   * @param [idList] Array of ids to confirm specific events
   * @param [confirmAll] if set true will confirm all outstanding events
   * @returns HttpResponse observable
   */
  public ConfirmEvents(srcId: string, idList?: number[], confirmAll = false) {
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

    return this.httpClient.post(
      url,
      body,
      { headers, observe: 'response' }).pipe(
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
