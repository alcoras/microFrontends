import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { DATA } from './helpers/data';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-occup-table',
  templateUrl: './occup-table.component.html',
  styleUrls: ['./occup-table.component.css']
})
export class OccupTableComponent implements OnInit {

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  displayedColumns: string[] = ['number', 'id', 'name', 'creationdate'];
  dataSource = new MatTableDataSource(DATA);
  selectedRowIndex = -1;

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
