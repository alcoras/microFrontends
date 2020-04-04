import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ExampleHttpDatabase } from '../personnel-table/local-json-api';
import { IPersonnel } from '@uf-shared-models/index';

@Component({
  selector: 'app-new-personnel',
  templateUrl: './new-personnel.component.html',
  styleUrls: ['./new-personnel.component.css']
})
export class NewPersonnelComponent implements OnInit {

  exampleDatabase: ExampleHttpDatabase | null;

  constructor(
    private httpClient: HttpClient,
    public dialogRef: MatDialogRef<NewPersonnelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IPersonnel) {
    this.exampleDatabase = new ExampleHttpDatabase(this.httpClient);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  save(): void {
    this.dialogRef.close();
    this.exampleDatabase.create(this.data).subscribe(
      (ret: HttpResponse<any>) => {
        if (ret.status === 201) {
          console.log('added');
          window.location.reload();
        }
      },
      () => {},
      () => {}
    );
  }

  ngOnInit(): void {
  }

}
