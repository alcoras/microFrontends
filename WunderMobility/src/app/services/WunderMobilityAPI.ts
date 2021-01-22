import { Injectable } from '@angular/core';
import { EventProxyLibService, MicroFrontendParts } from 'event-proxy-lib-src';
import { EventBusService } from './EventBusService';

@Injectable({
  providedIn: 'root',
}) export class WunderMobilityAPI {
  private sourceInfo = MicroFrontendParts.MaterialsReceipts;

  public constructor(
    private eventProxyService: EventProxyLibService,
    private eventBusService: EventBusService) { }
}
