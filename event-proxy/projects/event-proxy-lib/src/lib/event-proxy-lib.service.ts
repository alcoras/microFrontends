import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  apiGatewayURL = "https://ng-test1-2a96e.firebaseio.com";

  constructor(
    private httpClient: HttpClient
  ) { }

  changeApiGatewayURL(newURL:string)
  {
    this.apiGatewayURL = newURL;
  }

  dispatchEvent(event: uEvent)
  {
    const headers = new HttpHeaders({"Content-Type":"application/json"});

    return this.httpClient
    .put<uEvent>
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

  async testing_getLastEventLoop()
  {
    setInterval( () =>
    {
      this.testing_getLastEvent().subscribe
      (
        (response) => {  }
      )
    }, 1000);
  }

  testing_run()
  {

    const worker = new InlineWorker(() => {
      // START OF WORKER THREAD CODE
      console.log('Start worker thread, wait for postMessage: ');

      const calculateCountOfPrimeNumbers = (limit) => {

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

    worker.onmessage().subscribe((data) => {
      console.log('Calculation done: ', new Date() + ' ' + data.data);
      this.result = data.data.primeNumbers;
      worker.terminate();
    });

    worker.onerror().subscribe((data) => {
      console.log(data);
    });
  }

  testing_getLastEvent()
  {
    return this.httpClient
    .get(this.apiGatewayURL + "/events.json")
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
