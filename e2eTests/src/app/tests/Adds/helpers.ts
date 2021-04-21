/**
 * Generates random number
 * @param max max int value
 * @returns random number
 */
export function genRandomNumber(max: number): number {
  return Math.floor(Math.random() * Math.floor(max));
}

/**
 * Returns promise after ms
 * @param ms miliseconds
 * @returns Promise
 */
export function delay(ms: number): Promise<void> {
  return new Promise( resolve => setTimeout(resolve, ms) );
}
export const BackendURL = "http://localhost:7001";
export const BackendPort = "7001";
