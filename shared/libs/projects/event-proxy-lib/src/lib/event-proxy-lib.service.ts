import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import { catchError, repeat, takeUntil, share } from 'rxjs/operators';
import { uEventsIds, uEvent } from './models/event';
import { EnvService } from './env/env.service';

@Injectable({
  providedIn: 'root'
})
export class EventProxyLibService {
  private sourceID = '';
  private apiGatewayURL: string;
  private endpoint = '/newEvents';

  private status;

  private Stop = new Subject();
  private jsonHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  get Status(): boolean {
    return this.status;
  }

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
  public StartQNA(sourceID: string): Observable<any> {

    if (!sourceID) {
      throw new Error('SourceID was not provided in StartQNA');
    }

    this.sourceID = sourceID;
    // TODO: should check if apigateway is correct url
    this.Status = false;

    console.log(`${this.sourceID} starts listening to events on ${this.apiGatewayURL}`);

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
  public ConfirmEvents(srcId: string, idList?: number[], confirmAll = false) {
    const headers = this.jsonHeaders;
    const url = this.apiGatewayURL + this.endpoint;
    const body = {
      EventID: uEventsIds.FrontEndEventReceived,
      SourceID: srcId,
      Ids: idList,
      MarkAllReceived: confirmAll };

    console.log(`confirmEvents from ${this.sourceID}`);
    console.log(`URL: ${url}, body: ${JSON.stringify(body)}`);

    return this.httpClient.post
    (
      url,
      body,
      { headers, observe: 'response' }
    )
    .pipe
    (
      catchError(this.handleErrors<any>('confirmEvents', ''))
    );
  }

  /**
   * Dispatches event to backend
   * @param event array of events one wish to register
   * @returns Observable with response or error
   */
  public DispatchEvent(event: | uEvent | uEvent[]) {
    const headers = this.jsonHeaders;
    const eventList = [].concat(event);

    const url = this.apiGatewayURL + this.endpoint;
    const body = { EventID: uEventsIds.RegisterNewEvent, events: eventList };

    console.log(`dispatchEvent from ${this.sourceID}`);
    console.log(`URL: ${url}, body: ${JSON.stringify(body)}`);

    return this.httpClient.post
    (
      url,
      body,
      { headers, observe: 'response' }
    )
    .pipe
    (
      catchError(this.handleErrors<any>('dispatchEvent', '')),
    );
  }

  /**
   * Gets unreceived events from backend
   * @param srcId SourceID
   * @param [traceId] unused
   * @param [timeout] unused
   * @returns HTTPResponse (or error) with events
   */
  public GetLastEvents(srcId: string): Observable<HttpResponse<any>> {
    const headers = this.jsonHeaders;

    const url = this.apiGatewayURL + this.endpoint;
    const body = { EventID: uEventsIds.GetNewEvents, SourceId: srcId };
    const debug = url + JSON.stringify(body);

    console.log(`getLastEvents from ${this.sourceID}`);
    console.log(`URL: ${url}, body: ${JSON.stringify(body)}`);

    return this.httpClient.post
    (
      url,
      body,
      { headers, observe: 'response' }
    )
    .pipe
    (
      catchError(this.handleErrors<any>('getLastEvent', null, debug)),
    );
  }

  /**
   * Handles errors
   * @template T type of error?
   * @param [op] name of method
   * @param [result] error message?
   * @returns Observable with error?
   */
  public handleErrors<T>(op = 'operation', result?: T, data?: string) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${op} failed: ${error.message}`);
      console.log(data);

      return of(result);
    };
  }
}
