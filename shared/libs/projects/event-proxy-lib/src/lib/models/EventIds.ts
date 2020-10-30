/**
 * Event's id list
 */
export enum EventIds {
  // Frontend events
  InitEvent = 1000,
  PersonnelButtonPressed = 1001,
  InitMenu = 1002,
  RequestToLoadScript = 1003,
  LoadedResource = 1004,
  OccupationNg9ButtonPressed = 1005,
  LanguageChange = 1006,
  ObserverButtonPressed = 1007,
  MaterialsReceiptsButtonPressed = 1008,

  // Business events
  CreatePersonData = 2006,
  RemovePersonData = 2010,
  ReadPersonDataQuery = 2011,
  ReadPersonData = 2013,
  UpdatePersonData = 2014,
  OccupationsCreate = 2015,
  OccupationsUpdate = 2016,
  OccupationsDelete = 2017,
  OccupationsReadQuery = 2018,
  OccupationsRead = 2019,
  ReadPersonDataOnDateQuery = 2020,
  SOneDokumentPrihodAnaliticheskiyProvedenie = 2025,
  SOneDokumentPrihodAnaliticheskiyOtmenaProvedeniya = 2026,
  MaterialsReceiptsReadListQuery = 2031,
  MaterialsReceiptsReadListResults = 2032,
  MaterialsReceiptsTablePartReadListQuery = 2033,
  MaterialsReceiptsTablePartReadListResults = 2034,

  // Core events
  PingRequest = 2001,
  SubscribeToEvent = 2002,
  EventProccessedSuccessfully = 2003,
  EventProccessedWithFails = 2004,
  EventReceived = 2005,
  RegisterNewEvent = 2007,
  GetNewEvents = 2008,
  RegisterEventIds = 2009,
  FrontEndEventReceived = 2012,
  LoginRequested = 2021,
  LoginFailed = 2022,
  LoginSuccess = 2023,
  TokenFailure = 2024,
  RenewToken = 2027,
  TokenRenewSuccess = 2028,
  LoginSuccessWithTokenInformation = 2029,
  TokenRenewSuccessWithTokenInformation = 2030,
  ObserverSnapshotQuery = 2051,
  ObserverSnapshotResult = 2052,
}
