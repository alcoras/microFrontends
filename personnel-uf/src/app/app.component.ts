import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NewPersonnelComponent } from './new-personnel/new-personnel.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  public constructor(
    private dialog: MatDialog) {
  }

  public openDialog(): void {
    this.dialog.open(NewPersonnelComponent, {
      height: 'auto',
      width: 'auto',
      data: {}
    });
  }
}
