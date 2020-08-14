import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NewOccupComponent } from './new-occup/new-occup.component';

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
    this.dialog.open(NewOccupComponent, {
      height: 'auto',
      width: 'auto',
      data: {}
    });
  }
}
