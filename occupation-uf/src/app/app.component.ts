import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { NewOccupComponent } from './new-occup/new-occup.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  public RefreshEvent: Subject<void> = new Subject<void>();

  public constructor(
    private dialog: MatDialog) {
  }

  public Refresh(): void {
    this.RefreshEvent.next();
  }

  public openDialog(): void {
    this.dialog.open(NewOccupComponent, {
      height: 'auto',
      width: 'auto',
      data: {}
    });
  }
}
