import { Component } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { MaterialsReceiptsAPI } from '../../services/MaterialsReceiptsAPI';
import { EventBusService } from '../../services/EventBusService';
import { Subscription } from 'rxjs';
import { MaterialReceiptSelectedData } from '@shared/Adds/MaterialReceiptSelectedData';
import { MaterialsListTablePart, MaterialsReceiptsTablePartReadListResults } from 'event-proxy-lib-src';

@Component({
  selector: 'materials-receipts-list-table-table',
  templateUrl: './MaterialsReceiptsTableView.html',
})
export class MaterialsReceiptsTableComponent {

  public Loading: boolean;
  public TotalRecords: number;

  public MaterialsListTableData: MaterialsListTablePart[];

  public CurrentMaterialsReceiptData: MaterialReceiptSelectedData;

  public ColumnsRelation = [
    { field: 'LineNumber', header: 'LineNumber'},
    { field: 'NameSOne', header: 'NameSOne'},
    { field: 'CodeSOne', header: 'CodeSOne?'},
    { field: 'Type', header: 'Type'},
    { field: 'PersonMRP', header: 'PersonMRP'},
    { field: 'Quantity', header: 'Quantity'},
    { field: 'Unit', header: 'Unit'},
    { field: 'Account', header: 'Account'},
  ];

  private subscriptions: Subscription[];

  public constructor(
    private materialsReceiptsAPI: MaterialsReceiptsAPI,
    private eventBus: EventBusService) {

      this.Loading = true;

      this.subscriptions = [];

      this.subscriptions.push(
        this.eventBus.OnMaterialReceiptSelected
          .subscribe(async () => await this.requestMaterialsListTableDataAsync()));
  }

  public OnDestroy(): void {
    this.subscriptions.forEach(element => {
      element.unsubscribe();
    });
  }

  public async LoadDataLazy(event: LazyLoadEvent): Promise<void> {

    const page = event.first/event.rows + 1;
    const limit = event.rows;

    await this.requestMaterialsListTableDataAsync(page, limit);
  }

  private async requestMaterialsListTableDataAsync(page = 1, limit = 30): Promise<void> {

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
  }
}
