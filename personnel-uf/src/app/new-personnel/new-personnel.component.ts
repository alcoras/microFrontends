import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpResponse } from '@angular/common/http';
import { PersonnelAPIService } from '../services/PersonnelAPI.service';
import { EventBusService } from '../services/EventBus.service';
import { PersonData } from '../Models/index';
import { APIGatewayResponse } from 'event-proxy-lib-src'
;

@Component({
  selector: 'app-new-personnel',
  templateUrl: './new-personnel.component.html',
  styleUrls: ['./new-personnel.component.css']
})
export class NewPersonnelComponent {

  public constructor(
    private apiService: PersonnelAPIService,
    public dialogRef: MatDialogRef<NewPersonnelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PersonData,
    private eventBus: EventBusService) { }


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
      (ret: HttpResponse<APIGatewayResponse>) => {
        if (ret.status === 200) {
          console.log('added');
          this.eventBus.RefreshTable.next();
        }
      },
    );
  }

}
