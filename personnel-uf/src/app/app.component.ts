import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NewPersonnelComponent } from './new-personnel/new-personnel.component';

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
    const dialogRef = this.dialog.open(NewPersonnelComponent, {
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
