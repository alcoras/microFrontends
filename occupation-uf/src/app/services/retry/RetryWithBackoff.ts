import { Observable, throwError, of } from 'rxjs';
import { retryWhen, mergeMap, delay } from 'rxjs/operators';

const errorMsg = (maxRetry: number): string => `Failed after ${maxRetry}.`;

const MAX_RETRIES = 3;
const BACKOFFMS = 1000;

/**
 * R
 * @param delayMs delay before request
 * @param maxRetry max retries
 * @param backoffMS backs off after
 * @returns Observable pipe
 */
export function RetryWithBackoff(delayMs: number, maxRetry = MAX_RETRIES, backoffMS = BACKOFFMS):
  (src: Observable<unknown>) => Observable<unknown> {

  let retries = maxRetry;
  return (src: Observable<unknown>): Observable<unknown> =>
  src.pipe(
    retryWhen((errors: Observable<unknown>) => errors.pipe(
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
