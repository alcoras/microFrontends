import { Component } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { MaterialsReceiptsAPI } from '../../services/MaterialsReceiptsAPI';
import { EventBusService } from '../../services/EventBusService';
import { Subscription } from 'rxjs';
import { MaterialReceiptSelectedData } from '@shared/Adds/MaterialReceiptSelectedData';
import { BarCodeCast, MaterialsListTablePart, ValidationStatus } from 'event-proxy-lib-src';

@Component({
  selector: 'materials-receipts-list-table-table',
  templateUrl: './MaterialsReceiptsTableView.html',
})
export class MaterialsReceiptsTableComponent {

  public Loading: boolean;
  public TotalRecords: number;

  public MaterialsListTableData: MaterialsListTablePart[];
  public MaterialsListBarScanData: BarCodeCast[];

  public CurrentMaterialsReceiptData: MaterialReceiptSelectedData;
  public SelectedRow: MaterialsListTablePart;

  public Columns = [
    // skipping irrelevant information
    // { field: 'LineNumber', header: 'LineNumber'},
    { field: 'CodeSOne', header: 'CodeSOne?'},
    { field: 'Type', header: 'Type'},
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
        this.eventBus.OnMaterialReceiptSelected.subscribe(async () => await this.requestAndUpdateTableAsync()));

      this.subscriptions.push(this.eventBus.OnScanTableRowSelected.subscribe((id: number) => this.ScanTableRowSelected(id)));
  }

  public OnDestroy(): void {
    this.subscriptions.forEach(element => {
      element.unsubscribe();
    });
  }

  /**
   * Handle row selection from ScanTable
   * @param id MaterialsReceiptsTableId
   */
  public ScanTableRowSelected(id: number): void {
    this.SelectedRow = null;

    if (id == null)
      return;

    for (let i = 0; i < this.MaterialsListTableData.length; i++) {
      if (this.MaterialsListTableData[i].Id == id)
        this.SelectedRow = this.MaterialsListTableData[i];
    }
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

    const materialReceiptResponseIndex = 0;
    const barCodesResponseIndex = 1;

    const waitResponses = await Promise.all([
      this.materialsReceiptsAPI.MaterialsReceiptsTableQueryAsync(materialsReceiptData.Id, page, limit),
      this.materialsReceiptsAPI.BarCodesByMaterialReceiptQueryAsync(materialsReceiptData.Id)
    ]);

    var status = new ValidationStatus();
    status.CombineErrors(waitResponses[materialReceiptResponseIndex]);
    status.CombineErrors(waitResponses[barCodesResponseIndex]);

    if (status.HasErrors()) {
      console.warn(status.ErrorList.toString());
      this.Loading = false;
      return;
    }

    this.MaterialsListTableData = waitResponses[materialReceiptResponseIndex].Result.MaterialsDataTablePartList;
    this.TotalRecords = waitResponses[materialReceiptResponseIndex].Result.TotalRecordsAmount;

    this.MaterialsListBarScanData = waitResponses[barCodesResponseIndex].Result.BarCodeDetails;

    this.eventBus.LastMaterialsListTableData = this.MaterialsListTableData;
    this.eventBus.LastBarCodesOfMaterialReceipt = this.MaterialsListBarScanData;

    this.Loading = false;
  }
}
