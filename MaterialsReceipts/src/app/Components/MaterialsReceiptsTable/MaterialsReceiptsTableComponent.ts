import { Component } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { MaterialsReceiptsAPI } from '../../services/MaterialsReceiptsAPI';
import { EventBusService } from '../../services/EventBusService';
import { Subscription } from 'rxjs';
import { MaterialReceiptSelectedData } from '@shared/Adds/MaterialReceiptSelectedData';
import { MaterialsListTablePart } from 'event-proxy-lib-src';

@Component({
  selector: 'materials-receipts-list-table-table',
  styles: [
    `
    .ui-state-highlight {
      background: red;
    }
    `
  ],
  templateUrl: './MaterialsReceiptsTableView.html',
})
export class MaterialsReceiptsTableComponent {

  private selectedRowTimeoutMs = 1000;

  public Loading: boolean;
  public TotalRecords: number;

  public MaterialsListTableData: MaterialsListTablePart[];

  public CurrentMaterialsReceiptData: MaterialReceiptSelectedData;
  public SelectedRow: MaterialsListTablePart;

  public Columns = [
    // skipping irrelevant information
    // { field: 'LineNumber', header: 'LineNumber'},
    // { field: 'CodeSOne', header: 'CodeSOne?'},
    // { field: 'Type', header: 'Type'},
    // { field: 'Account', header: 'Account'},
    // { field: 'Unit', header: 'Units'},
    { field: 'NameSOne', header: 'Name'},
    { field: 'PersonMRP', header: 'Person MRP'},
    { field: 'Quantity', header: 'Expected'},
    { field: 'ScannedQuantity', header: 'Left to scan'},
  ];

  private subscriptions: Subscription[];

  public constructor(
    private materialsReceiptsAPI: MaterialsReceiptsAPI,
    private eventBus: EventBusService) {

      this.Loading = true;

      this.subscriptions = [];

      this.subscriptions.push(
        this.eventBus.OnMaterialReceiptSelected
          .subscribe(async () => await this.requestAndUpdateTableAsync()));

      this.subscriptions.push(this.eventBus.OnScanTableRowSelected.subscribe((data: number) => this.ScanTableRowSelected(data)));
  }

  public OnDestroy(): void {
    this.subscriptions.forEach(element => {
      element.unsubscribe();
    });
  }

  public RowSelected(data: MaterialsListTablePart): void {
    this.eventBus.MaterialReceiptDataRowSelected(data);
  }

  /**
   * Handle row selection from ScanTable
   * @param id MaterialsReceiptsTableId
   */
  public ScanTableRowSelected(id: number): void {
    this.SelectedRow = null;
    if (id == null)
      return;
      
    this.SelectedRow = this.MaterialsListTableData[0];

    // for (var i = 0; i < this.MaterialsListTableData.length; i++) {
    //   if (this.MaterialsListTableData[i].MaterialsReceiptsListId == id)
    // }
  }

  public async LoadDataLazy(event: LazyLoadEvent): Promise<void> {

    const page = event.first/event.rows + 1;
    const limit = event.rows;

    await this.requestAndUpdateTableAsync(page, limit);
  }

  private async requestAndUpdateTableAsync(page = 1, limit = 30): Promise<void> {

    this.Loading = true;

    const materialsReceiptData = this.eventBus.LastSelectedMaterialsReceiptData;
    this.CurrentMaterialsReceiptData = materialsReceiptData;

    if (!materialsReceiptData || materialsReceiptData.Id <= 0) {
      console.error(materialsReceiptData);
      throw new Error("MaterialsReceiptId was not given or id equal/below 0");
    }

    const response = await this.materialsReceiptsAPI.MaterialsReceiptsTableQueryAsync(materialsReceiptData.Id, page, limit);

    if (response.HasErrors()) {
      console.warn(response.ErrorList.toString());
      this.Loading = false;
      return;
    }

    this.MaterialsListTableData = response.Result.MaterialsDataTablePartList;
    this.TotalRecords = response.Result.TotalRecordsAmount;
    this.Loading = false;
    this.eventBus.LastMaterialsListTableData = this.MaterialsListTableData;
  }
}
