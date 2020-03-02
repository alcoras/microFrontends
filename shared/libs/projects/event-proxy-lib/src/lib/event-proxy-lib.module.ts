import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { EventProxyLibComponent } from './event-proxy-lib.component';
import { EnvService } from './env/env.service';

@NgModule({
  declarations: [EventProxyLibComponent],
  providers: [ EnvService ],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  exports: [EventProxyLibComponent]
})
export class EventProxyLibModule { }
