import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { trigger, state, transition, style, animate } from '@angular/animations';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { merge, of as observableOf} from 'rxjs';
import { catchError, map, startWith, switchMap} from 'rxjs/operators';
import { ExampleHttpDatabase, } from './local-json-api';
import { FormGroup } from '@angular/forms';
import { IPersonnel } from '../models/IPersonnel';

@Component({
  selector: 'app-personnel-table',
  templateUrl: './personnel-table.component.html',
  styleUrls: ['./personnel-table.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed, void', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
      transition('expanded <=> void', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ])
  ],
})
export class PersonnelTableComponent implements OnInit, AfterViewInit {

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  columnsToDisplay: string[] = [
    'PersonDataID',
    'DateValue',
    'DocReestratorID',
    'Oklad',
    'Stavka',
    'PIP',
    'KodDRFO',
    'DataPriyomu',
    'Posada',
    'PodatkovaPilga',
  ];
  exampleDatabase: ExampleHttpDatabase | null;
  data: IPersonnel[] = [];
  expandedElement: IPersonnel | null;

  dataSource = new MatTableDataSource();

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  form: FormGroup;

  constructor(
    private httpClient: HttpClient) {
  }

  updateEntry(id: number) {
    const DateValueEl = document.querySelector(`[personnel_DateValue="${id}"]`) as HTMLInputElement;
    const DocReestratorIDEl = document.querySelector(`[personnel_DocReestratorID="${id}"]`) as HTMLTextAreaElement;
    const OkladEl = document.querySelector(`[personnel_Oklad="${id}"]`) as HTMLTextAreaElement;
    const StavkaEl = document.querySelector(`[personnel_Stavka="${id}"]`) as HTMLTextAreaElement;
    const PIPEl = document.querySelector(`[personnel_PIP="${id}"]`) as HTMLTextAreaElement;
    const KodDRFOEl = document.querySelector(`[personnel_KodDRFO="${id}"]`) as HTMLTextAreaElement;
    const DataPriyomuEl = document.querySelector(`[personnel_DataPriyomu="${id}"]`) as HTMLInputElement;
    const PosadaEl = document.querySelector(`[personnel_Posada="${id}"]`) as HTMLTextAreaElement;
    const PodatkovaPilga = document.querySelector(`[personnel_PodatkovaPilga="${id}"]`) as HTMLTextAreaElement;

    const up: IPersonnel = {
      PersonDataID: id.toString(),
      DateValue: (new Date(DateValueEl.value)).toISOString(),
      DocReestratorID: DocReestratorIDEl.value,
      KodDRFO: KodDRFOEl.value,
      Oklad: OkladEl.value,
      Stavka: StavkaEl.value,
      PIP: PIPEl.value,
      DataPriyomu: (new Date(DataPriyomuEl.value)).toISOString(),
      Posada: PosadaEl.value,
      PodatkovaPilga: PodatkovaPilga.value
    };

    this.exampleDatabase.update(up).subscribe(
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
    this.exampleDatabase.delete(id).subscribe(
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
            return this.exampleDatabase.getAll(
              this.sort.active, this.sort.direction, this.paginator.pageIndex, this.paginator.pageSize);
          }
        }),
        map((data: HttpResponse<any>) => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.isRateLimitReached = false;
          this.resultsLength = +data.headers.get('X-Total-Count');

          let ic: IPersonnel[];
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


