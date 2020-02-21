import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { uEvent } from "@protocol-shared/models/event";
import { InlineWorker } from './inline-worker';

@Injectable({
  providedIn: 'root'
})
export class EventProxyLibService
{
  result = 0;
  //apiGatewayURL = "https://ng-test1-2a96e.firebaseio.com";
  apiGatewayURL = "http://localhost:3000";

  public apiRequests:{ [id:string] : string } = {}

  constructor(
    private httpClient: HttpClient
  )
  {
    this.setupApiRequests();
  }

  setupApiRequests()
  {
    this.apiRequests["post_new_event"] = "/newEvent";
    this.apiRequests["get_last_events"] = "/newEvents";
    this.apiRequests["get_keep-alive-test"] = "/keep-alive-test";
  }

  changeApiGatewayURL(newURL:string)
  {
    this.apiGatewayURL = newURL;
  }

  dispatchEvent(event: any)
  {
    const headers = new HttpHeaders({"Content-Type":"application/json"});

    return this.httpClient
    .post
    (
      this.apiGatewayURL + this.apiRequests["post_new_event"],
      event,
      {headers:headers, observe: "response"}
    )
    .pipe
    (
      catchError(this.handleErrors<any>('dispatchEvent', ""))
    )
  }

  testing_run()
  {

    const worker = new InlineWorker(() => {
      // START OF WORKER THREAD CODE
      console.log('Start worker thread, wait for postMessage: ');

      const calculateCountOfPrimeNumbers = (limit) =>
      {

        const isPrime = num => {
          for (let i = 2; i < num; i++) {
            if (num % i === 0) { return false; }
          }
          return num > 1;
        };

        let countPrimeNumbers = 0;

        while (limit >= 0) {
          if (isPrime(limit)) { countPrimeNumbers += 1; }
          console.log(countPrimeNumbers);
          limit--;
        }

        // this is from DedicatedWorkerGlobalScope ( because of that we have postMessage and onmessage methods )
        // and it can't see methods of this class
        // @ts-ignore
        this.postMessage({
          primeNumbers: countPrimeNumbers
        });
      };

      // @ts-ignore
      this.onmessage = (evt) => {
        console.log('Calculation started: ' + new Date());
        calculateCountOfPrimeNumbers(evt.data.limit);
      };
      // END OF WORKER THREAD CODE
    });

    worker.postMessage({ limit: 300000 });

    worker.onmessage().subscribe((data) =>
    {
      console.log('Calculation done: ', new Date() + ' ' + data.data);
      this.result = data.data.primeNumbers;
      worker.terminate();
    });

    worker.onerror().subscribe((data) => {
      console.log(data);
    });
  }

  getLastEvents(srcId:number, traceId:number = 0, timeout:number = 5)
  {
    const headers = new HttpHeaders({"timeout": timeout.toString()});

    return this.httpClient.get
    (
      this.apiGatewayURL + `/newEvents/${srcId}/${traceId}`,
      { headers: headers, observe: "response" }
    )
    .pipe
    (
      catchError(this.handleErrors<any>('testing_getLastEvent', ""))
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
