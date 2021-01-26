import { Component } from "@angular/core";
import { LocationsData, MaterialsReceiptsLocationsReadListResults } from "event-proxy-lib-src";
import { LazyLoadEvent } from "primeng/api";
import { MaterialsReceiptsAPI } from "../../services/MaterialsReceiptsAPI";

@Component({
  templateUrl: "LocationsTableView.html",
  selector: "material-receipts-locations-table"
}) export class LocationsTableComponent {
  public Locations: LocationsData[];

  public Loading: boolean;
  public TotalRecords: number;

  public NewDialogDisplay: boolean;
  public NewDialogSubmited: boolean;
  public NewLocation = new LocationsData();

  public Columns = [
    {field: "LocationDescription", header: "Description"},
    {field: "LocationBarCode", header: "BarCode"},
  ]

  public constructor(private materialsReceiptsAPI: MaterialsReceiptsAPI) {
    this.Loading = true;
  }

  public async DeleteLocation(data: LocationsData): Promise<void> {
    await this.materialsReceiptsAPI.LocationDeleteAsync(data);

    this.RefreshTable();
  }

  public DialogNewLocation(): void {
    this.NewDialogDisplay = true;
    this.NewLocation = new LocationsData();
    this.NewDialogSubmited = false;
  }

  public async SaveNewLocation(): Promise<void> {
    await this.materialsReceiptsAPI.LocationCreateAsync(this.NewLocation);

    this.NewDialogSubmited = true;
    this.NewDialogDisplay = false;
    this.RefreshTable();
  }

  public async LazyLoad(event: LazyLoadEvent): Promise<void> {

    const page = event.first/event.rows + 1;
    const limit = event.rows;

    await this.queryLocationsAsync(page, limit);
  }

  public async RefreshTable(): Promise<void> {
    await this.queryLocationsAsync();
  }

  private async queryLocationsAsync(page = 1, limit = 30): Promise<void> {
    this.Loading = true;

    const res = await this.materialsReceiptsAPI.LocationsQueryAsync(null, page, limit);

    this.Locations = res.Result.LocationsDataList;
    this.TotalRecords = res.Result.TotalRecordsAmount;
    this.Loading = false;
  }
}
