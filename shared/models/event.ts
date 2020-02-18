export class uEvent
{
    public EventId: number;
    public SourceEventUniqueId: number;
    public SourceId: number;
    public AggregateId: number;
    public SourceName: number;
    public EventLevel: number;
    public UserID: number; 
    public SessionID: string;
    public ParentID: number;
    public ProtocolVersion: string;
    public Comment: string;
}

export class uParts
{
  static FrontendShell:number = 1000;
  static Menu:number = 1001;
  static Personnel:number = 1002;
  static Occupations:number = 1003;
  static ScriptLoader:number = 1004;
}

export class uEventsIds
{
  static InitEvent = 1000;
  static PerssonelButtonPressed = 1001;
  static OccupationButtonPressed = 1002;
  static RequestToLoadScript = 1003;
  static LoadedScript = 1004;

  static SubscribeToEvent = 2002;
}