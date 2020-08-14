import { MicroFrontendInfo } from './MicroFrontendInfo';

/**
 * Micro fronteds/services and their data used for communication
 * SourceId is mandatory, while SourceName is informational
 */
export class UParts {
  /**
   * Frontend shell which loads every other micro frontend
   */
  public static FrontendShell: MicroFrontendInfo = {
    SourceId: '1000',
    SourceName: 'FrontendShell'
  };

  /**
   * Menu micro frontend normally is loaded into shell as first frontend
   */
  public static Menu: MicroFrontendInfo = {
    SourceId: '1001',
    SourceName: 'Menu'
  };

  /**
   * Personnel micro frontend
   */
  public static Personnel: MicroFrontendInfo = {
    SourceId: '1002',
    SourceName: 'Personnel'
  };

  /**
   * Occupations micro frontend
   */
  public static Occupations: MicroFrontendInfo = {
    SourceId: '1005',
    SourceName: 'Occupations'
  };

  /**
   * Micro frontend manager. Part of Frontend shell
   */
  public static UFManager: MicroFrontendInfo = {
    SourceId: '1006',
    SourceName: 'UFManager'
  };

  /**
   * Micro frontend observer. Used for monitoring and alike function
   */
  public static Observer: MicroFrontendInfo = {
    SourceId: '1007',
    SourceName: 'Observer'
  };

  /**
   * Gets source name from source id
   * @param sourceId source id string
   * @returns source name
   */
  public static GetSourceNameFromSourceID(sourceId: string): string {
    const members = Object.getOwnPropertyNames(this);

    for (const key of members) {
      if (this[key].SourceId === sourceId) {
        return this[key].SourceName;
      }
    }

    return undefined;
  }

  /**
   * Gets id name from source name
   * @param sourceName source id string
   * @returns source name
   */
  public static GetSourceIdFromSourceName(sourceName: string): string {
    const members = Object.getOwnPropertyNames(this);

    for (const key of members) {
      if (this[key].SourceName === sourceName) {
        return this[key].SourceId;
      }
    }

    return undefined;
  }
}
