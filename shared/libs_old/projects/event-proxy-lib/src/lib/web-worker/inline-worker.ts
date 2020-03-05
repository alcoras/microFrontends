import { Observable, Subject } from 'rxjs';

export class InlineWorker {

  private readonly worker: Worker;
  private onMessage = new Subject<MessageEvent>();
  private onError = new Subject<ErrorEvent>();

  constructor(func) {

    const WORKER_ENABLED = !!(Worker);

    if (WORKER_ENABLED) {
      const functionBody = func.toString().replace(/^[^{]*{\s*/, '').replace(/\s*}[^}]*$/, '');

      this.worker = new Worker(URL.createObjectURL(
        new Blob([ functionBody ], { type: 'text/javascript' })
      ));

      this.worker.onmessage = (data) => {
        this.onMessage.next(data);
      };

      this.worker.onerror = (data) => {
        this.onError.next(data);
      };

    } else {
      throw new Error('WebWorker is not enabled');
    }
  }

  postMessage(data) {
    this.worker.postMessage(data);
  }

  onmessage(): Observable<MessageEvent> {
    return this.onMessage.asObservable();
  }

  onerror(): Observable<ErrorEvent> {
    return this.onError.asObservable();
  }

  terminate() {
    if (this.worker) {
      this.worker.terminate();
    }
  }
}

class worker
{
  result = 0;
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
}

