import { Component } from '@angular/core';
import { MaterialsList } from '@uf-shared-models/';
import { LazyLoadEvent } from 'primeng/api';
import { GetMaterialsList } from '../interfaces/GetMaterialsList';
import { ReadListQueryParams } from '../helpers/ReadListQueryParams';
import { MaterialsReceiptsAPI  } from '../services/MaterialsReceiptsAPI';

interface IPrimeNgDate {
  firstDayOfWeek: number;
  dayNames: string[];
  dayNamesShort: string[];
  dayNamesMin: string[];
  monthNames: string[];
  monthNamesShort: string[];
  today: string;
  clear: string;
}

enum Categories {
  Both = 'Both',
  Signed = 'Signed',
  Unsigned = 'Unsigned'
}

interface Category {
  name: string,
  key: string
}

@Component({
  selector: 'receipt-materials-table',
  templateUrl: './Table.html',
  styleUrls: ['./Table.scss']
})
export class TableComponent {

  public DateRange: Date[];
  public UkrainianDate: IPrimeNgDate;

  public Categories: Category[] = [
    {name: Categories.Both, key:'B'},
    {name: Categories.Signed, key: 'S'},
    {name: Categories.Unsigned, key: 'U'}]
  public SelectedCategory: Category;

  public Loading: boolean;
  public TotalRecords: number;
  public DisplayDialog: boolean;

  public SelectedRecord: MaterialsList;

  public BarCode: string;

  public Cols = [
    { field: 'Number', header: 'Number'},
    { field: 'RegisterDateTime', header: 'RegisterDateTime'},
    { field: 'SignMark', header: 'Signed?'},
    { field: 'SignPerson', header: 'Signee'},
  ];

  public MaterialsListData: MaterialsList[];

  private currentLimit = 0;
  private currentPage = 0;

  public constructor(private materialsReceiptsAPI: MaterialsReceiptsAPI)
  { }

  public ngOnInit(): void {
    this.UkrainianDate = {
      firstDayOfWeek: 1,
      dayNames: [ "domingo","lunes","martes","miércoles","jueves","viernes","sábado" ],
      dayNamesShort: [ "dom","lun","mar","mié","jue","vie","sáb" ],
      dayNamesMin: [ "D","L","M","X","J","V","S" ],
      monthNames: [ "enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre" ],
      monthNamesShort: [ "ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic" ],
      today: 'Hoy',
      clear: 'Borrar'
    };

    this.SelectedCategory = this.Categories[0];
  }

  public OnRowSelect(): void {
    this.DisplayDialog = true;
  }

  public RefreshTable(): void {
    this.Loading = true;

    const queryParams = new ReadListQueryParams();
    queryParams.Page = this.currentPage;
    queryParams.Limit = this.currentLimit;

    if (this.DateRange) {
      if (this.DateRange[0])
        queryParams.DateFrom = new Date(this.DateRange[0]).toISOString();
      if (this.DateRange[1])
        queryParams.DateUntil = new Date(this.DateRange[1]).toISOString();
    }

    if (this.SelectedCategory.name == Categories.Signed)
      queryParams.Signed = true;
    else if (this.SelectedCategory.name == Categories.Unsigned)
      queryParams.Signed = false;

    const res = this.materialsReceiptsAPI.Get(queryParams);

    res.then( (data: GetMaterialsList) => {
      this.MaterialsListData = data.Items;
      this.TotalRecords = data.Total;
      this.Loading = false;
    })
  }

  public LoadDataLazy(event: LazyLoadEvent): void {
    this.Loading = true;

    //event.first = First row offset
    //event.rows = Number of rows per page
    //event.sortField = Field name to sort with
    //event.sortOrder = Sort order as number, 1 for asc and -1 for dec
    //filters: FilterMetadata object having field as key and filter value, filter matchMode as value

    const queryParams = new ReadListQueryParams();
    queryParams.Page = event.first/event.rows + 1;
    queryParams.Limit = event.rows;

    this.currentPage = queryParams.Page;
    this.currentLimit = event.rows;

    const res = this.materialsReceiptsAPI.Get(queryParams);

    res.then( (data: GetMaterialsList) => {
      this.MaterialsListData = data.Items;
      this.TotalRecords = data.Total;
      this.Loading = false;
    })
  }
}
