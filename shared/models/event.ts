/**
 * Event interface
 */
export abstract class uEvent {
  /**
   * Event id, should never be 0
   */
  public EventId = 1;

  /**
   * Source event unique id is populated by
   * microservice which parses the event
   */
  public SourceEventUniqueId = 0;

  /**
   * Source id of sender (microservice/frontend)
   * undefined - to prevent sending no SourceId
   */
  public SourceId = 'undefined';

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
  public UserId = 0;

  /**
   * Parent id used to indicate which event launched this event
   */
  public ParentId = 0;

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
  PersonnelButtonPressed = 1001,
  InitMenu = 1002,
  RequestToLoadScript = 1003,
  LoadedResource = 1004,
  OccupationNg9ButtonPressed = 1005,
  LanguageChange = 1006,
  ObserverButtonPressed = 1007,
  MaterialsReceiptsButtonPressed = 1008,
  // TemplateButtonPressed = 1009

  PingRequest = 2001,
  SubscribeToEvent = 2002,
  EventProccessedSuccessfully = 2003,
  EventProccessedWithFails = 2004,
  EventReceived = 2005,
  CreatePersonData = 2006,
  RegisterNewEvent = 2007,
  GetNewEvents = 2008,
  RegisterEventIds = 2009,
  RemovePersonData = 2010,
  ReadPersonDataQuery = 2011,
  FrontEndEventReceived = 2012,
  ReadPersonData = 2013,
  UpdatePersonData = 2014,
  OccupationsCreate = 2015,
  OccupationsUpdate = 2016,
  OccupationsDelete = 2017,
  OccupationsReadQuery = 2018,
  OccupationsRead = 2019,
  ReadPersonDataOnDateQuery = 2020,
  LoginRequested = 2021,
  LoginFailed = 2022,
  LoginSuccess = 2023,
  TokenFailure = 2024,
  SOneDokumentPrihodAnaliticheskiyProvedenie = 2025,
  SOneDokumentPrihodAnaliticheskiyOtmenaProvedeniya = 2026,
  RenewToken = 2027,
  TokenRenewSuccess = 2028,
  LoginSuccessWithTokenInformation = 2029,
  TokenRenewSuccessWithTokenInformation = 2030,
  MaterialsReceiptsReadListQuery = 2031,
  MaterialsReceiptsReadListResults = 2032,
  MaterialsReceiptsTablePartReadListQuery = 2033,
  MaterialsReceiptsTablePartReadListResults = 2034
}
