import { Component } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Subject } from "rxjs";
import { NewPersonnelComponent } from "./new-personnel/new-personnel.component";

@Component({
  selector: "app-root",
  templateUrl: "PersonnelView.html",
})
export class PersonnelComponent {

  public RefreshEvent = new Subject<void>();

  public constructor(
    private dialog: MatDialog) {
  }

  public Refresh(): void {
    this.RefreshEvent.next();
  }

  public openDialog(): void {
    this.dialog.open(NewPersonnelComponent, {
      height: "auto",
      width: "auto",
      data: {}
    });
  }
}
