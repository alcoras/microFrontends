export abstract class uEvent {
  public EventId = 1;
  public SourceEventUniqueId = 0;
  public SourceId = '';
  public AggregateId = 0;
  public SourceName = '';
  public EventLevel = 0;
  public UserID = 0;
  public SessionID = '';
  public ParentID = 0;
  public ProtocolVersion = '';
  public Comment = '';
}

export enum uParts {
  FrontendShell = '1000',
  Menu = '1001',
  Personnel = '1002',
  Occupations = '1003',
  ScriptLoader = '1004',
  OccupationNg9 = '1005',
  UFManager = '1006'
}

export enum uEventsIds {
  InitEvent = 1000,
  PerssonelButtonPressed = 1001,
  InitMenu = 1002,
  RequestToLoadScript = 1003,
  LoadedResource = 1004,
  OccupationNg9ButtonPressed = 1005,
  LanguageChange = 1006,

  PingRequest = 2001,
  SubscribeToEvent = 2002,
  EventProccessedSuccessfully = 2003,
  EventProccessedWithFails = 2004,
  EventReceived = 2005,
  CreateUpdatePersonData = 2006,
  RegisterNewEvent = 2007,
  GetNewEvents = 2008,
  RegisterEventIds = 2009,
  RemovePersonData = 2010,
  ReadPersonDataQuery = 2011,
  FrontEndEventReceived = 2012,
  ReadPersonData = 2013
}
