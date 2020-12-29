import { Component } from "@angular/core";
import { LazyLoadEvent } from "primeng/api";
import { Subscription } from "rxjs";
import { ScanTableData, ScanTableQueryParams } from "../Models";
import { MaterialsReceiptsScanTableReadListResults } from "../Models/BackendEvents";
import { MaterialReceiptSelectedData } from "../Models/MaterialReceiptSelectedData";
import { EventBusService } from "../services/EventBus.service";
import { MaterialsReceiptsAPI } from "../services/MaterialsReceiptsAPI";

@Component({
  selector: 'materials-receipts-scan-table',
  templateUrl: './ScanTableView.html',
})
export class ScanTableComponent {
  public Loading: boolean;
  public TotalRecords: number;

  public ScanTableData: ScanTableData[];
  public CurrentMaterialsReceiptData: MaterialReceiptSelectedData;

  public ColumnsRelation = [
    { field: 'MaterialsId', header: 'MaterialsId'},
    { field: 'MaterialsReceiptsListId', header: 'MaterialsReceiptsListId'},
    { field: 'MaterialsReceiptsTableId', header: 'MaterialsReceiptsTableId'},
    { field: 'Quantity', header: 'Quantity'},
    { field: 'Unit', header: 'Unit'}
  ];

  private subscriptions: Subscription[];

  public constructor(
    private materialsReceiptsAPI: MaterialsReceiptsAPI,
    private eventBus: EventBusService) {

    this.Loading = true;

    this.subscriptions = [];

    this.subscriptions.push(
      this.eventBus.OnMaterialReceiptSelected
        .subscribe(() => this.requestMaterialsScanTableData()));
  }

  public OnDestroy(): void {
    this.subscriptions.forEach(element => {
      element.unsubscribe();
    });
  }

  public RefreshTable(): void {
    this.requestMaterialsScanTableData();
  }

  public AddNewScan(): void {
    // show dialog or something for new scan
  }

  public DeleteScan(data: ScanTableData): void {
    this.materialsReceiptsAPI.ScanTableDelete(data).toPromise();
    this.requestMaterialsScanTableData();
  }

  public LoadDataLazy(event: LazyLoadEvent): void {

    const page = event.first/event.rows + 1;
    const limit = event.rows;

    this.requestMaterialsScanTableData(page, limit);
  }

  private requestMaterialsScanTableData(page = 1, limit = 30): void {
    this.Loading = true;

    const data = this.eventBus.LastSelectedMaterialsReceiptData;
    this.CurrentMaterialsReceiptData = data;

    if (!data || data.Id <= 0) {
      console.error(data);
      throw new Error("MaterialsReceiptId was not given or id equal/below 0");
    }

    const queryParams: ScanTableQueryParams = {
      MaterialReceiptsListId: data.Id,
      Page: page,
      Limit: limit
    };

    this.materialsReceiptsAPI
    .ScanTableQuery(queryParams)
    .then( (data: MaterialsReceiptsScanTableReadListResults) => {
      this.ScanTableData = data.ScanTableDataList;
      this.TotalRecords = data.TotalRecordsAmount;
      this.Loading = false;
    });
  }
}
