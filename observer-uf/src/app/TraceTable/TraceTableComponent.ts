import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { ObserverSnapshotResultDTO } from '../models/DTOs/ObserverSnapshotResultDTO';
import { EventParent } from '../models/EventParent';
import { ObserverAPI } from '../services/ObserverAPI';

@Component({
  selector: 'trace-component',
  templateUrl: './View.html',
  styleUrls: ['./Styles.scss'],
  animations: [
    trigger('rowExpansionTrigger', [
        state('void', style({
            transform: 'translateX(-10%)',
            opacity: 0
        })),
        state('active', style({
            transform: 'translateX(0)',
            opacity: 1
        })),
        transition('* <=> *', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
    ])
]
})
export class TraceTableComponent {
  public Loading: boolean;
  public Data: ObserverSnapshotResultDTO;

  public ParentEvents: EventParent[];

  public DisplayJsonBodyForm: boolean;
  public CurrentJsonBody: string;

  public Cols = [
    { field: 'EventId', header: 'EventId'},
    { field: 'EventInfo', header: 'EventInfo'},
    { field: 'AggregateId', header: 'AggregateId'},
    { field: 'SourceId', header: 'SourceId'},
    { field: 'SourceName', header: 'SourceName'},
    { field: 'Timestamp', header: 'Timestamp'},
  ];

  public constructor(private observerService: ObserverAPI) {}

  public RefreshTable(): void {
    this.requestSnapshotAndPopulateData();
  }

  public LoadDataLazy(event: LazyLoadEvent): void {
    this.requestSnapshotAndPopulateData();
  }

  public ShowJsonBody(data: string): void {
    this.CurrentJsonBody = JSON.stringify(JSON.parse(data), null, 4);
    this.DisplayJsonBodyForm = true;
  }

  private requestSnapshotAndPopulateData(data: ObserverSnapshotResultDTO = this.Data): void {
    this.Loading = true;

    const response = this.observerService.RequestSnapshot();

    response.then( (newData: ObserverSnapshotResultDTO) => {
      data = newData;
      this.ParentEvents = data.EventParentList;
      this.Loading = false;
    });
  }
}
