import { Component } from '@angular/core';
import { MaterialsListTablePart, MaterialsTableListDTO } from '../Models/index';
import { LazyLoadEvent } from 'primeng/api';
import { MaterialsReceiptsAPI } from '../services/MaterialsReceiptsAPI';
import { EventBusService } from '../services/EventBus.service';

@Component({
  selector: 'materials-receipts-list-table-table',
  templateUrl: './View.html',
  styleUrls: ['./Styles.scss']
})
export class MaterialsReceiptsTableComponent {

  public MaterialsReceiptId: number;

  public Loading: boolean ;
  public TotalRecords: number;

  public MaterialsListTableData: MaterialsListTablePart[];

  public ColumnsRelation = [
    { field: 'LineNumber', header: 'LineNumber'},
    { field: 'NameSOne', header: 'NameSOne'},
    { field: 'CodeSOne', header: 'CodeSOne?'},
    { field: 'Type', header: 'Type'},
    { field: 'PersonMRP', header: 'PersonMRP'},
    { field: 'Quantity', header: 'Quantity'},
    { field: 'Unit', header: 'Unit'},
    { field: 'Account', header: 'Account'},
    { field: 'MaterialsReceiptsListId', header: 'MaterialsReceiptsListId'},
  ];

  public constructor(
    private materialsReceiptsAPI: MaterialsReceiptsAPI,
    private eventBus: EventBusService) {
      this.MaterialsReceiptId = this.eventBus.LastSelectedMaterialsReceiptId;
  }

  public LoadDataLazy(event: LazyLoadEvent): void {
    this.Loading = true;

    //event.first = First row offset
    //event.rows = Number of rows per page
    //event.sortField = Field name to sort with
    //event.sortOrder = Sort order as number, 1 for asc and -1 for dec
    //filters: FilterMetadata object having field as key and filter value, filter matchMode as value

    const page = event.first/event.rows + 1;
    const limit = event.rows;

    if (!this.MaterialsReceiptId || this.MaterialsReceiptId <= 0) {
      console.error(this.MaterialsReceiptId);
      throw new Error("MaterialsReceiptId was not given or equal/below 0");
    }

    const res = this.materialsReceiptsAPI
       .GetMaterialsReceiptsTable(this.MaterialsReceiptId, page, limit);

    res.then( (data: MaterialsTableListDTO) => {
      this.MaterialsListTableData = data.Items;
      this.TotalRecords = data.Total;
      this.Loading = false;
    });
  }
}
