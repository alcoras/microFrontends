/**
 * Returns promise after ms
 * @param ms miliseconds
 * @returns Promise
 */
export function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Gets random number
 * @param max max int value
 * @returns random number
 */
export function genRandomNumber(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
