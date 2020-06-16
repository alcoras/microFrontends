import { uEvent } from '../../models/event';

/**
 * Event for informing about successful login
 */
export class LoginSuccess extends uEvent {
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
