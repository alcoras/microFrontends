import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ExampleHttpDatabase } from '../occup-table3/local-json-api';
import { HttpClient, HttpResponse } from '@angular/common/http';

export interface IOccupation {
  id: string;
  occupation: string;
  created_at: string;
}

@Component({
  selector: 'app-new-occup',
  templateUrl: './new-occup.component.html',
  styleUrls: ['./new-occup.component.css']
})
export class NewOccupComponent implements OnInit {

  exampleDatabase: ExampleHttpDatabase | null;

  constructor(
    private httpClient: HttpClient,
    public dialogRef: MatDialogRef<NewOccupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IOccupation) {
    this.exampleDatabase = new ExampleHttpDatabase(this.httpClient);
  }

  onNoClick(): void {
    this.dialogRef.close();
    console.log(this.data);
  }

  save(): void {
    this.dialogRef.close();
    this.exampleDatabase.createNewEntry(this.data).subscribe(
      (ret: HttpResponse<any>) => {
        if (ret.status === 201) {
          console.log('added');
          // this.refreshTable();
        }
      },
      () => {},
      () => {}
    );
  }

  ngOnInit(): void {
  }

}
