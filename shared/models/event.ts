/**
 * Event interface
 */
export abstract class uEvent {
  /**
   * Event id, should not be 0
   */
  public EventId = 1;

  /**
   * Source event unique id is populated by
   * microservice which parses the event
   */
  public SourceEventUniqueId = 0;

  /**
   * Source id of sender (microservice/frontend)
   */
  public SourceId = '';

  /**
   * Aggregate id of event given by EventBroker
   */
  public AggregateId = 0;

  /**
   * Source name sender
   */
  public SourceName = '';

  /**
   * Event type
   */
  public EventLevel = 0;

  /**
   * User id
   */
  public UserID = 0;

  /**
   * Parent id used to indicate which event launched this event
   */
  public ParentID = 0;

  /**
   * Protocol version event
   */
  public ProtocolVersion = '';

  /**
   * Comment for additional information
   */
  public Comment = '';
}

/**
 * Event's id list
 */
export enum uEventsIds {
  InitEvent = 1000,
  PerssonelButtonPressed = 1001,
  InitMenu = 1002,
  RequestToLoadScript = 1003,
  LoadedResource = 1004,
  OccupationNg9ButtonPressed = 1005,
  LanguageChange = 1006,
  ObserverButtonPressed = 1007,

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
