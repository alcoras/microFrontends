/* eslint-disable @typescript-eslint/no-explicit-any */
import { Observable, throwError, of } from 'rxjs';
import { retryWhen, mergeMap, delay } from 'rxjs/operators';

export const errorMsg = (maxRetry: number): string => `Failed to connect after ${maxRetry} try(ies).`;

const MAX_RETRIES = 3;
const BACKOFFMS = 1000;

/**
 * Retries sending request
 * @param delayMs delay before retry
 * @param maxRetry maximum tries before giving up
 * @param backoffMS add to delay before retry
 * @returns Observable Pipe
 */
export function RetryWithBackoff(delayMs: number, maxRetry = MAX_RETRIES, backoffMS = BACKOFFMS):
(src: Observable<any>) => Observable<any> {
  let retries = maxRetry;
  return (src: Observable<any>): Observable<any> =>
  src.pipe(
    retryWhen((errors: Observable<any>) => errors.pipe(
      mergeMap(error => {
        if (retries-- > 0) {
          const backoffTime = delayMs + (maxRetry - retries) * backoffMS;
          console.log("backing off " + retries + " " + backoffTime);
          return of(error).pipe(delay(backoffTime));
        }
        return throwError(errorMsg(maxRetry));
      })
    ))
  );
}
