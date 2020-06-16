import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { EnvironmentService } from './services/EnvironmentService';
import { EventProxyLibService } from './event-proxy-lib.service';

@NgModule({
  providers: [
    EnvironmentService,
    EventProxyLibService
  ],
  imports: [
    CommonModule,
    HttpClientModule,
  ]
})
export class EventProxyLibModule { }
