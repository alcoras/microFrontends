import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { IPersonnel } from '@uf-shared-models/index';
import { PersonnelAPIService } from '../services/PersonnelAPI.service';

@Component({
  selector: 'app-new-personnel',
  templateUrl: './new-personnel.component.html',
  styleUrls: ['./new-personnel.component.css']
})
export class NewPersonnelComponent implements OnInit {

  constructor(
    private apiService: PersonnelAPIService,
    public dialogRef: MatDialogRef<NewPersonnelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IPersonnel) {
  }

  onNoClick(): void {
    this.dialogRef.close();
    console.log(this.data);
  }

  save(): void {
    this.dialogRef.close();
    this.apiService.Create(this.data).then(
      (ret: HttpResponse<any>) => {
        if (ret.status === 200) {
          console.log('added');
          window.location.reload();
        }
      },
      () => {},
    );
  }

  ngOnInit(): void {
  }

}
