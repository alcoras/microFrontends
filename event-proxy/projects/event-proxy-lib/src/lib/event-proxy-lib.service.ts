import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventProxyLibService
{

  apiGatewayURL = "http://localhost:3000";

  constructor(
    private httpClient: HttpClient
  ) { }

  dispatchEvent(): Observable<any>
  {
    let data = { "data" :  "{ '1': '1'}" };
    return this.httpClient.post<any>(this.apiGatewayURL, data,  { headers: new HttpHeaders().set('Content-Type', 'application/json') }  );

    //return this.httpClient.post<any>(this.apiGatewayURL, { title: 'Angular POST Request Example' });
  }

  addEventListener()
  {

  }

}
