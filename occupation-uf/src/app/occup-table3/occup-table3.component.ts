import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { trigger, state, transition, style, animate } from '@angular/animations';
import { merge, of as observableOf} from 'rxjs';
import { catchError, map, startWith, switchMap} from 'rxjs/operators';
import { FormGroup } from '@angular/forms';
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

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  columnsToDisplay: string[] = [
    'OccupationAggregateIdHolderId',
    'Name',
    'TariffCategory'];
  data: OccupationData[] = [];
  expandedElement: OccupationData | null;

  dataSource = new MatTableDataSource();

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  form: FormGroup;

  constructor(
    private apiService: OccupationAPIService) {
  }

  updateEntry(id: number) {
    const tariffElement = document.querySelector(`[occu_TariffCategory="${id}"]`) as HTMLTextAreaElement;
    const nameElement = document.querySelector(`[occu_Name="${id}"]`) as HTMLTextAreaElement;

    const up: OccupationData = {
      OccupationAggregateIdHolderId: id,
      DocReestratorId: 1, // TODO: because demo
      Name: nameElement.value,
      TariffCategory: +tariffElement.value
    };

    this.apiService.Update(up).then(
      () => {
        console.log('update', id);
        this.refreshTable();
      },
      (rejected) => {
        console.error(rejected);
        throw new Error('Failed to update');
      }
    );
  }

  public DeleteEntry(id: number) {
    this.apiService.Delete(id).then(
      (resolved) => {
        console.log('delete', id);
        this.refreshTable();
      },
      (rejected) => {
        console.error(rejected);
        throw new Error('Failed to update');
      }
    );
  }

  refreshTable() {
    // TODO: genius reload
    this.paginator._changePageSize(this.paginator.pageSize);
  }

  applyFilter(event: Event) {
    const filterVal = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterVal.trim().toLowerCase();
  }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngAfterViewInit(): void {

    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;

          return this.apiService.Get(this.paginator.pageIndex + 1, this.paginator.pageSize);
        }),
        map((data: IGetResponse) => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.isRateLimitReached = false;
          this.resultsLength = data.total;

          let ic: OccupationData[];
          ic = data.items;
          this.dataSource = new MatTableDataSource(data.items);
          return ic;
        }),
        catchError((err) => {
          this.isLoadingResults = false;
          // Catch if the GitHub API has reached its rate limit. Return empty data.
          this.isRateLimitReached = true;
          console.error(err);
          return observableOf([]);
        })
      ).subscribe((data) => this.data = data);
  }
}


