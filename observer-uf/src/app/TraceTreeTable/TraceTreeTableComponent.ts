import { Component } from "@angular/core";
import { ObserverEventDataForTracing, ObserverEventNode, ObserverSnapshotResult } from "event-proxy-lib-src";
import { LazyLoadEvent, TreeNode } from "primeng/api";
import { ObserverAPI } from "../services/ObserverAPI";

@Component({
  templateUrl: "TraceTreeTableView.html",
  selector: "observer-trace-table-comp",
  styleUrls: ['TraceTreeTableStyle.css']
}) export class TraceTreeTableComponent {

  public Loading: boolean;
  public Data: TreeNode<ObserverEventDataForTracing>[] = [];
  public SubData = {};

  public DisplayJsonBodyForm: boolean;
  public CurrentJsonBody: string;

  public Cols = [
    { field: 'EventId', header: 'EventId'},
    { field: 'DestinationId', header: 'DestinationId'},
    { field: 'ParentId', header: 'ParentId'},
    { field: 'EventInfo', header: 'EventInfo'},
    { field: 'AggregateId', header: 'AggregateId'},
    { field: 'SourceId', header: 'SourceId'},
    { field: 'SourceName', header: 'SourceName'},
    { field: 'Timestamp', header: 'Timestamp'},
  ];

  public constructor(private observerService: ObserverAPI) {}

  public ResetSnapshot(): void {
    this.observerService.ResetSnapshot().toPromise().then(
      () => this.RefreshTable()
    );
  }

  public RefreshTable(): void {
    this.requestSnapshotAndPopulateData();
  }

  public LoadDataLazy(event: LazyLoadEvent): void {
    this.requestSnapshotAndPopulateData();
  }

  public ShowJSONData(data: ObserverEventDataForTracing): void {
    this.CurrentJsonBody = JSON.stringify(JSON.parse(data.BodyJson), null, 4);
    this.DisplayJsonBodyForm = true;
  }

  private requestSnapshotAndPopulateData(): void {
    this.Loading = true;

    const response = this.observerService.RequestSnapshot();

    response.then( (data: ObserverSnapshotResult) => {

      console.log(data);

      const temp: TreeNode<ObserverEventDataForTracing>[] = [];
      this.convertToTreeNode(data.EventNode, temp);
      this.Data = temp[0].children;

      this.Loading = false;
    });
  }

  private convertToTreeNode(eventNode: ObserverEventNode, prev: TreeNode<ObserverEventDataForTracing>[]): void {

    const childrenNodes: TreeNode<ObserverEventDataForTracing>[] = [];

    const tempNode: TreeNode<ObserverEventDataForTracing> = {
      data: eventNode.EventData,
      children: childrenNodes
    };

    if (eventNode.Children.length > 0)
      eventNode.Children.forEach(element => {
        this.convertToTreeNode(element, childrenNodes);
    });

    prev.push(tempNode);
  }
}
