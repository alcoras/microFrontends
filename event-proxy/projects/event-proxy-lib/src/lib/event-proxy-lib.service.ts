import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable, of, Subscription, interval, Observer } from 'rxjs';
import { catchError } from 'rxjs/operators';

function delay(ms: number) {
  return new Promise( resolve => setTimeout(resolve, ms) );
}

@Injectable({
  providedIn: 'root'
})
export class EventProxyLibService
{

  //TODO: make requests customizable (test_local, test_yuk, prod?)
  public apiGatewayURL = "http://localhost:3000";
  public apiRequests:{ [id:string] : HttpRequest<any> } = {}

  private recursiveSub(obs:Observer<any>, oldEvent:any)
  {
    var newEvent;
    this.getLastEvents(1000).subscribe
    (
      (res:HttpResponse<any>) =>
      {
        obs.next(res.body);
        this.recursiveSub(obs, newEvent);

        // TODO: if after some retries fails short circuit it
        // should be waiting till that event is taken care of
      },
      () => { this.recursiveSub(obs, oldEvent); },
      () => { this.recursiveSub(obs, oldEvent); }
    )
  }

  public qnaWithTheGateway = Observable.create
  (
    async (observer: Observer<any>) =>
    {
      this.recursiveSub(observer, null);
    }
  )

  constructor(
    private httpClient: HttpClient
  ) {}

  public changeApiGatewayURL(newURL:string)
  {
    this.apiGatewayURL = newURL;
  }

  public confirmEvents(srcId:number, idList:number[])
  {
    const headers = new HttpHeaders({"Content-Type":"application/json"});

    return this.httpClient
    .post
    (
      this.apiGatewayURL + "/confirmEvents",
      { "SourceId": srcId, "ids": idList },
      { headers:headers, observe: "response" }
    )
    .pipe
    (
      catchError(this.handleErrors<any>('confirmEvents', ""))
    )
  }

  public dispatchEvent(event: any)
  {
    const headers = new HttpHeaders({"Content-Type":"application/json"});

    return this.httpClient
    .post
    (
      this.apiGatewayURL + "/newEvent",
      event,
      { headers:headers, observe: "response" }
    )
    .pipe
    (
      catchError(this.handleErrors<any>('dispatchEvent', ""))
    )
  }

  public getLastEvents(srcId:number, traceId:number = 0, timeout:number = 5)
  {
    const headers = new HttpHeaders({"timeout": timeout.toString()});

    return this.httpClient.get
    (
      this.apiGatewayURL + `/newEvents/${srcId}/${traceId}`,
      { headers: headers, observe: "response" }
    )
    .pipe
    (
      catchError(this.handleErrors<any>('getLastEvent', ""))
    )
  }

  public handleErrors<T>(op ='operation', result?: T)
  {
    return (error:any):Observable<T> =>
    {
      console.error(error);
      console.log(`${op} failed: ${error.message}`);

      return of(result as T);
    }
  }

}
