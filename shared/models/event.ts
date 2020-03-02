export class uEvent
{
  public EventId: number = 0;
  public SourceEventUniqueId: number = 0;
  public SourceId: string = "";
  public AggregateId: number = 0;
  public SourceName: string = "";
  public EventLevel: number = 0;
  public UserID: number = 0; 
  public SessionID: string = "";
  public ParentID: number = 0;
  public ProtocolVersion: string = "";
  public Comment: string = "";
}

export enum uParts
{
  FrontendShell = 1000,
  Menu = 1001,
  Personnel = 1002,
  Occupations = 1003,
  ScriptLoader = 1004,
  OccupationNg9 = 1005
}

export enum uEventsIds
{
  InitEvent = 1000,
  PerssonelButtonPressed = 1001,
  OccupationButtonPressed = 1002,
  RequestToLoadScript = 1003,
  LoadedResource = 1004,
  OccupationNg9ButtonPressed = 1005,

  SubscribeToEvent = 2002
}