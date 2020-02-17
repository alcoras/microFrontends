import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { IEvent } from "@protocol-shared/models/event";

@Injectable({
  providedIn: 'root'
})
export class EventProxyLibService
{

  apiGatewayURL = "https://ng-test1-2a96e.firebaseio.com";

  constructor(
    private httpClient: HttpClient
  ) { }

  changeApiGatewayURL(newURL:string)
  {
    this.apiGatewayURL = newURL;
  }

  dispatchEvent(event: IEvent)
  {
    const headers = new HttpHeaders({"Content-Type":"application/json"});

    return this.httpClient
    .put<IEvent>
    (
      this.apiGatewayURL + "/events.json",
      event,
      {headers:headers}
    )
    .pipe
    (
      catchError(this.handleErrors<any>('dispatchEvent', ""))
    )
  }

  handleErrors<T>(op ='operation', result?: T)
  {
    return (error:any):Observable<T> =>
    {
      console.error(error);
      console.log(`${op} failed: ${error.message}`);

      return of(result as T);
    }
  }

}
