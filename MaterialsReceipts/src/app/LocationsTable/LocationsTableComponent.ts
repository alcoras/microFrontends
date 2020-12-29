import { Component } from "@angular/core";
import { LazyLoadEvent } from "primeng/api";
import { MaterialsReceiptsLocationsReadListResults } from "../Models/BackendEvents";
import { LocationsData } from "../Models/LocationsData";
import { MaterialsReceiptsAPI } from "../services/MaterialsReceiptsAPI";

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

  public constructor(
    private materialsReceiptsAPI: MaterialsReceiptsAPI
  ) {
    this.Loading = true;
  }

  public DeleteLocation(data: LocationsData): void {
    this.materialsReceiptsAPI.LocationDelete(data).toPromise();

    this.RefreshTable();
  }

  public DialogNewLocation(): void {
    this.NewDialogDisplay = true;
    this.NewLocation = new LocationsData();
    this.NewDialogSubmited = false;
  }

  public SaveNewLocation(): void {
    this.materialsReceiptsAPI.LocationCreate(this.NewLocation)
    .toPromise();

    this.NewDialogSubmited = true;
    this.NewDialogDisplay = false;
    this.RefreshTable();
  }

  public LazyLoad(event: LazyLoadEvent): void {

    const page = event.first/event.rows + 1;
    const limit = event.rows;

    this.queryLocations(page, limit);
  }

  public RefreshTable(): void {
    this.queryLocations();
  }

  private queryLocations(page = 1, limit = 30): void {
    this.Loading = true;

    this.materialsReceiptsAPI.LocationsQuery(null, page, limit)
    .then( (data: MaterialsReceiptsLocationsReadListResults) => {
      this.Locations = data.LocationsDataList;
      this.TotalRecords = data.TotalRecordsAmount;
      this.Loading = false;
    })
  }
}
