import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { EventProxyLibComponent } from './event-proxy-lib.component';
import { EnvServiceProvider } from './env/env.service.provider';

@NgModule({
  declarations: [EventProxyLibComponent],
  providers: [EnvServiceProvider],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  exports: [EventProxyLibComponent]
})
export class EventProxyLibModule { }
