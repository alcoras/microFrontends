import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TableComponent } from './table/table.component';
import { MapComponent } from './map/map.component';
import { ValidationComponent } from './validation/validation.component';

/**
 * Route list
 */
const routes: Routes = [
  { path: 'table', component: TableComponent},
  { path: 'map', component: MapComponent},
  { path: 'validation', component: ValidationComponent}
];

/**
 * Routing Module
 */
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
