import { Component } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { MaterialsReceiptsAPI } from '../../services/MaterialsReceiptsAPI';
import { EventBusService } from '../../services/EventBusService';
import { Subscription } from 'rxjs';
import { MaterialReceiptSelectedData } from '@shared/Adds/MaterialReceiptSelectedData';
import { BarCodeCast, MaterialsListTablePart, ValidationStatus } from 'event-proxy-lib-src';
import { ScanTableAggregate } from '@shared/Adds/ScanTableAggregate';

@Component({
  selector: 'materials-receipts-list-table-table',
  templateUrl: './MaterialsReceiptsTableView.html',
})
export class MaterialsReceiptsTableComponent {

  public LastScanTableAggregateList: ScanTableAggregate[];
  public LeftToScanDictionary: { [materialReceiptTableId: number]: number };

  public Loading: boolean;
  public TotalRecords: number;

  public MaterialsListTableData: MaterialsListTablePart[];
  public MaterialsListBarScanData: BarCodeCast[];

  public CurrentMaterialsReceiptData: MaterialReceiptSelectedData;
  public SelectedRow: MaterialsListTablePart;

  public Columns = [
    // skipping irrelevant information
    { field: 'Id', header: 'Id'},
    // { field: 'LineNumber', header: 'LineNumber'},
    { field: 'CodeSOne', header: 'CodeSOne?'},
    { field: 'Type', header: 'Type'},
    // { field: 'Account', header: 'Account'},
    // { field: 'Unit', header: 'Units'},
    { field: 'NameSOne', header: 'Name'},
    { field: 'PersonMRP', header: 'Person MRP'},
    { field: 'Quantity', header: 'Expected'},
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

      this.subscriptions.push(this.eventBus.OnScanTableChanged.subscribe( () => this.handleScanTableDataChange()));
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

  private handleScanTableDataChange(): void {
    this.LastScanTableAggregateList = this.eventBus.LastScanDataAggregateList;

    this.LeftToScanDictionary = {};

    for (var i = 0; i < this.MaterialsListTableData.length; i++) {
      this.LeftToScanDictionary[this.MaterialsListTableData[i].Id] = 0;
    }

    let entry: ScanTableAggregate;
    let id: number;
    for (var i = 0; i < this.LastScanTableAggregateList.length; i++) {
      entry = this.LastScanTableAggregateList[i];
      id = entry.MaterialsReceiptsTableId;

      this.LeftToScanDictionary[id] += entry.Quantity;
    }

    console.log(this.LeftToScanDictionary);
  }

  private async requestAndUpdateTableAsync(page = 1, limit = 30): Promise<void> {

    this.Loading = true;

    const materialsReceiptData = this.eventBus.LastSelectedMaterialsReceiptData;
    this.CurrentMaterialsReceiptData = materialsReceiptData;

    if (!materialsReceiptData || materialsReceiptData.Id < 1) {
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
