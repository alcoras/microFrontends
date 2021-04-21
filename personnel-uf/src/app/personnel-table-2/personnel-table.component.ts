import { Component, OnInit, ViewChild, AfterViewInit, Input } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { trigger, state, transition, style, animate } from "@angular/animations";
import { merge, Observable, of as observableOf, Subscription} from "rxjs";
import { catchError, map, startWith, switchMap} from "rxjs/operators";
import { PersonnelAPI } from "../services/PersonnelAPI";
import { EventBusService } from "../services/EventBus.service";
import { PersonData, PersonDataRead } from "event-proxy-lib-src";

/**
 * Table component for Personnel micro frontend
 */
@Component({
  selector: "app-personnel-table-2",
  templateUrl: "./personnel-table.component.html",
  styleUrls: ["./personnel-table.component.css"],
  animations: [
    trigger("detailExpand", [
      state("collapsed, void", style({ height: "0px", minHeight: "0", display: "none" })),
      state("expanded", style({ height: "*" })),
      transition("expanded <=> collapsed", animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")),
      transition("expanded <=> void", animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)"))
    ])
  ],
})
export class PersonnelTable2Component implements OnInit, AfterViewInit {

  @Input() private events: Observable<void>;
  @ViewChild(MatSort, {static: true}) private sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) private paginator: MatPaginator;


  /**
   * Placeholder for View
   */
  public ExpandedElement: PersonData | null;

  /**
   * List of Collumns to be displayed
   */
  public ColumnsToDisplay: string[] = [
    "PersonDataID",
    "DateValue",
    "DocReestratorID",
    "Oklad",
    "Stavka",
    "PIP",
    "KodDRFO",
    "DataPriyomu",
    "Posada",
    "PodatkovaPilga",
  ];

  public ResultsLength = 0;
  public IsLoadingResults = true;
  public DataSource = new MatTableDataSource();
  public BackendError = false;

  private data: PersonData[] = [];
  private eventsSubscription: Subscription[] = [];

  public constructor(
    private personnelApiService: PersonnelAPI,
    private eventBusService: EventBusService) {
  }

  public ngOnInit(): void {
    this.DataSource.paginator = this.paginator;
    this.DataSource.sort = this.sort;

    this.eventsSubscription.push(this.events.subscribe(() => this.RefreshTable()));
    this.eventsSubscription.push(this.eventBusService.RefreshTable.subscribe(()=> this.RefreshTable()));
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
        switchMap(() => {
          this.IsLoadingResults = true;

          const sorts: string[] = [];

          // check if active sort is in a list of collums we provide
          if (this.ColumnsToDisplay.includes(this.sort.active)) {
            // add - char to the end if desc
            const oneSort = this.sort.direction === "desc" ? this.sort.active : `${this.sort.active}-`;

            sorts.push(oneSort);
          }

          return this.personnelApiService.GetAsync(sorts, this.paginator.pageIndex + 1, this.paginator.pageSize);

        }),
        map((data): PersonData[] => {
          // Flip flag to show that loading has finished.
          this.IsLoadingResults = false;
          this.ResultsLength = data.Result.CommonNumberRecords;

          const ic: PersonData[] = data.Result.ListOutputEnterprisePersonData;
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

  /**
   * Updates entry given PersonDataID
   * @param id PersonDataID
   */
  public UpdateEntry(id: number): void {
    const DateValueEl = document.querySelector(`[personnel_DateValue="${id}"]`) as HTMLInputElement;
    const DocReestratorIDEl = document.querySelector(`[personnel_DocReestratorID="${id}"]`) as HTMLTextAreaElement;
    const OkladEl = document.querySelector(`[personnel_Oklad="${id}"]`) as HTMLTextAreaElement;
    const StavkaEl = document.querySelector(`[personnel_Stavka="${id}"]`) as HTMLTextAreaElement;
    const PIPEl = document.querySelector(`[personnel_PIP="${id}"]`) as HTMLTextAreaElement;
    const KodDRFOEl = document.querySelector(`[personnel_KodDRFO="${id}"]`) as HTMLTextAreaElement;
    const DataPriyomuEl = document.querySelector(`[personnel_DataPriyomu="${id}"]`) as HTMLInputElement;
    const PosadaEl = document.querySelector(`[personnel_Posada="${id}"]`) as HTMLTextAreaElement;
    const PodatkovaPilga = document.querySelector(`[personnel_PodatkovaPilga="${id}"]`) as HTMLTextAreaElement;

    const up: PersonData = {
      PersonDataID: id,
      DateValue: (new Date(DateValueEl.value)).toISOString(),
      DocReestratorID: +DocReestratorIDEl.value,
      KodDRFO: KodDRFOEl.value,
      Oklad: +OkladEl.value,
      Stavka: +StavkaEl.value,
      PIP: PIPEl.value,
      DataPriyomu: (new Date(DataPriyomuEl.value)).toISOString(),
      Posada: +PosadaEl.value,
      PodatkovaPilga: +PodatkovaPilga.value
    };

    this.personnelApiService.UpdateAsync(up).then(
      () => {
        console.log("update", id);
        this.RefreshTable();
      },
      (rejected) => {
        console.error(rejected);
        throw new Error("Failed to update");
      }
    );
  }

  /**
   * Deletes entry
   * @param id PersonDataId
   */
  public DeleteEntry(id: number): void {
    this.personnelApiService.DeleteAsync(id).then(
      () => {
        console.log("delete", id);
        this.RefreshTable();
      },
      (rejected) => {
        console.error(rejected);
        throw new Error("Failed to update");
      }
    );
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
}
