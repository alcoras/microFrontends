import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, Observer } from 'rxjs';
import { catchError, shareReplay, repeat, subscribeOn } from 'rxjs/operators';
import { uEventsIds } from './shared/models/event';
import { EnvService } from './env/env.service';
import { retryWithBackoff } from './retry/retry.pipe';

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

  private retryTimes = 9999999;

  public Status = false;

  constructor(
    public env: EnvService,
    private httpClient: HttpClient
  ) {
    this.apiGatewayURL = `${env.apiGatewayUrl}:${env.apiGatewayPort}`;
  }

  private startTimer() {
    this.interval = setInterval(() => {
      this.timer++;
    }, 100);
  }

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
    this.sourceID = sourceID;

    return new Observable (
      (observer: Observer<any>) => {
        this.Status = true;
        this.startTimer();
        this.recursiveSub(observer);
      });
  }

  private preRecursiveSub(obs: Observer<any>) {
    if (this.timer > 1 && this.newConnCount > 10) {
      this.endQNA();
    } else {
      this.newConnCount++;
    }

    this.recursiveSub(obs);
  }

  public endQNA() {
    this.endOnNext = true;
    this.Status = false;
    this.stopTimer();
  }

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

  public changeApiGatewayURL(newURL: string) {
    this.apiGatewayURL = newURL;
  }

  public confirmEvents(srcId: number, idList: number[]) {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    return this.httpClient
    .post
    (
      this.apiGatewayURL + '/confirmEvents',
      { SourceId: srcId, ids: idList },
      { headers, observe: 'response' }
    )
    .pipe
    (
      catchError(this.handleErrors<any>('confirmEvents', ''))
    );
  }

  public dispatchEvent(event: any[]) {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    const url = this.apiGatewayURL + this.endpoint;
    const body = { EventID: uEventsIds.RegisterNewEvent, events: event };
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

  private getLastEvents(srcId: string, traceId: number = 0, timeout: number = 5): Observable<any> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    const url = this.apiGatewayURL + this.endpoint;
    const body = { EventID: uEventsIds.GetNewEvents, SourceId: srcId };
    return this.httpClient.post
    (
      url,
      body,
      { headers, observe: 'response' }
    )
    .pipe
    (
      catchError(this.handleErrors<any>('getLastEvent', '')),
    );
  }

  public handleErrors<T>(op = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${op} failed: ${error.message}`);

      return of(result as T);
    };
  }
}
