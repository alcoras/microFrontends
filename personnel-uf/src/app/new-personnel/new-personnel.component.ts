import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpResponse } from '@angular/common/http';
import { IPersonnel, APIGatewayResponse } from '@uf-shared-models/index';
import { PersonnelAPIService } from '../services/PersonnelAPI.service';

@Component({
  selector: 'app-new-personnel',
  templateUrl: './new-personnel.component.html',
  styleUrls: ['./new-personnel.component.css']
})
export class NewPersonnelComponent {

  public constructor(
    private apiService: PersonnelAPIService,
    public dialogRef: MatDialogRef<NewPersonnelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IPersonnel) { }


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
          window.location.reload();
        }
      },
    );
  }

}
