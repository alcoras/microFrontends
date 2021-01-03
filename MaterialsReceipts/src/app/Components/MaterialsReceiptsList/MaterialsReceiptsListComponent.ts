import { Component } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { MaterialsReceiptsAPI  } from '../../services/MaterialsReceiptsAPI';
import { EventBusService } from '../../services/EventBusService';
import { MaterialsList, MaterialsReceiptsReadListResults } from 'event-proxy-lib-src';
import { MaterialReceiptSelectedData } from '@shared/Adds/MaterialReceiptSelectedData';
import { ReadListQueryParams } from '@shared/Adds/ReadListQueryParams';

interface OnRowSelectedEvent {
  originalEvent?: UIEvent,
  data: MaterialsList,
  type?: string,
  index?: unknown,
}

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
  selector: 'materials-receipts-list-table',
  templateUrl: './MaterialsReceiptsListView.html',
  styleUrls: ['./Styles.scss']
})
export class MaterialsReceiptsListComponent {

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
  public SelectedMaterialReceiptId: number;

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

  public constructor(
    private eventBus: EventBusService,
    private materialsReceiptsAPI: MaterialsReceiptsAPI) {
    this.Loading = true;
  }

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

  public OnRowSelect(event: OnRowSelectedEvent): void {
    const eventData: MaterialReceiptSelectedData = {
      Id: event.data.Id,
      ReceiptNumber: event.data.Number,
      ReceiptDate: event.data.RegisterDateTime
    };

    this.eventBus.MaterialReceiptSelected(eventData);
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

    const res = this.materialsReceiptsAPI.MaterialsReceiptsListQuery(queryParams);

    res.then( (data: MaterialsReceiptsReadListResults) => {
      this.MaterialsListData = data.MaterialsDataList;
      this.TotalRecords = data.TotalRecordsAmount;
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

    const res = this.materialsReceiptsAPI.MaterialsReceiptsListQuery(queryParams);

    res.then( (data: MaterialsReceiptsReadListResults) => {
      this.MaterialsListData = data.MaterialsDataList;
      this.TotalRecords = data.TotalRecordsAmount;
      this.Loading = false;
    })
  }
}