import { Component } from "@angular/core";
import { LazyLoadEvent } from "primeng/api";
import { Subscription } from "rxjs";
import { MaterialsReceiptsScanTable, ScanTableQueryParams } from "../Models";
import { MaterialsReceiptsScanTableReadListResults } from "../Models/BackendEvents";
import { MaterialReceiptSelectedData } from "../Models/MaterialReceiptSelectedData";
import { EventBusService } from "../services/EventBus.service";
import { MaterialsReceiptsAPI } from "../services/MaterialsReceiptsAPI";

@Component({
  selector: 'materials-receipts-scan-table',
  templateUrl: './View.html',
})
export class ScanTableComponent {
  public Loading: boolean;
  public TotalRecords: number;

  public ScanTableData: MaterialsReceiptsScanTable[];
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
    private eventBus: EventBusService
  ) {
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

    const res = this.materialsReceiptsAPI
      .ScanTableQuery(queryParams);

    res.then( (data: MaterialsReceiptsScanTableReadListResults) => {
      // this.MaterialsListScanTableData = data.ScanTableDataList;
      this.TotalRecords = data.TotalRecordsAmount;
      this.Loading = false;
    });
  }
}
