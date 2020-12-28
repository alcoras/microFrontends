import { Component } from '@angular/core';
import { MaterialsListTablePart, MaterialsTableListDTO } from '../Models/index';
import { LazyLoadEvent } from 'primeng/api';
import { MaterialsReceiptsAPI } from '../services/MaterialsReceiptsAPI';
import { EventBusService } from '../services/EventBus.service';
import { Subscription } from 'rxjs';
import { MaterialReceiptSelectedData } from '../Models/MaterialReceiptSelectedData';

@Component({
  selector: 'materials-receipts-list-table-table',
  templateUrl: './MaterialsReceiptsTableView.html',
  styleUrls: ['./Styles.scss']
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
          .subscribe(() => this.requestMaterialsListTableData()));
  }

  public OnDestroy(): void {
    this.subscriptions.forEach(element => {
      element.unsubscribe();
    });
  }

  public LoadDataLazy(event: LazyLoadEvent): void {

    const page = event.first/event.rows + 1;
    const limit = event.rows;

    this.requestMaterialsListTableData(page, limit);
  }

  private requestMaterialsListTableData(page = 1, limit = 30): void {

    this.Loading = true;

    const materialsReceiptData = this.eventBus.LastSelectedMaterialsReceiptData;
    this.CurrentMaterialsReceiptData = materialsReceiptData;

    if (!materialsReceiptData || materialsReceiptData.Id <= 0) {
      console.error(materialsReceiptData);
      throw new Error("MaterialsReceiptId was not given or id equal/below 0");
    }

    const res = this.materialsReceiptsAPI
       .MaterialsReceiptsTableQuery(materialsReceiptData.Id, page, limit);

    res.then( (data: MaterialsTableListDTO) => {
      this.MaterialsListTableData = data.Items;
      this.TotalRecords = data.Total;
      this.Loading = false;
    });

  }
}
