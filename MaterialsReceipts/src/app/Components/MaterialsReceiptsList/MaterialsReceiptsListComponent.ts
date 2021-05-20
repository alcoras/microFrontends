import { Component } from "@angular/core";
import { LazyLoadEvent } from "primeng/api";
import { MaterialsReceiptsAPI  } from "../../services/MaterialsReceiptsAPI";
import { EventBusService } from "../../services/EventBusService";
import { MaterialsList } from "event-proxy-lib-src";
import { MaterialReceiptSelectedData } from "@shared/Adds/MaterialReceiptSelectedData";
import { ReadListQueryParams } from "@shared/Adds/ReadListQueryParams";
import { environment } from "src/environments/environment";

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
  Both = "Both",
  Signed = "Signed",
  Unsigned = "Unsigned"
}

interface Category {
  name: string,
  key: string
}

@Component({
  selector: "materials-receipts-list-table",
  templateUrl: "./MaterialsReceiptsListView.html",
  styleUrls: ["./Styles.scss"]
})
export class MaterialsReceiptsListComponent {

  public MaterialReceiptSelected: boolean;

  public DateRange: Date[];
  public CalendarLocale: IPrimeNgDate = null;

  public Categories: Category[] = [
    { name: Categories.Both, key: "B"},
    { name: Categories.Signed, key: "S"},
    { name: Categories.Unsigned, key: "U"}]
  public SelectedCategory: Category;

  public SelectedMaterialData: MaterialsList;

  public Loading: boolean;
  public TotalRecords: number;

  public SelectedMaterialReceiptId: number;

  public BarCode: string;

  public Cols = [
    { field: "Number", header: "Number"},
    { field: "RegisterDateTime", header: "RegisterDateTime"},
    { field: "SignMark", header: "Signed?"},
    { field: "SignPerson", header: "Signee"},
  ];

  public MaterialsListData: MaterialsList[];

  private currentLimit = 0;
  private currentPage = 0;

  public constructor(private eventBus: EventBusService, private materialsReceiptsAPI: MaterialsReceiptsAPI) {
    this.MaterialReceiptSelected = false;
    this.Loading = true;
  }

  public ngOnInit(): void {
		if (environment.currentLanguage == "en") {
			this.CalendarLocale = null;
		} else {
			this.CalendarLocale = {
				firstDayOfWeek: 1,
				dayNames: [ "понеділок","вівторок","середа","четвер","п’ятниця","субота","неділя" ],
				dayNamesShort: ["пн", "вт", "ср", "чт", "пт", "сб", "нд"],
				dayNamesMin: [ "П", "В", "С", "Ч", "Т", "Б", "Н"  ],
				monthNames: [ "січень","лютий","березень","квітень","травень","червень","липень","серпень","вересень","жовтень","листопад","грудень" ],
				monthNamesShort: [ "січ", "лют", "бер", "кв", "тр", "чер", "лип", "сер", "вер", "жовт", "лис", "гр" ],
				today: "Сьогодні",
				clear: "Відміна"
			};
		}

    this.SelectedCategory = this.Categories[0];
  }

  public OnRowSelect(data: MaterialsList): void {
    this.SelectedMaterialData = data;
    this.MaterialReceiptSelected = true;
  }

  public OnRowUnSelect(): void {
    this.SelectedMaterialData = null;
    this.MaterialReceiptSelected = false;
  }

  public OnArrivalClicked(): void {
    if (!this.SelectedMaterialData) {
      throw new Error("Material was not selected");
    }

    const eventData: MaterialReceiptSelectedData = {
      Id: this.SelectedMaterialData.Id,
      ReceiptNumber: this.SelectedMaterialData.Number,
      ReceiptDate: this.SelectedMaterialData.RegisterDateTime
    };

    this.eventBus.MaterialReceiptSelected(eventData);
  }

  public async RefreshTable(): Promise<void> {
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

    const res = await this.materialsReceiptsAPI.MaterialsReceiptsListQueryAsync(queryParams);

    this.MaterialsListData = res.Result.MaterialsDataList;
    this.TotalRecords = res.Result.TotalRecordsAmount;
    this.Loading = false;
  }

  public async LoadDataLazy(event: LazyLoadEvent): Promise<void> {
    this.Loading = true;

    const queryParams = new ReadListQueryParams();
    queryParams.Page = event.first/event.rows + 1;
    queryParams.Limit = event.rows;

    this.currentPage = queryParams.Page;
    this.currentLimit = event.rows;

    const res = await this.materialsReceiptsAPI.MaterialsReceiptsListQueryAsync(queryParams);

    this.MaterialsListData = res.Result.MaterialsDataList;
    this.TotalRecords = res.Result.TotalRecordsAmount;
    this.Loading = false;
  }
}
