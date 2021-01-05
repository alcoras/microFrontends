export class ObserverEventDataForTracing {
    public AggregateId: number;
    public EventId: number;
    public ParentId: number;
    public EventInfo: string;
    public SourceId: string;
    public SourceName: string;
    public BodyJson: string;
    public Timestamp?: string;
    public DestinationId: string;
}
