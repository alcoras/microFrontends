import { Component, OnInit, ViewChild, AfterViewInit, Input } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { trigger, state, transition, style, animate } from "@angular/animations";
import { merge, Observable, of as observableOf, Subscription} from "rxjs";
import { catchError, map, startWith, switchMap} from "rxjs/operators";
import { OccupationAPIService } from "../services/OccupationAPI";
import { EventBusService } from "../services/EventBusService";
import { OccupationData, OccupationsReadResults, ValidationStatus } from "event-proxy-lib-src";

@Component({
  selector: "app-occup-table3",
  templateUrl: "./occup-table3.component.html",
  styleUrls: ["./occup-table3.component.css"],
  animations: [
    trigger("detailExpand", [
      state("collapsed, void", style({ height: "0px", minHeight: "0", display: "none" })),
      state("expanded", style({ height: "*" })),
      transition("expanded <=> collapsed", animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")),
      transition("expanded <=> void", animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)"))
    ])
  ],
})
export class OccupTable3Component implements OnInit, AfterViewInit {

  @Input() private events: Observable<void>;
  @ViewChild(MatSort, {static: true}) private sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) private paginator: MatPaginator;

  /**
   * Placeholder for View
   */
  public ExpandedElement: OccupationData | null;

  /**
   * List of Collumns to be displayed
   */
  public ColumnsToDisplay: string[] = [
    "OccupationAggregateIdHolderId",
    "Name",
    "TariffCategory"
  ];

  public ResultsLength = 0;
  public IsLoadingResults = true;
  public DataSource = new MatTableDataSource();
  public BackendError = false;

  private data: OccupationData[] = [];
  private eventsSubscription: Subscription[];

  public constructor(
    private occupationApiService: OccupationAPIService,
    private eventBus: EventBusService) { }

  /**
   * Updates entry given id
   * @param id OccupationAggregateIdHolderId
   */
  public async UpdateEntry(id: number): Promise<void> {
    const tariffElement = document.querySelector(`[occu_TariffCategory="${id}"]`) as HTMLTextAreaElement;
    const nameElement = document.querySelector(`[occu_Name="${id}"]`) as HTMLTextAreaElement;

    const up: OccupationData = {
      OccupationAggregateIdHolderId: id,
      DocReestratorId: 1, // DEMO
      Name: nameElement.value,
      TariffCategory: +tariffElement.value
    };

    const response = await this.occupationApiService.UpdateAsync(up);

    if (response.HasErrors()) {
      console.error(response.ErrorList.toString());
      throw new Error("Failed to update");
    }

    this.RefreshTable();
  }

  /**
   * Deletes entry
   * @param id OccupationAggregateIdHolderId
   */
  public async DeleteEntry(id: number): Promise<void> {

    const response = await this.occupationApiService.DeleteAsync(id);

    if (response.HasErrors()) {
      console.error(response.ErrorList.toString());
      throw new Error("Failed to delete");
    }

    this.RefreshTable();
  }

  /**
   * Refreshes table without reload page
   *
   * @private
   * @memberof PersonnelTable2Component
   */
  public RefreshTable(): void {
    this.paginator._changePageSize(this.paginator.pageSize);
  }

  /**
   * Applies filter on table
   *
   * @private
   * @param {Event} event ?
   * @memberof PersonnelTable2Component
   */
  public ApplyFilter(event: Event): void {
    const filterVal = (event.target as HTMLInputElement).value;
    this.DataSource.filter = filterVal.trim().toLowerCase();
  }

  public ngOnInit(): void {
    this.DataSource.paginator = this.paginator;
    this.DataSource.sort = this.sort;
    this.eventsSubscription = [];
    this.eventsSubscription.push(this.events.subscribe(() => this.RefreshTable()));
    this.eventsSubscription.push(this.eventBus.RefreshTable.subscribe(() => this.RefreshTable()));
  }

  public ngOnDestroy(): void {
    this.eventsSubscription.forEach(element => {
      element.unsubscribe();
    });
  }

  public ngAfterViewInit(): void {

    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(async () => {
          this.IsLoadingResults = true;

          return await this.occupationApiService.GetAsync(this.paginator.pageIndex + 1, this.paginator.pageSize);
        }),
        map( (data): OccupationData[] => {
          // Flip flag to show that loading has finished.
          this.IsLoadingResults = false;
          this.ResultsLength = data.Result.TotalRecordsAmount;

          const ic: OccupationData[] = data.Result.OccupationDataList;
          this.DataSource = new MatTableDataSource(ic);
          return ic;
        }),
        catchError((err) => {
          this.IsLoadingResults = false;
          this.BackendError = true;
          console.error(err);
          return observableOf([]);
        })
      ).subscribe((data) => this.data = data);
  }
}


