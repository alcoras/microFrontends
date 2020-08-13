/**
 * Message which will be sent to API gateway
 */

export class LoginRequest {
  /**
   * ISO time string
   */
  public Timestamp: string;

  /**
   * Signature starting with 0x
   */
  public Signature: string;

  public Error: string;

  public FullError: string;
}
