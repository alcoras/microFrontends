import { Observable, throwError, of } from 'rxjs';
import { retryWhen, mergeMap, delay } from 'rxjs/operators';

const errorMsg = (maxRetry: number): string => `Failed after ${maxRetry}.`;

const MAX_RETRIES = 3;
const BACKOFFMS = 1000;

export function retryWithBackoff(delayMs: number, maxRetry = MAX_RETRIES, backoffMS = BACKOFFMS) {
  let retries = maxRetry;

  return (src: Observable<any>) =>
  src.pipe(
    retryWhen((errors: Observable<any>) => errors.pipe(
      mergeMap(error => {
        if (retries-- > 0) {
          const backoffTime = delayMs + (maxRetry - retries) * backoffMS;
          return of(error).pipe(delay(backoffTime));
        }
        return throwError(errorMsg(maxRetry));
      })
    ))
  );
}
