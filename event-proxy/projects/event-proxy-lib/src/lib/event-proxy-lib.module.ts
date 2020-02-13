import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from "@angular/common/http";
import { EventProxyLibComponent } from './event-proxy-lib.component';

@NgModule({
  declarations: [EventProxyLibComponent],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  exports: [EventProxyLibComponent]
})
export class EventProxyLibModule { }
