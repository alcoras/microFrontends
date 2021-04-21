import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { PersonnelAPI } from "../services/PersonnelAPI";
import { EventBusService } from "../services/EventBus.service";
import { PersonData } from "event-proxy-lib-src";

@Component({
  selector: "app-new-personnel",
  templateUrl: "./new-personnel.component.html",
  styleUrls: ["./new-personnel.component.css"]
})
export class NewPersonnelComponent {

  public constructor(
    private apiService: PersonnelAPI,
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
   * Handles dialog"s save
   */
  public Save(): void {
    this.dialogRef.close();
    this.apiService.CreateAsync(this.data).then(
      () => {
          this.eventBus.RefreshTable.next();
      },
    );
  }

}
