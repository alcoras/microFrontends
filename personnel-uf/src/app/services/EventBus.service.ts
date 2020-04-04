import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { uEvent } from '@uf-shared-models/index';

@Injectable({
  providedIn: 'root'
})
export class EventBusService {
  public EventBus = new Subject<uEvent>();
}
