import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { trigger, state, transition, style, animate } from '@angular/animations';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { merge, of as observableOf} from 'rxjs';
import { catchError, map, startWith, switchMap} from 'rxjs/operators';
import { FormGroup } from '@angular/forms';
import { IPersonnel } from '@uf-shared-models/';
import { PersonnelAPIService } from '../services/PersonnelAPI.service';
import { IGetResponse } from '../services/interfaces/IGetResponse';

/**
 * Table component for Personnel micro frontend
 */
@Component({
  selector: 'app-personnel-table-2',
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
export class PersonnelTable2Component implements OnInit, AfterViewInit {

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
  data: IPersonnel[] = [];
  expandedElement: IPersonnel | null;

  dataSource = new MatTableDataSource();

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  form: FormGroup;

  constructor(
    private httpClient: HttpClient,
    private apiService: PersonnelAPIService) {
  }

  /**
   * Updates entry given PersonDataID
   * @param id PersonDataID
   */
  public UpdateEntry(id: number) {
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

    this.apiService.CreateUpdate(up).then(
      (resolved) => {
        console.log('update', id);
        this.refreshTable();
      },
      (rejected) => {
        console.error(rejected);
        throw new Error('Failed to update');
      }
    );
  }

  /**
   * Deletes entry
   * @param id PersonDataId
   */
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

          const sorts: string[] = [];

          // check if active sort is in a list of collums we provide
          if (this.columnsToDisplay.includes(this.sort.active)) {
            // add - char to the end if desc
            const oneSort = this.sort.direction === 'desc' ? this.sort.active : `${this.sort.active}-`;

            sorts.push(oneSort);
          }

          return this.apiService.Get(sorts, this.paginator.pageIndex, this.paginator.pageSize);

        }),
        map((data: IGetResponse) => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.isRateLimitReached = false;
          this.resultsLength = data.total;

          let ic: IPersonnel[];
          ic = data.items;
          this.dataSource = new MatTableDataSource(data.items);
          return ic;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          this.isRateLimitReached = true;
          return observableOf([]);
        })
      ).subscribe((data) => this.data = data);
  }
}


