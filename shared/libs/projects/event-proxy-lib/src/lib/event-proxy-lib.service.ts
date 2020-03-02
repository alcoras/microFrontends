import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, of, Observer } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { EnvService } from './env/env.service';

@Injectable({
  providedIn: 'root'
})
export class EventProxyLibService {
  private sourceID = 1;
  // TODO: make requests customizable (test_local, test_yuk, prod?)
  public apiGatewayURL: string;
  public apiRequests: {[id: string]: HttpRequest<any> } = {};

  constructor(
    public env: EnvService,
    private httpClient: HttpClient
  ) {
    this.apiGatewayURL = `${env.apiGatewayUrl}:${env.apiGatewayPort}`;
  }

  public startQNA(sourceID: number): Observable<any> {
    this.sourceID = sourceID;

    return new Observable (
      (observer: Observer<any>) => {
        // TODO: if after some retries fails short circuit it
        this.recursiveSub(observer, null);
      });
  }

  private preRecursiveSub(obs: Observer<any>, count: number) {
    this.recursiveSub(obs, count);
  }

  private recursiveSub(obs: Observer<any>, count: number) {

    this.getLastEvents(this.sourceID).subscribe
    (
      (res: HttpResponse<any>) => {
        if (res.body != null) {
          obs.next(res.body);
        }
      },
      () => { /*preRecursiveSub(obs, count);*/ },
      () => { this.preRecursiveSub(obs, count); }
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

  public dispatchEvent(event: any) {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    return this.httpClient
    .post
    (
      this.apiGatewayURL + '/newEvent',
      event,
      { headers, observe: 'response' }
    )
    .pipe
    (
      catchError(this.handleErrors<any>('dispatchEvent', ''))
    );
  }

  public getLastEvents(srcId: number, traceId: number = 0, timeout: number = 5) {
    const headers = new HttpHeaders({ timeout: timeout.toString()});
    return this.httpClient.get
    (
      this.apiGatewayURL + `/newEvents/${srcId}/${traceId}`,
      { headers, observe: 'response' }
    )
    .pipe
    (
      catchError(this.handleErrors<any>('getLastEvent', ''))
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
