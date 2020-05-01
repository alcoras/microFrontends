import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OccupationAPIService } from '../services/OccupationAPI.service';
import { OccupationData } from '@uf-shared-models/index';

@Component({
  selector: 'app-new-occup',
  templateUrl: './new-occup.component.html',
  styleUrls: ['./new-occup.component.css']
})
export class NewOccupComponent implements OnInit {

  constructor(
    private apiService: OccupationAPIService,
    public dialogRef: MatDialogRef<NewOccupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: OccupationData) {
  }

  onNoClick(): void {
    this.dialogRef.close();
    console.log(this.data);
  }

  save(): void {
    this.dialogRef.close();
    this.apiService.Create(this.data).then(
      () => {
        console.log('added');
        window.location.reload();
      },
      (rejected) => {
        console.error(rejected);
        throw new Error('Failed to update');
      }
    );
  }

  ngOnInit(): void {
  }

}
