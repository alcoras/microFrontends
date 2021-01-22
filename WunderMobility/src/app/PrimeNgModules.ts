import { NgModule } from "@angular/core";

import { ButtonModule } from "primeng/button";
import { RippleModule } from "primeng/ripple";
import { ListboxModule } from "primeng/listbox";
import { DropdownModule } from "primeng/dropdown";
import { ToolbarModule } from "primeng/toolbar";
import { TableModule } from "primeng/table";
import { CardModule } from "primeng/card";
import { InputTextModule } from "primeng/inputtext";
import { SliderModule } from "primeng/slider";
import { DialogModule } from "primeng/dialog";
import { AutoCompleteModule } from "primeng/autocomplete";
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from "primeng/checkbox";
import { ChipsModule } from "primeng/chips";
import { InputMaskModule } from "primeng/inputmask";
import { InputSwitchModule } from "primeng/inputswitch";
import { TreeTableModule } from "primeng/treetable";
import { ToastModule } from 'primeng/toast';
import { MessageService } from "primeng/api";
import { ContextMenuModule } from "primeng/contextmenu";
import { InputNumberModule } from "primeng/inputnumber";


@NgModule({
  exports: [
    ButtonModule,
    RippleModule,
    DropdownModule,
    ListboxModule,
    ToolbarModule,
    TableModule,
    CardModule,
    InputTextModule,
    SliderModule,
    DialogModule,
    AutoCompleteModule,
    CalendarModule,
    CheckboxModule,
    ChipsModule,
    InputMaskModule,
    InputSwitchModule,
    TreeTableModule,
    ToastModule,
    ContextMenuModule,
    InputNumberModule
  ],
  providers: [
    MessageService
  ]
}) export class PrimeNgModules { }
