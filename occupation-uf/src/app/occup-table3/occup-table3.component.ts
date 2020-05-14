import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { trigger, state, transition, style, animate } from '@angular/animations';
import { merge, of as observableOf} from 'rxjs';
import { catchError, map, startWith, switchMap} from 'rxjs/operators';
import { OccupationData } from '@uf-shared-models/';
import { OccupationAPIService } from '../services/OccupationAPI.service';
import { IGetResponse } from '../services/interfaces/IGetResponse';

@Component({
  selector: 'app-occup-table3',
  templateUrl: './occup-table3.component.html',
  styleUrls: ['./occup-table3.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed, void', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
      transition('expanded <=> void', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ])
  ],
})
export class OccupTable3Component implements OnInit, AfterViewInit {

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
    'OccupationAggregateIdHolderId',
    'Name',
    'TariffCategory'
  ];

  public ResultsLength = 0;
  public IsLoadingResults = true;
  public DataSource = new MatTableDataSource();
  public BackendError = false;

  private data: OccupationData[] = [];

  public constructor(private occupationApiService: OccupationAPIService) { }

  /**
   * Updates entry given id
   * @param id OccupationAggregateIdHolderId
   */
  public UpdateEntry(id: number): void {
    const tariffElement = document.querySelector(`[occu_TariffCategory="${id}"]`) as HTMLTextAreaElement;
    const nameElement = document.querySelector(`[occu_Name="${id}"]`) as HTMLTextAreaElement;

    const up: OccupationData = {
      OccupationAggregateIdHolderId: id,
      DocReestratorId: 1, // DEMO
      Name: nameElement.value,
      TariffCategory: +tariffElement.value
    };

    this.occupationApiService.Update(up).then(
      () => {
        console.log('update', id);
        this.RefreshTable();
      },
      (rejected) => {
        console.error(rejected);
        throw new Error('Failed to update');
      }
    );
  }

  /**
   * Deletes entry
   * @param id OccupationAggregateIdHolderId
   */
  public DeleteEntry(id: number): void {
    this.occupationApiService.Delete(id).then(
      () => {
        console.log('delete', id);
        this.RefreshTable();
      },
      (rejected) => {
        console.error(rejected);
        throw new Error('Failed to update');
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

  public ngOnInit(): void {
    this.DataSource.paginator = this.paginator;
    this.DataSource.sort = this.sort;
  }

  public ngAfterViewInit(): void {

    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.IsLoadingResults = true;

          return this.occupationApiService.Get(this.paginator.pageIndex + 1, this.paginator.pageSize);
        }),
        map((data: IGetResponse) => {
          // Flip flag to show that loading has finished.
          this.IsLoadingResults = false;
          this.ResultsLength = data.total;

          const ic: OccupationData[] = data.items;
          this.DataSource = new MatTableDataSource(data.items);
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


