import { PersonDataRead } from 'src/app/Models/index';

/**
 * Returns promise after ms
 * @param ms miliseconds
 * @returns Promise
 */
export function delay(ms: number): Promise<any> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Gets random number
 * @param max max int value
 * @returns random number
 */
export function genRandomNumber(max): number {
  return Math.floor(Math.random() * Math.floor(max));
}

/**
 * Test event
 */
export class TestEvent extends PersonDataRead {

}
