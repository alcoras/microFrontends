import { Component } from '@angular/core';
import { MaterialsList } from '@uf-shared-models/';
import { LazyLoadEvent } from 'primeng/api';
import { GetMaterialsList } from '../interfaces/GetMaterialsList';
import { MaterialsReceiptsAPI  } from '../services/MaterialsReceiptsAPI';

@Component({
  selector: 'receipt-materials-table',
  templateUrl: './Table.html',
  styles: [`
    :host ::ng-deep .p-datatable .p-datatable-thead > tr > th {
        position: -webkit-sticky;
        position: sticky;
        top: 10px;
    }

    @media screen and (max-width: 64em) {
        :host ::ng-deep .p-datatable .p-datatable-thead > tr > th {
            top: 99px;
        }
    }
  `]
})
export class TableComponent {
  public Loading: boolean;
  public TotalRecords: number;
  public DisplayDialog: boolean;

  public SelectedRecord: MaterialsList;

  public Cols = [
    { field: 'Number', header: 'Number'},
    { field: 'RegisterDateTime', header: 'RegisterDateTime'},
    { field: 'SignMark', header: 'Signed?'},
    { field: 'SignPerson', header: 'Signee'},
  ];

  public MaterialsListData: MaterialsList[];

  public constructor(private materialsReceiptsAPI: MaterialsReceiptsAPI)
  { }


  public OnRowSelect(): void {
    this.DisplayDialog = true;
  }

  public RefreshTable(): void {
    this.Loading = true;

    const res = this.materialsReceiptsAPI.Get(1, 10);

    res.then( (data: GetMaterialsList) => {
      this.MaterialsListData = data.Items;
      this.TotalRecords = data.Total;
    })

    this.Loading = false;
  }

  public LoadDataLazy(event: LazyLoadEvent): void {
    this.Loading = true;

    //in a real application, make a remote request to load data using state metadata from event
    //event.first = First row offset
    //event.rows = Number of rows per page
    //event.sortField = Field name to sort with
    //event.sortOrder = Sort order as number, 1 for asc and -1 for dec
    //filters: FilterMetadata object having field as key and filter value, filter matchMode as value

    // const res = this.materialsReceiptsAPI.Get(event.first, event.rows);
    const res = this.materialsReceiptsAPI.Get(event.first + 1, event.rows);

    res.then( (data: GetMaterialsList) => {
      this.MaterialsListData = data.Items;
      this.TotalRecords = data.Total;
    })

    this.Loading = false;
  }
}
