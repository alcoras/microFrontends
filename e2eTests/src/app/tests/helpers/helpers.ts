/**
 * Generates random number
 * @param max max int value
 * @returns random number
 */
export function genRandomNumber(max: number): number {
  return Math.floor(Math.random() * Math.floor(max));
}
