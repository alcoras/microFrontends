import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OccupationAPIService } from '../services/OccupationAPI.service';
import { EventBusService } from '../services/EventBus.service';
import { OccupationData } from '../Models/OccupationData';

@Component({
  selector: 'app-new-occup',
  templateUrl: './new-occup.component.html',
  styleUrls: ['./new-occup.component.css']
})
export class NewOccupComponent {

  public constructor(
    private apiService: OccupationAPIService,
    public dialogRef: MatDialogRef<NewOccupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: OccupationData,
    private eventBus: EventBusService) {
  }

  /**
   * Handles dialog Cancel/No
   */
  public OnNoClick(): void {
    this.dialogRef.close();
    console.log(this.data);
  }

  /**
   * Handles dialog's save
   */
  public Save(): void {
    this.dialogRef.close();
    this.apiService.Create(this.data).then(
      () => {
        console.log('added');
        this.eventBus.RefreshTable.next();
      },
      (rejected) => {
        console.error(rejected);
        throw new Error('Failed to update');
      }
    );
  }
}
