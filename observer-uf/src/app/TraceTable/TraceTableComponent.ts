import { Component } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { ObserverSnapshotResultDTO } from '../models/DTOs/ObserverSnapshotResultDTO';
import { EventDataForTracing } from '../models/EventDataForTracing';
import { ObserverAPI } from '../services/ObserverAPI';

@Component({
  selector: 'trace-component',
  templateUrl: './View.html',
  styleUrls: ['./Styles.scss']
})
export class TraceTableComponent {
  public Loading: boolean;
  public ParentEvents: EventDataForTracing[];
  public ParentlessEvents: EventDataForTracing[];

  public Cols = [
    { field: 'EventId', header: 'EventId'},
    { field: 'AggregateId', header: 'AggregateId'},
    { field: 'SourceId', header: 'SourceId'},
    { field: 'SourceName', header: 'SourceName'},
    { field: 'DestinationId', header: 'DestinationId'},
    { field: 'Timestamp', header: 'Timestamp'},
  ];

  public constructor(private observerService: ObserverAPI) {}

  public RefreshTable(): void {
    this.Loading = true;

    const response = this.observerService.RequestSnapshot();

    response.then( (data: ObserverSnapshotResultDTO) => {
      this.ParentEvents = data.EventParentList;
      this.ParentlessEvents = data.EventParentlessList;

      console.log(this.ParentEvents);
      this.Loading = false;
    })
  }

  public LoadDataLazy(event: LazyLoadEvent): void {
    this.Loading = true;

    const response = this.observerService.RequestSnapshot();

    response.then( (data: ObserverSnapshotResultDTO) => {
      this.ParentEvents = data.EventParentList;
      this.ParentlessEvents = data.EventParentlessList;

      console.log(this.ParentEvents);
      this.Loading = false;
    })
  }
}
