import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { trigger, state, transition, style, animate } from '@angular/animations';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { merge, of as observableOf, Subject, Observable, Observer} from 'rxjs';
import { catchError, map, startWith, switchMap} from 'rxjs/operators';
import { ExampleHttpDatabase, IOccupation, } from './local-json-api';
import { FormBuilder, Validators, FormControl, FormGroup, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { ObserversModule } from '@angular/cdk/observers';

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

  columnsToDisplay: string[] = ['id', 'occupation', 'created_at'];
  exampleDatabase: ExampleHttpDatabase | null;
  data: IOccupation[] = [];
  expandedElement: IOccupation | null;

  dataSource = new MatTableDataSource();

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  form: FormGroup;

  constructor(
    private router: Router,
    private httpClient: HttpClient,
    private changeDeteRefs: ChangeDetectorRef) {
  }

  updateEntry(id: number) {
    const date = document.querySelector(`[date_element_id="${id}"]`) as HTMLInputElement;
    const txtEl = document.querySelector(`[occu_element_id="${id}"]`) as HTMLTextAreaElement;

    const up: IOccupation = { id: id.toString(), occupation: txtEl.value, created_at: (new Date(date.value)).toISOString() };

    this.exampleDatabase.updateOccupation(up).subscribe(
      (ret: HttpResponse<any>) => {
        if (ret.status === 200) {
          console.log('updates: ', id);
          this.refreshTable();
        }
      },
      () => {},
      () => {}
    );
  }

  deleteEntry(id: number) {
    this.exampleDatabase.delOccupation(id).subscribe(
      (ret: HttpResponse<any>) => {
        if (ret.status === 200) {
          console.log('removed: ', id);
          this.refreshTable();
        }
      },
      () => {},
      () => {}
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
    this.exampleDatabase = new ExampleHttpDatabase(this.httpClient);

    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          if (this.exampleDatabase !== undefined) {
            return this.exampleDatabase.getOccupations(
              this.sort.active, this.sort.direction, this.paginator.pageIndex, this.paginator.pageSize);
          }
        }),
        map((data: HttpResponse<any>) => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.isRateLimitReached = false;
          this.resultsLength = +data.headers.get('X-Total-Count');

          let ic: IOccupation[];
          ic = data.body;
          this.dataSource = new MatTableDataSource(data.body);
          return ic;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          // Catch if the GitHub API has reached its rate limit. Return empty data.
          this.isRateLimitReached = true;
          return observableOf([]);
        })
      ).subscribe((data) => this.data = data);
  }
}


