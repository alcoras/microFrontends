/**
 * Event"s id list
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
  WunderMobilityButtonPressed = 1009,
  /** PLACEHOLDER USED BY INSTALLER */

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
  MaterialsReceiptsMaterialsAdd = 2035,
  MaterialsReceiptsMaterialsRemove = 2036,
  MaterialsReceiptsMaterialsReadListQuery = 2037,
  MaterialsReceiptsMaterialsReadListResults = 2038,
  MaterialsReceiptsScanTableAdd = 2039,
  MaterialsReceiptsScanTableRemove = 2040,
  MaterialsReceiptsScanTableReadListQuery = 2041,
  MaterialsReceiptsScanTableReadListResults = 2042,
  MaterialsReceiptsLocationsAdd = 2043,
  MaterialsReceiptsLocationsRemove = 2044,
  MaterialsReceiptsLocationsReadListQuery = 2045,
  MaterialsReceiptsLocationsReadListResults = 2046,
  MaterialsReceiptsMaterialsAtLocationAdd = 2047,
  MaterialsReceiptsMaterialsAtLocationsRemove = 2048,
  MaterialsReceiptsMaterialsAtLocationsReadListQuery = 2049,
	MaterialsReceiptsMaterialsAtLocationsReadListResults = 2050,
	InventoryManagerRegisterOperation = 2059,
	InventoryManagerRemoveOperation = 2060,
	InventoryManagerQuery = 2061,
	InventoryManagerResults = 2062,
  TestWunderMobilityProductsQuery = 2066,
  TestWunderMobilityProductsQueryResults = 2067,
  TestWunderMobilityDelete = 2068,
  TestWunderMobilityCreate = 2069,
  TestWunderMobilityCheckout = 2070,
  TestWunderMobilityCheckoutResults = 2071,
  OrchestratorTeam1OrchestrationFailed = 2072,
  OrchestratorTeam1OrchestrationSuccess = 2073,
  SOneMaterialReceiptBlock = 2074,
  SOneMaterialReceiptUnBlock = 2075,
  OrchestratorTeam1BarCodeDetailsQuery = 2076,
  OrchestratorTeam1BarCodeDetailsResult = 2077,
  OrchestratorTeam1MaterialsScanSigned = 2078,
  OrchestratorTeam1MaterialsScanUnSigned = 2079,
  MaterialsReceiptsMaterialsQueryListIds = 2080,

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
  CastorCreate = 2053,
  CastorDelete = 2054,
  CastorGet = 2055,
  CastorFound = 2056,
  Unsubscribe = 2063,
  ObserverSnapshotReset = 2064,
  DraftsCreate = 2081,
  DraftsDelete = 2082,
  DraftsGet = 2083,
  DraftsFound = 2084,
  DraftsUpdate = 2085,
	NewEntryCreatedSuccessfully = 2086,
	GiveMeQRCode = 2098,
	YourQRCode = 2099,
	QRCodeLogin = 2100,
	NewQRCodeReturned = 2101,
	QRCodeLoginRegistered = 2102,
	LoginQRCodeRequested = 2103,
}
