class uEvent
{
  constructor(
    public EventId:number
  ) {}
}

export class uEventTemplate
{
  constructor(
    public EventId: number,
    public SourceEventUniqueId: number,
    public SourceId: number,
    public AggregateId?: number,
    public SourceName?: number,
    public EventLevel?: number,
    public UserID?: number, 
    public SessionID?: string,
    public ParentID?: number,
    public ProtocolVersion?: string,
    public Comment?: string) {}
}

export class uParts
{
  static FrontendShell:number = 1000;
  static Menu:number = 1001;
  static Personnel:number = 1002;
  static Occupations:number = 1003;
  static ScriptLoader:number = 1004;
}

export class uEvents
{
  static InitEvent:uEvent = new uEvent(1000);
  static PerssonelButtonPressed:uEvent = new uEvent(1001);
  static OccupationButtonPressed:uEvent = new uEvent(1002);
  static RequestToLoadScript:uEvent = new uEvent(1003);
  static LoadedScript:uEvent = new uEvent(1004);
}