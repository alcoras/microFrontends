import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NewOccupComponent } from './new-occup/new-occup.component';

interface Theme {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'y';

  themes: Theme[] = [
    {value: 'assets/deeppurple-amber.css', viewValue: 'Deep Purple & Amber'},
    {value: 'assets/indigo-pink.css', viewValue: 'Indigo & Pink'},
    {value: 'assets/pink-bluegrey.css', viewValue: 'Pink & Blue-grey'},
    {value: 'assets/purple-green.css', viewValue: 'Purple & Green'}
  ];

  selectedTheme: string = this.themes[0].value;

  animal: string;
  name: string;

  constructor(private dialog: MatDialog) {
  }

  public changeTheme() {
    const el = document.getElementById('themeAsset') as HTMLLinkElement;
    el.href = this.selectedTheme;
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
