import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NewOccupComponent } from './new-occup/new-occup.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'y';

  animal: string;
  name: string;

  constructor(private dialog: MatDialog) {
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(NewOccupComponent, {
      height: 'auto',
      width: 'auto',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed');
      this.animal = result;
    });
  }

}
