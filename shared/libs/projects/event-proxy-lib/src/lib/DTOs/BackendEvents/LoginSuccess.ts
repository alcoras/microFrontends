import { CoreEvent } from '../CoreEvent';

/**
 * Event for informing about successful login
 */
export class LoginSuccess extends CoreEvent {
  /**
   * Token active since (ISO date)
   */
  public TokenBegins: string;
  /**
   * Token expires at (ISO date)
   */
  public TokenExpires: string;
  /**
   * Authentication token
   */
  public Token: string;
}
