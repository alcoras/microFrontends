export class EventDataForTracing {
    public AggregateId: number;
    public EventId: number;
    public SourceId: string;
    public SourceName: string;
    public BodyJson: string;
    public Timestamp?: string;
    public DestinationId: string;
}
