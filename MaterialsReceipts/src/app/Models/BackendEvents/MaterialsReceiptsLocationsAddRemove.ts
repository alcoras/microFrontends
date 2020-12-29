import { CoreEvent, EventIds, MicroFrontendInfo } from 'event-proxy-lib-src';
import { LocationsData } from '../LocationsData';

/**
 * Enum to indicate whether event is of type update or craete
 */
export enum MaterialsReceiptsLocationsAddRemoveFlag {
  Create = EventIds.MaterialsReceiptsLocationsAdd,
  Delete = EventIds.MaterialsReceiptsLocationsRemove
}

export class MaterialsReceiptsLocationsAddRemove extends CoreEvent {

  public LocationsId: number;
  public LocationDescription: string;
  public LocationBarCode: string;

  public constructor(
    sourceInfo: MicroFrontendInfo,
    locationData: LocationsData,
    addRemoveFlag: MaterialsReceiptsLocationsAddRemoveFlag) {

      super();

      this.LocationsId = locationData.Id;
      this.LocationDescription = locationData.LocationDescription;
      this.LocationBarCode = locationData.LocationBarCode;

      this.SourceId = sourceInfo.SourceId;
      this.SourceName = sourceInfo.SourceName;
      this.EventId = addRemoveFlag;
  }
}
