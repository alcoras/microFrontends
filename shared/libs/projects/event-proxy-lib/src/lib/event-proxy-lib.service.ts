import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, Observer } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { uEventsIds, uEvent } from './models/event';
import { EnvService } from './env/env.service';

@Injectable({
  providedIn: 'root'
})
export class EventProxyLibService {
  private sourceID = '';
  private apiGatewayURL: string;
  private endpoint = '/newEvents';

  private timer = 0;
  private newConnCount = 0;
  private endOnNext = false;
  private interval;
  private status;

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
    private httpClient: HttpClient
  ) {
    // TODO: should check if apigateway is correct url
    this.apiGatewayURL = `${env.apiGatewayUrl}:${env.apiGatewayPort}`;
    this.Status = false;
  }

  /**
   * Starts timer which is used in recursive Observable routing
   * to prevent non-stop requests
   */
  private startTimer() {
    this.interval = setInterval(() => {
      this.timer++;
    }, 100);
  }

  /**
   * Stops timer which is used in recursive Observable routing
   * to prevent non-stop requests
   */
  private stopTimer() {
    clearInterval(this.interval);
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

    return new Observable (
      (observer: Observer<any>) => {
        this.Status = true;
        this.startTimer();
        this.recursiveSub(observer);
      });
  }

  /**
   * Pre recursive - a funtion which checks if requests are not sent
   * too quick
   * @param obs Observable
   */
  private preRecursiveSub(obs: Observer<any>) {
    // TODO_HIGH: fix this
    // if (this.timer > 1 && this.newConnCount > 10) {
    //   this.endQNA();
    // }

    // this.newConnCount++;
    // this.timer = 0;
    this.recursiveSub(obs);
  }

  /**
   * Ends qna - sends complete to StartQNA observable
   */
  public endQNA() {
    this.endOnNext = true;
    this.Status = false;
    this.stopTimer();
  }

  /**
   * Recursives function which keeps on reconnecting after fail or successful
   * response
   * @param obs previous Observable
   * @returns if endOnNext is true returns so that recursive function stops
   */
  private recursiveSub(obs: Observer<any>) {

    if (this.endOnNext) {
      obs.complete();
      return;
    }

    this.getLastEvents(this.sourceID).subscribe
    (
      (res: HttpResponse<any>) => {
        if (res) {
          obs.next(res);
        }
      },
      (err: HttpErrorResponse) => { obs.error(err); },
      () => { this.preRecursiveSub(obs); }
    );
  }

  /**
   * Changes APi gateway URL
   * @param newURL new url string
   */
  public changeApiGatewayURL(newURL: string) {
    this.apiGatewayURL = newURL;
  }

  public confirmEvents(srcId: string, idList: number[]) {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    const url = this.apiGatewayURL + this.endpoint;
    const body = { EventID: uEventsIds.FrontEndEventReceived, SourceID: srcId, Ids: idList };
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
  public dispatchEvent(event: | uEvent | uEvent[]) {
    const eventList = [].concat(event);
    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    const url = this.apiGatewayURL + this.endpoint;
    const body = { EventID: uEventsIds.RegisterNewEvent, events: eventList };
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
  private getLastEvents(srcId: string, traceId: number = 0, timeout: number = 5): Observable<HttpResponse<any>> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    const url = this.apiGatewayURL + this.endpoint;
    const body = { EventID: uEventsIds.GetNewEvents, SourceId: srcId };
    const debug = url + JSON.stringify(body);
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

      return of(result as T);
    };
  }
}
