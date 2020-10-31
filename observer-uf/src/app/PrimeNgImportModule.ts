import { NgModule } from "@angular/core";

import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TabViewModule } from 'primeng/tabview';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';

@NgModule({
  exports: [
    TableModule,
    DialogModule,
    CalendarModule,
    TabViewModule,
    ButtonModule,
    CheckboxModule,
    RadioButtonModule,
    InputTextModule,
  ]
}) export class PrimeNgImportModule {}
