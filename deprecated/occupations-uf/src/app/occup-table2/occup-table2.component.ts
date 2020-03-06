import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DATA } from '../occup-table/helpers/data';
import { trigger, state, transition, style, animate } from '@angular/animations';
import { IOccupationModel } from './helpers/data';

@Component({
  selector: 'app-occup-table2',
  templateUrl: './occup-table2.component.html',
  styleUrls: ['./occup-table2.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed, void', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
      transition('expanded <=> void', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ])
  ],
})
export class OccupTable2Component implements OnInit {

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  columnsToDisplay: string[] = ['id', 'name', 'creationDate'];
  dataSource = new MatTableDataSource(DATA);
  selectedRowIndex = -1;
  expandedElement: IOccupationModel | null;

  applyFilter(event: Event) {
    const filterVal = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterVal.trim().toLowerCase();
  }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  highlight(row) {
    this.selectedRowIndex = row.id;
  }

}


