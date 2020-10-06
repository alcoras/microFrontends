export enum EnvironmentTypes {
  Production,
  Staging,
  /**
   * Local environment with Shell and connection to a local backend
   */
  Development,
  /**
   * Database-Backend: Local;
   * Login: No;
   * Shell: No;
   * Nginx: No;
   */
  Isolated,
  Solo
}
