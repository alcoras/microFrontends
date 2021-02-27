var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define("shared/libs/projects/event-proxy-lib/src/lib/DTOs/CoreEvent", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class CoreEvent {
        constructor() {
            this.EventId = 1;
            this.SourceEventUniqueId = 0;
            this.SourceId = "undefined";
            this.AggregateId = 0;
            this.SourceName = "";
            this.EventLevel = 0;
            this.UserId = 0;
            this.ParentId = 0;
            this.ProtocolVersion = "2.2.0";
            this.Token = "";
            this.Comment = "";
            this.DateTimeStampEventBroker = "";
            this.SubscribeToChildren = false;
            this.SubscribeToChildrenEventIds = [];
        }
    }
    exports.CoreEvent = CoreEvent;
});
define("shared/libs/projects/event-proxy-lib/src/lib/DTOs/EnvironmentTypes", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var EnvironmentTypes;
    (function (EnvironmentTypes) {
        EnvironmentTypes[EnvironmentTypes["Production"] = 0] = "Production";
        EnvironmentTypes[EnvironmentTypes["Staging"] = 1] = "Staging";
        EnvironmentTypes[EnvironmentTypes["Development"] = 2] = "Development";
        EnvironmentTypes[EnvironmentTypes["Isolated"] = 3] = "Isolated";
        EnvironmentTypes[EnvironmentTypes["Solo"] = 4] = "Solo";
    })(EnvironmentTypes = exports.EnvironmentTypes || (exports.EnvironmentTypes = {}));
});
define("shared/libs/projects/event-proxy-lib/src/lib/DTOs/Errors", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class ErrorMessage {
    }
    exports.ErrorMessage = ErrorMessage;
    ErrorMessage.NoEventId = "No EventId in message";
    ErrorMessage.TokenFailure = "Token failure. Try relogin";
    ErrorMessage.UnrecognizedEventId = "Unrecognized EventId";
});
define("shared/libs/projects/event-proxy-lib/src/lib/DTOs/EventIds", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var EventIds;
    (function (EventIds) {
        EventIds[EventIds["InitEvent"] = 1000] = "InitEvent";
        EventIds[EventIds["PersonnelButtonPressed"] = 1001] = "PersonnelButtonPressed";
        EventIds[EventIds["InitMenu"] = 1002] = "InitMenu";
        EventIds[EventIds["RequestToLoadScript"] = 1003] = "RequestToLoadScript";
        EventIds[EventIds["LoadedResource"] = 1004] = "LoadedResource";
        EventIds[EventIds["OccupationNg9ButtonPressed"] = 1005] = "OccupationNg9ButtonPressed";
        EventIds[EventIds["LanguageChange"] = 1006] = "LanguageChange";
        EventIds[EventIds["ObserverButtonPressed"] = 1007] = "ObserverButtonPressed";
        EventIds[EventIds["MaterialsReceiptsButtonPressed"] = 1008] = "MaterialsReceiptsButtonPressed";
        EventIds[EventIds["WunderMobilityButtonPressed"] = 1009] = "WunderMobilityButtonPressed";
        EventIds[EventIds["CreatePersonData"] = 2006] = "CreatePersonData";
        EventIds[EventIds["RemovePersonData"] = 2010] = "RemovePersonData";
        EventIds[EventIds["ReadPersonDataQuery"] = 2011] = "ReadPersonDataQuery";
        EventIds[EventIds["ReadPersonData"] = 2013] = "ReadPersonData";
        EventIds[EventIds["UpdatePersonData"] = 2014] = "UpdatePersonData";
        EventIds[EventIds["OccupationsCreate"] = 2015] = "OccupationsCreate";
        EventIds[EventIds["OccupationsUpdate"] = 2016] = "OccupationsUpdate";
        EventIds[EventIds["OccupationsDelete"] = 2017] = "OccupationsDelete";
        EventIds[EventIds["OccupationsReadQuery"] = 2018] = "OccupationsReadQuery";
        EventIds[EventIds["OccupationsRead"] = 2019] = "OccupationsRead";
        EventIds[EventIds["ReadPersonDataOnDateQuery"] = 2020] = "ReadPersonDataOnDateQuery";
        EventIds[EventIds["SOneDokumentPrihodAnaliticheskiyProvedenie"] = 2025] = "SOneDokumentPrihodAnaliticheskiyProvedenie";
        EventIds[EventIds["SOneDokumentPrihodAnaliticheskiyOtmenaProvedeniya"] = 2026] = "SOneDokumentPrihodAnaliticheskiyOtmenaProvedeniya";
        EventIds[EventIds["MaterialsReceiptsReadListQuery"] = 2031] = "MaterialsReceiptsReadListQuery";
        EventIds[EventIds["MaterialsReceiptsReadListResults"] = 2032] = "MaterialsReceiptsReadListResults";
        EventIds[EventIds["MaterialsReceiptsTablePartReadListQuery"] = 2033] = "MaterialsReceiptsTablePartReadListQuery";
        EventIds[EventIds["MaterialsReceiptsTablePartReadListResults"] = 2034] = "MaterialsReceiptsTablePartReadListResults";
        EventIds[EventIds["MaterialsReceiptsMaterialsAdd"] = 2035] = "MaterialsReceiptsMaterialsAdd";
        EventIds[EventIds["MaterialsReceiptsMaterialsRemove"] = 2036] = "MaterialsReceiptsMaterialsRemove";
        EventIds[EventIds["MaterialsReceiptsMaterialsReadListQuery"] = 2037] = "MaterialsReceiptsMaterialsReadListQuery";
        EventIds[EventIds["MaterialsReceiptsMaterialsReadListResults"] = 2038] = "MaterialsReceiptsMaterialsReadListResults";
        EventIds[EventIds["MaterialsReceiptsScanTableAdd"] = 2039] = "MaterialsReceiptsScanTableAdd";
        EventIds[EventIds["MaterialsReceiptsScanTableRemove"] = 2040] = "MaterialsReceiptsScanTableRemove";
        EventIds[EventIds["MaterialsReceiptsScanTableReadListQuery"] = 2041] = "MaterialsReceiptsScanTableReadListQuery";
        EventIds[EventIds["MaterialsReceiptsScanTableReadListResults"] = 2042] = "MaterialsReceiptsScanTableReadListResults";
        EventIds[EventIds["MaterialsReceiptsLocationsAdd"] = 2043] = "MaterialsReceiptsLocationsAdd";
        EventIds[EventIds["MaterialsReceiptsLocationsRemove"] = 2044] = "MaterialsReceiptsLocationsRemove";
        EventIds[EventIds["MaterialsReceiptsLocationsReadListQuery"] = 2045] = "MaterialsReceiptsLocationsReadListQuery";
        EventIds[EventIds["MaterialsReceiptsLocationsReadListResults"] = 2046] = "MaterialsReceiptsLocationsReadListResults";
        EventIds[EventIds["MaterialsReceiptsMaterialsAtLocationAdd"] = 2047] = "MaterialsReceiptsMaterialsAtLocationAdd";
        EventIds[EventIds["MaterialsReceiptsMaterialsAtLocationsRemove"] = 2048] = "MaterialsReceiptsMaterialsAtLocationsRemove";
        EventIds[EventIds["MaterialsReceiptsMaterialsAtLocationsReadListQuery"] = 2049] = "MaterialsReceiptsMaterialsAtLocationsReadListQuery";
        EventIds[EventIds["MaterialsReceiptsMaterialsAtLocationsReadListResults"] = 2050] = "MaterialsReceiptsMaterialsAtLocationsReadListResults";
        EventIds[EventIds["TestWunderMobilityProductsQuery"] = 2066] = "TestWunderMobilityProductsQuery";
        EventIds[EventIds["TestWunderMobilityProductsQueryResults"] = 2067] = "TestWunderMobilityProductsQueryResults";
        EventIds[EventIds["TestWunderMobilityDelete"] = 2068] = "TestWunderMobilityDelete";
        EventIds[EventIds["TestWunderMobilityCreate"] = 2069] = "TestWunderMobilityCreate";
        EventIds[EventIds["TestWunderMobilityCheckout"] = 2070] = "TestWunderMobilityCheckout";
        EventIds[EventIds["TestWunderMobilityCheckoutResults"] = 2071] = "TestWunderMobilityCheckoutResults";
        EventIds[EventIds["PingRequest"] = 2001] = "PingRequest";
        EventIds[EventIds["SubscribeToEvent"] = 2002] = "SubscribeToEvent";
        EventIds[EventIds["EventProccessedSuccessfully"] = 2003] = "EventProccessedSuccessfully";
        EventIds[EventIds["EventProccessedWithFails"] = 2004] = "EventProccessedWithFails";
        EventIds[EventIds["EventReceived"] = 2005] = "EventReceived";
        EventIds[EventIds["RegisterNewEvent"] = 2007] = "RegisterNewEvent";
        EventIds[EventIds["GetNewEvents"] = 2008] = "GetNewEvents";
        EventIds[EventIds["RegisterEventIds"] = 2009] = "RegisterEventIds";
        EventIds[EventIds["FrontEndEventReceived"] = 2012] = "FrontEndEventReceived";
        EventIds[EventIds["LoginRequested"] = 2021] = "LoginRequested";
        EventIds[EventIds["LoginFailed"] = 2022] = "LoginFailed";
        EventIds[EventIds["LoginSuccess"] = 2023] = "LoginSuccess";
        EventIds[EventIds["TokenFailure"] = 2024] = "TokenFailure";
        EventIds[EventIds["RenewToken"] = 2027] = "RenewToken";
        EventIds[EventIds["TokenRenewSuccess"] = 2028] = "TokenRenewSuccess";
        EventIds[EventIds["LoginSuccessWithTokenInformation"] = 2029] = "LoginSuccessWithTokenInformation";
        EventIds[EventIds["TokenRenewSuccessWithTokenInformation"] = 2030] = "TokenRenewSuccessWithTokenInformation";
        EventIds[EventIds["ObserverSnapshotQuery"] = 2051] = "ObserverSnapshotQuery";
        EventIds[EventIds["ObserverSnapshotResult"] = 2052] = "ObserverSnapshotResult";
        EventIds[EventIds["CastorCreate"] = 2053] = "CastorCreate";
        EventIds[EventIds["CastorDelete"] = 2054] = "CastorDelete";
        EventIds[EventIds["CastorGet"] = 2055] = "CastorGet";
        EventIds[EventIds["CastorFound"] = 2056] = "CastorFound";
        EventIds[EventIds["Unsubscribe"] = 2063] = "Unsubscribe";
        EventIds[EventIds["ObserverSnapshotReset"] = 2064] = "ObserverSnapshotReset";
    })(EventIds = exports.EventIds || (exports.EventIds = {}));
});
define("shared/libs/projects/event-proxy-lib/src/lib/DTOs/MicroFrontendInfo", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class MicroFrontendInfo {
    }
    exports.MicroFrontendInfo = MicroFrontendInfo;
});
define("shared/libs/projects/event-proxy-lib/src/lib/DTOs/IMicroFrontend", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("shared/libs/projects/event-proxy-lib/src/lib/DTOs/MicroFrontendParts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class MicroFrontendParts {
        static GetSourceNameFromSourceID(sourceId) {
            const members = Object.getOwnPropertyNames(this);
            for (const key of members) {
                if (this[key].SourceId === sourceId) {
                    return this[key].SourceName;
                }
            }
            return undefined;
        }
        static GetSourceIdFromSourceName(sourceName) {
            const members = Object.getOwnPropertyNames(this);
            for (const key of members) {
                if (this[key].SourceName === sourceName) {
                    return this[key].SourceId;
                }
            }
            return undefined;
        }
    }
    exports.MicroFrontendParts = MicroFrontendParts;
    MicroFrontendParts.FrontendShell = {
        SourceId: '1000',
        SourceName: 'FrontendShell'
    };
    MicroFrontendParts.Menu = {
        SourceId: '1001',
        SourceName: 'Menu'
    };
    MicroFrontendParts.Personnel = {
        SourceId: '1002',
        SourceName: 'Personnel'
    };
    MicroFrontendParts.Occupations = {
        SourceId: '1005',
        SourceName: 'Occupations'
    };
    MicroFrontendParts.UFManager = {
        SourceId: '1006',
        SourceName: 'UFManager'
    };
    MicroFrontendParts.Observer = {
        SourceId: '1007',
        SourceName: 'Observer'
    };
    MicroFrontendParts.MaterialsReceipts = {
        SourceId: '1008',
        SourceName: 'MaterialsReceipts'
    };
    MicroFrontendParts.WunderMobility = {
        SourceId: '1009',
        SourceName: 'WunderMobility'
    };
    MicroFrontendParts.$project_name$ = {
        SourceId: '$source_id$',
        SourceName: '$project_name$'
    };
});
define("shared/libs/projects/event-proxy-lib/src/lib/DTOs/ValidationStatus", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class ValidationStatus {
        constructor() {
            this.ErrorList = [];
        }
        HasErrors() {
            return this.ErrorList.length > 0;
        }
    }
    exports.ValidationStatus = ValidationStatus;
});
define("shared/libs/projects/event-proxy-lib/src/lib/DTOs/BackendEvents/BackendToFrontendEvent", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class BackendToFrontendEvent {
    }
    exports.BackendToFrontendEvent = BackendToFrontendEvent;
});
define("shared/libs/projects/event-proxy-lib/src/lib/DTOs/BackendEvents/LoginSuccess", ["require", "exports", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/CoreEvent"], function (require, exports, CoreEvent_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class LoginSuccess extends CoreEvent_1.CoreEvent {
    }
    exports.LoginSuccess = LoginSuccess;
});
define("shared/libs/projects/event-proxy-lib/src/lib/DTOs/BackendEvents/SubscibeToEvent", ["require", "exports", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/CoreEvent", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/EventIds"], function (require, exports, CoreEvent_2, EventIds_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class SubscibeToEvent extends CoreEvent_2.CoreEvent {
        constructor(SourceId, IdsTripleList, CleanSubscriptionList = false) {
            super();
            this.IdsTripleList = IdsTripleList;
            this.CleanSubscriptionList = CleanSubscriptionList;
            this.EventId = EventIds_1.EventIds.SubscribeToEvent;
            this.SourceId = SourceId;
        }
    }
    exports.SubscibeToEvent = SubscibeToEvent;
});
define("shared/libs/projects/event-proxy-lib/src/lib/DTOs/BackendEvents/UnsubscibeToEvent", ["require", "exports", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/CoreEvent", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/EventIds"], function (require, exports, CoreEvent_3, EventIds_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class UnsubscibeToEvent extends CoreEvent_3.CoreEvent {
        constructor(SourceId, IdsTripleList, CleanSubscriptionList = false) {
            super();
            this.IdsTripleList = IdsTripleList;
            this.CleanSubscriptionList = CleanSubscriptionList;
            this.SubscribeToChildren = false;
            this.EventId = EventIds_2.EventIds.Unsubscribe;
            this.SourceId = SourceId;
        }
    }
    exports.UnsubscibeToEvent = UnsubscibeToEvent;
});
define("shared/libs/projects/event-proxy-lib/src/lib/DTOs/BackendEvents/LoginRequest", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class LoginRequest {
    }
    exports.LoginRequest = LoginRequest;
});
define("shared/libs/projects/event-proxy-lib/src/lib/DTOs/FrontendEvents/EventButtonPressed", ["require", "exports", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/CoreEvent"], function (require, exports, CoreEvent_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class EventButtonPressed extends CoreEvent_4.CoreEvent {
        constructor(buttonPressedEventId, UniqueElementId) {
            super();
            this.UniqueElementId = UniqueElementId;
            this.EventId = buttonPressedEventId;
        }
    }
    exports.EventButtonPressed = EventButtonPressed;
});
define("shared/libs/projects/event-proxy-lib/src/lib/DTOs/FrontendEvents/InitializeMenuEvent", ["require", "exports", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/CoreEvent", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/EventIds"], function (require, exports, CoreEvent_5, EventIds_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class InitializeMenuEvent extends CoreEvent_5.CoreEvent {
        constructor(sourceId) {
            super();
            this.EventId = EventIds_3.EventIds.InitMenu;
            this.SourceId = sourceId;
        }
    }
    exports.InitializeMenuEvent = InitializeMenuEvent;
});
define("shared/libs/projects/event-proxy-lib/src/lib/DTOs/FrontendEvents/LanguageChange", ["require", "exports", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/CoreEvent", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/EventIds"], function (require, exports, CoreEvent_6, EventIds_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class LanguageChange extends CoreEvent_6.CoreEvent {
        constructor(NewLanguage) {
            super();
            this.NewLanguage = NewLanguage;
            this.EventId = EventIds_4.EventIds.LanguageChange;
        }
    }
    exports.LanguageChange = LanguageChange;
});
define("shared/libs/projects/event-proxy-lib/src/lib/DTOs/FrontendEvents/Adds/ResourceSheme", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class ResourceSheme {
        constructor() {
            this.Attributes = {};
        }
        setAttribute(attr, value) {
            this.Attributes[attr] = value;
        }
    }
    exports.ResourceSheme = ResourceSheme;
});
define("shared/libs/projects/event-proxy-lib/src/lib/DTOs/FrontendEvents/LoadedResource", ["require", "exports", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/CoreEvent", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/EventIds"], function (require, exports, CoreEvent_7, EventIds_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class LoadedResource extends CoreEvent_7.CoreEvent {
        constructor(ResourceEventId, ResourceScheme) {
            super();
            this.ResourceEventId = ResourceEventId;
            this.ResourceScheme = ResourceScheme;
            this.EventId = EventIds_5.EventIds.LoadedResource;
        }
    }
    exports.LoadedResource = LoadedResource;
});
define("shared/libs/projects/event-proxy-lib/src/lib/DTOs/FrontendEvents/RequestToLoadScript", ["require", "exports", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/CoreEvent", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/EventIds"], function (require, exports, CoreEvent_8, EventIds_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class RequestToLoadScripts extends CoreEvent_8.CoreEvent {
        constructor(RequestEventId, ResourceSchemes) {
            super();
            this.RequestEventId = RequestEventId;
            this.ResourceSchemes = ResourceSchemes;
            this.EventId = EventIds_6.EventIds.RequestToLoadScript;
        }
    }
    exports.RequestToLoadScripts = RequestToLoadScripts;
});
define("shared/libs/projects/event-proxy-lib/src/lib/DTOs/FrontendEvents/FrontendToBackendEvent", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class FrontendToBackendEvent {
    }
    exports.FrontendToBackendEvent = FrontendToBackendEvent;
});
define("shared/libs/projects/event-proxy-lib/src/lib/DTOs/FrontendEvents/Adds/ButtonIds", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ButtonIds;
    (function (ButtonIds) {
        ButtonIds[ButtonIds["PersonnelButtonPressed"] = 1001] = "PersonnelButtonPressed";
        ButtonIds[ButtonIds["OccupationNg9ButtonPressed"] = 1005] = "OccupationNg9ButtonPressed";
        ButtonIds[ButtonIds["ObserverButtonPressed"] = 1007] = "ObserverButtonPressed";
        ButtonIds[ButtonIds["MaterialReceiptsButtonPressed"] = 1008] = "MaterialReceiptsButtonPressed";
    })(ButtonIds = exports.ButtonIds || (exports.ButtonIds = {}));
});
define("shared/libs/projects/event-proxy-lib/src/lib/DTOs/FrontendEvents/Adds/MicroFrontendData", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class MicroFrontendData {
        constructor() {
            this.events = [];
            this.resources = [];
        }
    }
    exports.MicroFrontendData = MicroFrontendData;
});
define("shared/libs/projects/event-proxy-lib/src/lib/DTOs/FrontendEvents/index", ["require", "exports", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/FrontendEvents/EventButtonPressed", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/FrontendEvents/InitializeMenuEvent", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/FrontendEvents/LanguageChange", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/FrontendEvents/LoadedResource", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/FrontendEvents/RequestToLoadScript", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/FrontendEvents/FrontendToBackendEvent", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/FrontendEvents/Adds/ButtonIds", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/FrontendEvents/Adds/MicroFrontendData", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/FrontendEvents/Adds/ResourceSheme"], function (require, exports, EventButtonPressed_1, InitializeMenuEvent_1, LanguageChange_1, LoadedResource_1, RequestToLoadScript_1, FrontendToBackendEvent_1, ButtonIds_1, MicroFrontendData_1, ResourceSheme_1) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    __export(EventButtonPressed_1);
    __export(InitializeMenuEvent_1);
    __export(LanguageChange_1);
    __export(LoadedResource_1);
    __export(RequestToLoadScript_1);
    __export(FrontendToBackendEvent_1);
    __export(ButtonIds_1);
    __export(MicroFrontendData_1);
    __export(ResourceSheme_1);
});
define("shared/libs/projects/event-proxy-lib/src/lib/DTOs/BackendEvents/Adds/PersonData", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class PersonData {
    }
    exports.PersonData = PersonData;
});
define("shared/libs/projects/event-proxy-lib/src/lib/DTOs/BackendEvents/CreateUpdatePersonData", ["require", "exports", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/CoreEvent"], function (require, exports, CoreEvent_9) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PersonDataCreateUpdateFlag;
    (function (PersonDataCreateUpdateFlag) {
        PersonDataCreateUpdateFlag[PersonDataCreateUpdateFlag["Create"] = 2006] = "Create";
        PersonDataCreateUpdateFlag[PersonDataCreateUpdateFlag["Update"] = 2014] = "Update";
    })(PersonDataCreateUpdateFlag = exports.PersonDataCreateUpdateFlag || (exports.PersonDataCreateUpdateFlag = {}));
    class CreateUpdatePersonData extends CoreEvent_9.CoreEvent {
        constructor(sourceId, createUpdateFlag, Personnel) {
            super();
            this.EventId = createUpdateFlag;
            this.SourceId = sourceId;
            this.PersonDataID = Personnel.PersonDataID;
            this.DateValue = Personnel.DateValue;
            this.DocReestratorID = Personnel.DocReestratorID;
            this.Oklad = Personnel.Oklad;
            this.Stavka = Personnel.Stavka;
            this.PIP = Personnel.PIP;
            this.KodDRFO = Personnel.KodDRFO;
            this.DataPriyomu = Personnel.DataPriyomu;
            this.Posada = Personnel.Posada;
            this.PodatkovaPilga = Personnel.PodatkovaPilga;
        }
    }
    exports.CreateUpdatePersonData = CreateUpdatePersonData;
});
define("shared/libs/projects/event-proxy-lib/src/lib/DTOs/BackendEvents/PersonDataRead", ["require", "exports", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/CoreEvent"], function (require, exports, CoreEvent_10) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class PersonDataRead extends CoreEvent_10.CoreEvent {
    }
    exports.PersonDataRead = PersonDataRead;
});
define("shared/libs/projects/event-proxy-lib/src/lib/DTOs/BackendEvents/ReadPersonDataQuery", ["require", "exports", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/CoreEvent", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/EventIds"], function (require, exports, CoreEvent_11, EventIds_7) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class ReadPersonDataQuery extends CoreEvent_11.CoreEvent {
        constructor(sourceId, ListParametersNameForSorting, NumberPageOutput, NumberRecordsOnPage) {
            super();
            this.ListParametersNameForSorting = ListParametersNameForSorting;
            this.NumberPageOutput = NumberPageOutput;
            this.NumberRecordsOnPage = NumberRecordsOnPage;
            this.SourceId = sourceId;
            this.EventId = EventIds_7.EventIds.ReadPersonDataQuery;
        }
    }
    exports.ReadPersonDataQuery = ReadPersonDataQuery;
});
define("shared/libs/projects/event-proxy-lib/src/lib/DTOs/BackendEvents/RemoveEnterpisePersonData", ["require", "exports", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/CoreEvent", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/EventIds"], function (require, exports, CoreEvent_12, EventIds_8) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class RemoveEnterpisePersonData extends CoreEvent_12.CoreEvent {
        constructor(sourceId, PersonDataID) {
            super();
            this.PersonDataID = PersonDataID;
            this.SourceId = sourceId;
            this.EventId = EventIds_8.EventIds.RemovePersonData;
        }
    }
    exports.RemoveEnterpisePersonData = RemoveEnterpisePersonData;
});
define("shared/libs/projects/event-proxy-lib/src/lib/DTOs/BackendEvents/Adds/OccupationData", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class OccupationData {
    }
    exports.OccupationData = OccupationData;
});
define("shared/libs/projects/event-proxy-lib/src/lib/DTOs/BackendEvents/OccupationsCreateUpdate", ["require", "exports", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/CoreEvent"], function (require, exports, CoreEvent_13) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var OccupationCreateUpdateFlag;
    (function (OccupationCreateUpdateFlag) {
        OccupationCreateUpdateFlag[OccupationCreateUpdateFlag["Create"] = 2015] = "Create";
        OccupationCreateUpdateFlag[OccupationCreateUpdateFlag["Update"] = 2016] = "Update";
    })(OccupationCreateUpdateFlag = exports.OccupationCreateUpdateFlag || (exports.OccupationCreateUpdateFlag = {}));
    class OccupationsCreateUpdate extends CoreEvent_13.CoreEvent {
        constructor(sourceId, createUpdateFlag, dateTimeValue, data) {
            super();
            this.SourceId = sourceId;
            this.EventId = createUpdateFlag;
            this.DateTimeValue = dateTimeValue;
            this.OccupationAggregateIdHolderId = data.OccupationAggregateIdHolderId;
            this.DocReestratorId = data.DocReestratorId;
            this.Name = data.Name;
            this.TariffCategory = data.TariffCategory;
        }
    }
    exports.OccupationsCreateUpdate = OccupationsCreateUpdate;
});
define("shared/libs/projects/event-proxy-lib/src/lib/DTOs/BackendEvents/OccupationsDeleteEvent", ["require", "exports", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/CoreEvent", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/EventIds"], function (require, exports, CoreEvent_14, EventIds_9) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class OccupationsDeleteEvent extends CoreEvent_14.CoreEvent {
        constructor(sourceId, ObjectAggregateId) {
            super();
            this.ObjectAggregateId = ObjectAggregateId;
            this.SourceId = sourceId;
            this.EventId = EventIds_9.EventIds.OccupationsDelete;
        }
    }
    exports.OccupationsDeleteEvent = OccupationsDeleteEvent;
});
define("shared/libs/projects/event-proxy-lib/src/lib/DTOs/BackendEvents/OccupationsReadResults", ["require", "exports", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/CoreEvent"], function (require, exports, CoreEvent_15) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class OccupationsReadResults extends CoreEvent_15.CoreEvent {
    }
    exports.OccupationsReadResults = OccupationsReadResults;
});
define("shared/libs/projects/event-proxy-lib/src/lib/DTOs/BackendEvents/OccupationsReadQuery", ["require", "exports", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/CoreEvent", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/EventIds"], function (require, exports, CoreEvent_16, EventIds_10) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class OccupationsReadQuery extends CoreEvent_16.CoreEvent {
        constructor(sourceId, DateTimeValue, Page, Limit) {
            super();
            this.DateTimeValue = DateTimeValue;
            this.Page = Page;
            this.Limit = Limit;
            if (Page <= 0 || Limit <= 0)
                throw new Error('Page or Limit cannot be 0 or below');
            this.SourceId = sourceId;
            this.EventId = EventIds_10.EventIds.OccupationsReadQuery;
        }
    }
    exports.OccupationsReadQuery = OccupationsReadQuery;
});
define("shared/libs/projects/event-proxy-lib/src/lib/DTOs/BackendEvents/ObserverSnapshotQuery", ["require", "exports", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/CoreEvent", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/EventIds"], function (require, exports, CoreEvent_17, EventIds_11) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class ObserverSnapshowQuery extends CoreEvent_17.CoreEvent {
        constructor(sourceInfo) {
            super();
            this.SourceId = sourceInfo.SourceId;
            this.SourceName = sourceInfo.SourceName;
            this.EventId = EventIds_11.EventIds.ObserverSnapshotQuery;
        }
    }
    exports.ObserverSnapshowQuery = ObserverSnapshowQuery;
});
define("shared/libs/projects/event-proxy-lib/src/lib/DTOs/BackendEvents/Adds/ObserverEventDataForTracing", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class ObserverEventDataForTracing {
    }
    exports.ObserverEventDataForTracing = ObserverEventDataForTracing;
});
define("shared/libs/projects/event-proxy-lib/src/lib/DTOs/BackendEvents/Adds/ObserverEventNode", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class ObserverEventNode {
    }
    exports.ObserverEventNode = ObserverEventNode;
});
define("shared/libs/projects/event-proxy-lib/src/lib/DTOs/BackendEvents/ObserverSnapshotResult", ["require", "exports", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/CoreEvent"], function (require, exports, CoreEvent_18) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class ObserverSnapshotResult extends CoreEvent_18.CoreEvent {
    }
    exports.ObserverSnapshotResult = ObserverSnapshotResult;
});
define("shared/libs/projects/event-proxy-lib/src/lib/DTOs/BackendEvents/MaterialsReceiptsReadListQuery", ["require", "exports", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/CoreEvent", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/EventIds"], function (require, exports, CoreEvent_19, EventIds_12) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class MaterialsReceiptsReadListQuery extends CoreEvent_19.CoreEvent {
        constructor(sourceInfo, IntervalFrom, IntervalUntil, Signed, Page, Limit) {
            super();
            this.IntervalFrom = IntervalFrom;
            this.IntervalUntil = IntervalUntil;
            this.Signed = Signed;
            this.Page = Page;
            this.Limit = Limit;
            if (Page <= 0 || Limit <= 0)
                throw new Error('Page or Limit cannot be 0 or below');
            this.SourceId = sourceInfo.SourceId;
            this.SourceName = sourceInfo.SourceName;
            this.EventId = EventIds_12.EventIds.MaterialsReceiptsReadListQuery;
        }
    }
    exports.MaterialsReceiptsReadListQuery = MaterialsReceiptsReadListQuery;
});
define("shared/libs/projects/event-proxy-lib/src/lib/DTOs/BackendEvents/Adds/MaterialsList", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class MaterialsList {
    }
    exports.MaterialsList = MaterialsList;
});
define("shared/libs/projects/event-proxy-lib/src/lib/DTOs/BackendEvents/MaterialsReceiptsReadListResults", ["require", "exports", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/CoreEvent"], function (require, exports, CoreEvent_20) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class MaterialsReceiptsReadListResults extends CoreEvent_20.CoreEvent {
    }
    exports.MaterialsReceiptsReadListResults = MaterialsReceiptsReadListResults;
});
define("shared/libs/projects/event-proxy-lib/src/lib/DTOs/BackendEvents/MaterialsReceiptsTablePartReadListQuery", ["require", "exports", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/CoreEvent", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/EventIds"], function (require, exports, CoreEvent_21, EventIds_13) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class MaterialsReceiptsTablePartReadListQuery extends CoreEvent_21.CoreEvent {
        constructor(sourceInfo, MaterialsReceiptsId, Page, Limit) {
            super();
            this.MaterialsReceiptsId = MaterialsReceiptsId;
            this.Page = Page;
            this.Limit = Limit;
            if (Page <= 0 || Limit <= 0)
                throw new Error('Page or Limit cannot be 0 or below');
            this.SourceId = sourceInfo.SourceId;
            this.SourceName = sourceInfo.SourceName;
            this.EventId = EventIds_13.EventIds.MaterialsReceiptsTablePartReadListQuery;
        }
    }
    exports.MaterialsReceiptsTablePartReadListQuery = MaterialsReceiptsTablePartReadListQuery;
});
define("shared/libs/projects/event-proxy-lib/src/lib/DTOs/BackendEvents/Adds/MaterialsListTablePart", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class MaterialsListTablePart {
    }
    exports.MaterialsListTablePart = MaterialsListTablePart;
});
define("shared/libs/projects/event-proxy-lib/src/lib/DTOs/BackendEvents/MaterialsReceiptsTablePartReadListResults", ["require", "exports", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/CoreEvent"], function (require, exports, CoreEvent_22) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class MaterialsReceiptsTablePartReadListResults extends CoreEvent_22.CoreEvent {
    }
    exports.MaterialsReceiptsTablePartReadListResults = MaterialsReceiptsTablePartReadListResults;
});
define("shared/libs/projects/event-proxy-lib/src/lib/DTOs/BackendEvents/Adds/ScanTableData", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class ScanTableData {
    }
    exports.ScanTableData = ScanTableData;
});
define("shared/libs/projects/event-proxy-lib/src/lib/DTOs/BackendEvents/MaterialsReceiptsScanTableAddRemove", ["require", "exports", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/CoreEvent"], function (require, exports, CoreEvent_23) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MaterialsReceiptsScanTableAddRemoveFlag;
    (function (MaterialsReceiptsScanTableAddRemoveFlag) {
        MaterialsReceiptsScanTableAddRemoveFlag[MaterialsReceiptsScanTableAddRemoveFlag["Create"] = 2039] = "Create";
        MaterialsReceiptsScanTableAddRemoveFlag[MaterialsReceiptsScanTableAddRemoveFlag["Delete"] = 2040] = "Delete";
    })(MaterialsReceiptsScanTableAddRemoveFlag = exports.MaterialsReceiptsScanTableAddRemoveFlag || (exports.MaterialsReceiptsScanTableAddRemoveFlag = {}));
    class MaterialsReceiptsScanTableAddRemove extends CoreEvent_23.CoreEvent {
        constructor(sourceInfo, scanTableData, addRemoveFlag) {
            super();
            this.MaterialsId = scanTableData.MaterialsId;
            this.MaterialsReceiptsListId = scanTableData.MaterialsReceiptsListId;
            this.MaterialsReceiptsTableId = scanTableData.MaterialsReceiptsTableId;
            this.Quantity = scanTableData.Quantity;
            this.Unit = scanTableData.Unit;
            this.SourceId = sourceInfo.SourceId;
            this.SourceName = sourceInfo.SourceName;
            this.EventId = addRemoveFlag;
        }
    }
    exports.MaterialsReceiptsScanTableAddRemove = MaterialsReceiptsScanTableAddRemove;
});
define("shared/libs/projects/event-proxy-lib/src/lib/DTOs/BackendEvents/MaterialsReceiptsScanTableReadListQuery", ["require", "exports", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/CoreEvent", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/EventIds"], function (require, exports, CoreEvent_24, EventIds_14) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class MaterialsReceiptsScanTableReadListQuery extends CoreEvent_24.CoreEvent {
        constructor(sourceInfo, ScanTableId, MaterialsId, MaterialReceiptsListId, MaterialReceiptsTableId, Page, Limit) {
            super();
            this.ScanTableId = ScanTableId;
            this.MaterialsId = MaterialsId;
            this.MaterialReceiptsListId = MaterialReceiptsListId;
            this.MaterialReceiptsTableId = MaterialReceiptsTableId;
            this.Page = Page;
            this.Limit = Limit;
            if (Page <= 0 || Limit <= 0)
                throw new Error('Page or Limit cannot be 0 or below');
            this.SourceId = sourceInfo.SourceId;
            this.SourceName = sourceInfo.SourceName;
            this.EventId = EventIds_14.EventIds.MaterialsReceiptsScanTableReadListQuery;
        }
    }
    exports.MaterialsReceiptsScanTableReadListQuery = MaterialsReceiptsScanTableReadListQuery;
});
define("shared/libs/projects/event-proxy-lib/src/lib/DTOs/BackendEvents/MaterialsReceiptsScanTableReadListResults", ["require", "exports", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/CoreEvent"], function (require, exports, CoreEvent_25) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class MaterialsReceiptsScanTableReadListResults extends CoreEvent_25.CoreEvent {
    }
    exports.MaterialsReceiptsScanTableReadListResults = MaterialsReceiptsScanTableReadListResults;
});
define("shared/libs/projects/event-proxy-lib/src/lib/DTOs/BackendEvents/Adds/LocationsData", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class LocationsData {
    }
    exports.LocationsData = LocationsData;
});
define("shared/libs/projects/event-proxy-lib/src/lib/DTOs/BackendEvents/MaterialsReceiptsLocationsReadListResults", ["require", "exports", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/CoreEvent"], function (require, exports, CoreEvent_26) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class MaterialsReceiptsLocationsReadListResults extends CoreEvent_26.CoreEvent {
    }
    exports.MaterialsReceiptsLocationsReadListResults = MaterialsReceiptsLocationsReadListResults;
});
define("shared/libs/projects/event-proxy-lib/src/lib/DTOs/BackendEvents/MaterialsReceiptsLocationsReadListQuery", ["require", "exports", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/CoreEvent", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/EventIds"], function (require, exports, CoreEvent_27, EventIds_15) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class MaterialsReceiptsLocationsReadListQuery extends CoreEvent_27.CoreEvent {
        constructor(sourceInfo, LocationId, Page, Limit) {
            super();
            this.LocationId = LocationId;
            this.Page = Page;
            this.Limit = Limit;
            if (Page <= 0 || Limit <= 0)
                throw new Error('Page or Limit cannot be 0 or below');
            this.SourceId = sourceInfo.SourceId;
            this.SourceName = sourceInfo.SourceName;
            this.EventId = EventIds_15.EventIds.MaterialsReceiptsLocationsReadListQuery;
        }
    }
    exports.MaterialsReceiptsLocationsReadListQuery = MaterialsReceiptsLocationsReadListQuery;
});
define("shared/libs/projects/event-proxy-lib/src/lib/DTOs/BackendEvents/MaterialsReceiptsLocationsAddRemove", ["require", "exports", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/CoreEvent"], function (require, exports, CoreEvent_28) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MaterialsReceiptsLocationsAddRemoveFlag;
    (function (MaterialsReceiptsLocationsAddRemoveFlag) {
        MaterialsReceiptsLocationsAddRemoveFlag[MaterialsReceiptsLocationsAddRemoveFlag["Create"] = 2043] = "Create";
        MaterialsReceiptsLocationsAddRemoveFlag[MaterialsReceiptsLocationsAddRemoveFlag["Delete"] = 2044] = "Delete";
    })(MaterialsReceiptsLocationsAddRemoveFlag = exports.MaterialsReceiptsLocationsAddRemoveFlag || (exports.MaterialsReceiptsLocationsAddRemoveFlag = {}));
    class MaterialsReceiptsLocationsAddRemove extends CoreEvent_28.CoreEvent {
        constructor(sourceInfo, locationData, addRemoveFlag) {
            super();
            this.LocationsId = locationData.Id;
            this.LocationDescription = locationData.LocationDescription;
            this.LocationBarCode = locationData.LocationBarCode;
            this.SourceId = sourceInfo.SourceId;
            this.SourceName = sourceInfo.SourceName;
            this.EventId = addRemoveFlag;
        }
    }
    exports.MaterialsReceiptsLocationsAddRemove = MaterialsReceiptsLocationsAddRemove;
});
define("shared/libs/projects/event-proxy-lib/src/lib/DTOs/BackendEvents/Adds/MaterialsAtLocationsData", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class MaterialsAtLocationsData {
    }
    exports.MaterialsAtLocationsData = MaterialsAtLocationsData;
});
define("shared/libs/projects/event-proxy-lib/src/lib/DTOs/BackendEvents/MaterialsReceiptsMaterialsAtLocationsReadListQuery", ["require", "exports", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/CoreEvent", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/EventIds"], function (require, exports, CoreEvent_29, EventIds_16) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class MaterialsReceiptsMaterialsAtLocationsReadListQuery extends CoreEvent_29.CoreEvent {
        constructor(sourceInfo, MaterialsId, LocationId, Page, Limit) {
            super();
            this.MaterialsId = MaterialsId;
            this.LocationId = LocationId;
            this.Page = Page;
            this.Limit = Limit;
            this.SourceId = sourceInfo.SourceId;
            this.SourceName = sourceInfo.SourceName;
            this.EventId = EventIds_16.EventIds.MaterialsReceiptsMaterialsAtLocationsReadListQuery;
        }
    }
    exports.MaterialsReceiptsMaterialsAtLocationsReadListQuery = MaterialsReceiptsMaterialsAtLocationsReadListQuery;
});
define("shared/libs/projects/event-proxy-lib/src/lib/DTOs/BackendEvents/MaterialsReceiptsMaterialsAtLocationsAddRemove", ["require", "exports", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/CoreEvent"], function (require, exports, CoreEvent_30) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MaterialsReceiptsMaterialsAtLocationsAddRemoveFlag;
    (function (MaterialsReceiptsMaterialsAtLocationsAddRemoveFlag) {
        MaterialsReceiptsMaterialsAtLocationsAddRemoveFlag[MaterialsReceiptsMaterialsAtLocationsAddRemoveFlag["Create"] = 2047] = "Create";
        MaterialsReceiptsMaterialsAtLocationsAddRemoveFlag[MaterialsReceiptsMaterialsAtLocationsAddRemoveFlag["Delete"] = 2048] = "Delete";
    })(MaterialsReceiptsMaterialsAtLocationsAddRemoveFlag = exports.MaterialsReceiptsMaterialsAtLocationsAddRemoveFlag || (exports.MaterialsReceiptsMaterialsAtLocationsAddRemoveFlag = {}));
    class MaterialsReceiptsMaterialsAtLocationsAddRemove extends CoreEvent_30.CoreEvent {
        constructor(sourceInfo, addRemoveFlag, MaterialsId, LocationId, Quantity, Unity) {
            super();
            this.MaterialsId = MaterialsId;
            this.LocationId = LocationId;
            this.Quantity = Quantity;
            this.Unity = Unity;
            this.SourceId = sourceInfo.SourceId;
            this.SourceName = sourceInfo.SourceName;
            this.EventId = addRemoveFlag;
        }
    }
    exports.MaterialsReceiptsMaterialsAtLocationsAddRemove = MaterialsReceiptsMaterialsAtLocationsAddRemove;
});
define("shared/libs/projects/event-proxy-lib/src/lib/DTOs/BackendEvents/MaterialsReceiptsMaterialsAtLocationsReadListResults", ["require", "exports", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/CoreEvent"], function (require, exports, CoreEvent_31) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class MaterialsReceiptsMaterialsAtLocationsReadListResults extends CoreEvent_31.CoreEvent {
    }
    exports.MaterialsReceiptsMaterialsAtLocationsReadListResults = MaterialsReceiptsMaterialsAtLocationsReadListResults;
});
define("shared/libs/projects/event-proxy-lib/src/lib/DTOs/BackendEvents/MaterialsReceiptsMaterialsReadListQuery", ["require", "exports", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/CoreEvent", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/EventIds"], function (require, exports, CoreEvent_32, EventIds_17) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class MaterialsReceiptsMaterialsReadListQuery extends CoreEvent_32.CoreEvent {
        constructor(sourceInfo, MaterialsId, BarCode, Page, Limit) {
            super();
            this.MaterialsId = MaterialsId;
            this.BarCode = BarCode;
            this.Page = Page;
            this.Limit = Limit;
            if (Page <= 0 || Limit <= 0)
                throw new Error('Page or Limit cannot be 0 or below');
            this.SourceId = sourceInfo.SourceId;
            this.SourceName = sourceInfo.SourceName;
            this.EventId = EventIds_17.EventIds.MaterialsReceiptsMaterialsReadListQuery;
        }
    }
    exports.MaterialsReceiptsMaterialsReadListQuery = MaterialsReceiptsMaterialsReadListQuery;
});
define("shared/libs/projects/event-proxy-lib/src/lib/DTOs/BackendEvents/Adds/MaterialsData", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class MaterialsData {
    }
    exports.MaterialsData = MaterialsData;
});
define("shared/libs/projects/event-proxy-lib/src/lib/DTOs/BackendEvents/MaterialsReceiptsMaterialsReadListResults", ["require", "exports", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/CoreEvent"], function (require, exports, CoreEvent_33) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class MaterialsReceiptsMaterialsReadListResults extends CoreEvent_33.CoreEvent {
    }
    exports.MaterialsReceiptsMaterialsReadListResults = MaterialsReceiptsMaterialsReadListResults;
});
define("shared/libs/projects/event-proxy-lib/src/lib/DTOs/BackendEvents/CastorCreateAndOthers", ["require", "exports", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/CoreEvent"], function (require, exports, CoreEvent_34) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CastorCreateAndOthersType;
    (function (CastorCreateAndOthersType) {
        CastorCreateAndOthersType[CastorCreateAndOthersType["Create"] = 2053] = "Create";
        CastorCreateAndOthersType[CastorCreateAndOthersType["Delete"] = 2054] = "Delete";
        CastorCreateAndOthersType[CastorCreateAndOthersType["Get"] = 2055] = "Get";
    })(CastorCreateAndOthersType = exports.CastorCreateAndOthersType || (exports.CastorCreateAndOthersType = {}));
    var CastTypes;
    (function (CastTypes) {
        CastTypes["OneToOne"] = "OneToOne";
    })(CastTypes = exports.CastTypes || (exports.CastTypes = {}));
    class CastorCreateAndOthers extends CoreEvent_34.CoreEvent {
        constructor(sourceInfo, eventType, FirstType, FirstId, SecondType, SecondIds, CastType = CastTypes.OneToOne) {
            super();
            this.FirstType = FirstType;
            this.FirstId = FirstId;
            this.SecondType = SecondType;
            this.SecondIds = SecondIds;
            this.CastType = CastType;
            this.SourceId = sourceInfo.SourceId;
            this.SourceName = sourceInfo.SourceName;
            this.EventId = eventType;
        }
    }
    exports.CastorCreateAndOthers = CastorCreateAndOthers;
});
define("shared/libs/projects/event-proxy-lib/src/lib/DTOs/BackendEvents/Adds/WunderMobilityProduct", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class WunderMobilityProduct {
    }
    exports.WunderMobilityProduct = WunderMobilityProduct;
});
define("shared/libs/projects/event-proxy-lib/src/lib/DTOs/BackendEvents/Adds/WunderMobilityScannedProduct", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("shared/libs/projects/event-proxy-lib/src/lib/DTOs/BackendEvents/WunderMobilityProductCreate", ["require", "exports", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/CoreEvent", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/EventIds"], function (require, exports, CoreEvent_35, EventIds_18) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class WunderMobilityProductCreate extends CoreEvent_35.CoreEvent {
        constructor(sourceInfo, data) {
            super();
            this.SourceId = sourceInfo.SourceId;
            this.SourceName = sourceInfo.SourceName;
            this.EventId = EventIds_18.EventIds.TestWunderMobilityCreate;
            this.ProductCode = data.ProductCode;
            this.Name = data.Name;
            this.Price = data.Price;
            this.PromotionalQuantity = data.PromotionalQuantity;
            this.PromotionalPrice = data.PromotionalPrice;
        }
    }
    exports.WunderMobilityProductCreate = WunderMobilityProductCreate;
});
define("shared/libs/projects/event-proxy-lib/src/lib/DTOs/BackendEvents/WunderMobilityProductDelete", ["require", "exports", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/CoreEvent", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/EventIds"], function (require, exports, CoreEvent_36, EventIds_19) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class WunderMobilityProductDelete extends CoreEvent_36.CoreEvent {
        constructor(sourceInfo, Ids) {
            super();
            this.Ids = Ids;
            this.SourceId = sourceInfo.SourceId;
            this.SourceName = sourceInfo.SourceName;
            this.EventId = EventIds_19.EventIds.TestWunderMobilityDelete;
        }
    }
    exports.WunderMobilityProductDelete = WunderMobilityProductDelete;
});
define("shared/libs/projects/event-proxy-lib/src/lib/DTOs/BackendEvents/WunderMobilityProductQuery", ["require", "exports", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/CoreEvent", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/EventIds"], function (require, exports, CoreEvent_37, EventIds_20) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class WunderMobilityProductQuery extends CoreEvent_37.CoreEvent {
        constructor(sourceInfo, ProductCodeList) {
            super();
            this.ProductCodeList = ProductCodeList;
            this.SourceId = sourceInfo.SourceId;
            this.SourceName = sourceInfo.SourceName;
            this.EventId = EventIds_20.EventIds.TestWunderMobilityProductsQuery;
        }
    }
    exports.WunderMobilityProductQuery = WunderMobilityProductQuery;
});
define("shared/libs/projects/event-proxy-lib/src/lib/DTOs/BackendEvents/WunderMobilityProductQueryResults", ["require", "exports", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/CoreEvent"], function (require, exports, CoreEvent_38) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class WunderMobilityProductQueryResults extends CoreEvent_38.CoreEvent {
    }
    exports.WunderMobilityProductQueryResults = WunderMobilityProductQueryResults;
});
define("shared/libs/projects/event-proxy-lib/src/lib/DTOs/BackendEvents/WunderMobilityDoCheckoutResults", ["require", "exports", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/CoreEvent"], function (require, exports, CoreEvent_39) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class WunderMobilityDoCheckoutResults extends CoreEvent_39.CoreEvent {
    }
    exports.WunderMobilityDoCheckoutResults = WunderMobilityDoCheckoutResults;
});
define("shared/libs/projects/event-proxy-lib/src/lib/DTOs/BackendEvents/WunderMobilityDoCheckout", ["require", "exports", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/CoreEvent", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/EventIds"], function (require, exports, CoreEvent_40, EventIds_21) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class WunderMobilityDoCheckout extends CoreEvent_40.CoreEvent {
        constructor(sourceInfo, ProductCodeList) {
            super();
            this.ProductCodeList = ProductCodeList;
            this.SourceId = sourceInfo.SourceId;
            this.SourceName = sourceInfo.SourceName;
            this.EventId = EventIds_21.EventIds.TestWunderMobilityCheckout;
        }
    }
    exports.WunderMobilityDoCheckout = WunderMobilityDoCheckout;
});
define("shared/libs/projects/event-proxy-lib/src/lib/DTOs/index", ["require", "exports", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/CoreEvent", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/EnvironmentTypes", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/Errors", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/EventIds", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/MicroFrontendInfo", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/MicroFrontendParts", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/ValidationStatus", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/BackendEvents/BackendToFrontendEvent", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/BackendEvents/LoginSuccess", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/BackendEvents/SubscibeToEvent", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/BackendEvents/UnsubscibeToEvent", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/BackendEvents/LoginRequest", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/FrontendEvents/index", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/BackendEvents/Adds/PersonData", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/BackendEvents/CreateUpdatePersonData", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/BackendEvents/PersonDataRead", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/BackendEvents/ReadPersonDataQuery", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/BackendEvents/RemoveEnterpisePersonData", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/BackendEvents/Adds/OccupationData", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/BackendEvents/OccupationsCreateUpdate", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/BackendEvents/OccupationsDeleteEvent", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/BackendEvents/OccupationsReadResults", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/BackendEvents/OccupationsReadQuery", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/BackendEvents/ObserverSnapshotQuery", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/BackendEvents/ObserverSnapshotResult", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/BackendEvents/Adds/ObserverEventNode", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/BackendEvents/Adds/ObserverEventDataForTracing", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/BackendEvents/MaterialsReceiptsReadListQuery", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/BackendEvents/MaterialsReceiptsReadListResults", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/BackendEvents/MaterialsReceiptsTablePartReadListQuery", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/BackendEvents/MaterialsReceiptsTablePartReadListResults", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/BackendEvents/Adds/MaterialsListTablePart", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/BackendEvents/MaterialsReceiptsScanTableAddRemove", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/BackendEvents/MaterialsReceiptsScanTableReadListQuery", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/BackendEvents/MaterialsReceiptsScanTableReadListResults", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/BackendEvents/Adds/ScanTableData", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/BackendEvents/MaterialsReceiptsLocationsReadListResults", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/BackendEvents/MaterialsReceiptsLocationsReadListQuery", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/BackendEvents/MaterialsReceiptsLocationsAddRemove", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/BackendEvents/Adds/LocationsData", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/BackendEvents/Adds/MaterialsAtLocationsData", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/BackendEvents/MaterialsReceiptsMaterialsAtLocationsReadListQuery", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/BackendEvents/MaterialsReceiptsMaterialsAtLocationsAddRemove", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/BackendEvents/MaterialsReceiptsMaterialsAtLocationsReadListResults", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/BackendEvents/MaterialsReceiptsMaterialsReadListQuery", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/BackendEvents/MaterialsReceiptsMaterialsReadListResults", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/BackendEvents/Adds/MaterialsData", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/BackendEvents/Adds/MaterialsList", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/BackendEvents/CastorCreateAndOthers", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/BackendEvents/Adds/WunderMobilityProduct", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/BackendEvents/WunderMobilityProductCreate", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/BackendEvents/WunderMobilityProductDelete", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/BackendEvents/WunderMobilityProductQuery", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/BackendEvents/WunderMobilityProductQueryResults", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/BackendEvents/WunderMobilityDoCheckoutResults", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/BackendEvents/WunderMobilityDoCheckout"], function (require, exports, CoreEvent_41, EnvironmentTypes_1, Errors_1, EventIds_22, MicroFrontendInfo_1, MicroFrontendParts_1, ValidationStatus_1, BackendToFrontendEvent_1, LoginSuccess_1, SubscibeToEvent_1, UnsubscibeToEvent_1, LoginRequest_1, FrontendEvents_1, PersonData_1, CreateUpdatePersonData_1, PersonDataRead_1, ReadPersonDataQuery_1, RemoveEnterpisePersonData_1, OccupationData_1, OccupationsCreateUpdate_1, OccupationsDeleteEvent_1, OccupationsReadResults_1, OccupationsReadQuery_1, ObserverSnapshotQuery_1, ObserverSnapshotResult_1, ObserverEventNode_1, ObserverEventDataForTracing_1, MaterialsReceiptsReadListQuery_1, MaterialsReceiptsReadListResults_1, MaterialsReceiptsTablePartReadListQuery_1, MaterialsReceiptsTablePartReadListResults_1, MaterialsListTablePart_1, MaterialsReceiptsScanTableAddRemove_1, MaterialsReceiptsScanTableReadListQuery_1, MaterialsReceiptsScanTableReadListResults_1, ScanTableData_1, MaterialsReceiptsLocationsReadListResults_1, MaterialsReceiptsLocationsReadListQuery_1, MaterialsReceiptsLocationsAddRemove_1, LocationsData_1, MaterialsAtLocationsData_1, MaterialsReceiptsMaterialsAtLocationsReadListQuery_1, MaterialsReceiptsMaterialsAtLocationsAddRemove_1, MaterialsReceiptsMaterialsAtLocationsReadListResults_1, MaterialsReceiptsMaterialsReadListQuery_1, MaterialsReceiptsMaterialsReadListResults_1, MaterialsData_1, MaterialsList_1, CastorCreateAndOthers_1, WunderMobilityProduct_1, WunderMobilityProductCreate_1, WunderMobilityProductDelete_1, WunderMobilityProductQuery_1, WunderMobilityProductQueryResults_1, WunderMobilityDoCheckoutResults_1, WunderMobilityDoCheckout_1) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    __export(CoreEvent_41);
    __export(EnvironmentTypes_1);
    __export(Errors_1);
    __export(EventIds_22);
    __export(MicroFrontendInfo_1);
    __export(MicroFrontendParts_1);
    __export(ValidationStatus_1);
    __export(BackendToFrontendEvent_1);
    __export(LoginSuccess_1);
    __export(SubscibeToEvent_1);
    __export(UnsubscibeToEvent_1);
    __export(LoginRequest_1);
    __export(FrontendEvents_1);
    __export(PersonData_1);
    __export(CreateUpdatePersonData_1);
    __export(PersonDataRead_1);
    __export(ReadPersonDataQuery_1);
    __export(RemoveEnterpisePersonData_1);
    __export(OccupationData_1);
    __export(OccupationsCreateUpdate_1);
    __export(OccupationsDeleteEvent_1);
    __export(OccupationsReadResults_1);
    __export(OccupationsReadQuery_1);
    __export(ObserverSnapshotQuery_1);
    __export(ObserverSnapshotResult_1);
    __export(ObserverEventNode_1);
    __export(ObserverEventDataForTracing_1);
    __export(MaterialsReceiptsReadListQuery_1);
    __export(MaterialsReceiptsReadListResults_1);
    __export(MaterialsReceiptsTablePartReadListQuery_1);
    __export(MaterialsReceiptsTablePartReadListResults_1);
    __export(MaterialsListTablePart_1);
    __export(MaterialsReceiptsScanTableAddRemove_1);
    __export(MaterialsReceiptsScanTableReadListQuery_1);
    __export(MaterialsReceiptsScanTableReadListResults_1);
    __export(ScanTableData_1);
    __export(MaterialsReceiptsLocationsReadListResults_1);
    __export(MaterialsReceiptsLocationsReadListQuery_1);
    __export(MaterialsReceiptsLocationsAddRemove_1);
    __export(LocationsData_1);
    __export(MaterialsAtLocationsData_1);
    __export(MaterialsReceiptsMaterialsAtLocationsReadListQuery_1);
    __export(MaterialsReceiptsMaterialsAtLocationsAddRemove_1);
    __export(MaterialsReceiptsMaterialsAtLocationsReadListResults_1);
    __export(MaterialsReceiptsMaterialsReadListQuery_1);
    __export(MaterialsReceiptsMaterialsReadListResults_1);
    __export(MaterialsData_1);
    __export(MaterialsList_1);
    __export(CastorCreateAndOthers_1);
    __export(WunderMobilityProduct_1);
    __export(WunderMobilityProductCreate_1);
    __export(WunderMobilityProductDelete_1);
    __export(WunderMobilityProductQuery_1);
    __export(WunderMobilityProductQueryResults_1);
    __export(WunderMobilityDoCheckoutResults_1);
    __export(WunderMobilityDoCheckout_1);
});
define("shared/libs/projects/event-proxy-lib/src/lib/services/EnvironmentService", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class EnvironmentService {
        constructor() {
            this.envPrefix = '__env';
        }
        get ConfigUrlList() {
            return window[this.envPrefix]['microfrontendConfigPathList'];
        }
        set ConfigUrlList(value) {
            window[this.envPrefix]['microfrontendConfigPathList'] = value;
        }
        Get() {
            return window[this.envPrefix];
        }
        get MicroFrontendConfigPathList() {
            return window[this.envPrefix]['microfrontendConfigPathList'];
        }
        set MicroFrontendConfigPathList(value) {
            window[this.envPrefix]['microfrontendConfigPathList'] = value;
        }
        get OneLangauge() {
            return window[this.envPrefix]['oneLanguage'];
        }
        set OneLanguage(value) {
            window[this.envPrefix]['oneLanguage'] = value;
        }
        get Url() {
            return window[this.envPrefix]['url'];
        }
        set Url(value) {
            window[this.envPrefix]['url'] = value;
        }
        get APIGatewayUrl() {
            return window[this.envPrefix]['apiGatewayUrl'];
        }
        set APIGatewayUrl(value) {
            window[this.envPrefix]['apiGatewayUrl'] = value;
        }
        get APIGatewayPort() {
            return window[this.envPrefix]['apiGatewayPort'];
        }
        set APIGatewayPort(value) {
            window[this.envPrefix]['apiGatewayPort'] = value;
        }
        get Language() {
            return window[this.envPrefix]['lang'];
        }
        set Language(value) {
            window[this.envPrefix]['lang'] = value;
        }
        get AuthorizationToken() {
            return window[this.envPrefix]['authToken'];
        }
        set AuthorizationToken(value) {
            window[this.envPrefix]['authToken'] = value;
        }
        get TokenBeginDate() {
            return window[this.envPrefix]['tokenBeginDate'];
        }
        set TokenBeginDate(value) {
            window[this.envPrefix]['tokenBeginDate'] = value;
        }
        get TokenExpirationDate() {
            return window[this.envPrefix]['tokenExpirationDate'];
        }
        set TokenExpirationDate(value) {
            window[this.envPrefix]['tokenExpirationDate'] = value;
        }
        get UFList() {
            return window[this.envPrefix]['uf'];
        }
    }
    exports.EnvironmentService = EnvironmentService;
});
define("shared/libs/projects/event-proxy-lib/src/lib/retry/RetryWithBackoff", ["require", "exports", "rxjs", "rxjs/operators"], function (require, exports, rxjs_1, operators_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.errorMsg = (maxRetry) => `Failed to connect after ${maxRetry} try(ies).`;
    const MAX_RETRIES = 3;
    const BACKOFFMS = 1000;
    function RetryWithBackoff(delayMs, maxRetry = MAX_RETRIES, backoffMS = BACKOFFMS) {
        let retries = maxRetry;
        return (src) => src.pipe(operators_1.retryWhen((errors) => errors.pipe(operators_1.mergeMap(error => {
            if (retries-- > 0) {
                const backoffTime = delayMs + (maxRetry - retries) * backoffMS;
                console.log("backing off " + retries + " " + backoffTime);
                return rxjs_1.of(error).pipe(operators_1.delay(backoffTime));
            }
            return rxjs_1.throwError(exports.errorMsg(maxRetry));
        }))));
    }
    exports.RetryWithBackoff = RetryWithBackoff;
});
define("shared/libs/projects/event-proxy-lib/src/lib/EventProxyLibService", ["require", "exports", "@angular/core", "@angular/common/http", "rxjs/operators", "rxjs", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/index", "shared/libs/projects/event-proxy-lib/src/lib/retry/RetryWithBackoff"], function (require, exports, core_1, http_1, operators_2, rxjs_2, index_1, RetryWithBackoff_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let EventProxyLibService = class EventProxyLibService {
        constructor(environmentService, httpClient) {
            this.environmentService = environmentService;
            this.httpClient = httpClient;
            this.Status = false;
            this.RequestTimeoutMS = 5000;
            this.TimeoutMs = 6000;
            this.DelayMs = 1000;
            this.Retries = 10;
            this.BackOffMS = 1000;
            this.endpoint = '/newEvents';
            this.jsonHeaders = new http_1.HttpHeaders({ 'Content-Type': 'application/json' });
            this.sourceID = '';
            this.ApiGatewayURL = `${this.environmentService.APIGatewayUrl}:${this.environmentService.APIGatewayPort}`;
        }
        RacePromiseAsync(promise, timeoutMS = this.RequestTimeoutMS) {
            return __awaiter(this, void 0, void 0, function* () {
                const responseStatus = new index_1.ValidationStatus();
                const timeout = new Promise((_, reject) => {
                    const id = setTimeout(() => {
                        clearTimeout(id);
                        reject("Timeout in " + timeoutMS);
                    }, timeoutMS);
                });
                const raceResult = Promise.race([promise, timeout]);
                yield raceResult
                    .then((resolve) => responseStatus.Result = resolve)
                    .catch((reject) => responseStatus.ErrorList.push(reject));
                return responseStatus;
            });
        }
        InitializeConnectionToBackend(sourceId) {
            if (!sourceId) {
                throw new Error('SourceID was not provided in StartListeningToBackend');
            }
            this.sourceID = sourceId;
            this.Status = true;
            console.log(`${this.sourceID} starts listening to events on ${this.ApiGatewayURL}`);
            return new rxjs_2.Observable(sub => {
                this.push(sub);
            });
        }
        PerformResponseCheck(responseStatus) {
            if (!responseStatus.Result) {
                return false;
            }
            if (!Object.prototype.hasOwnProperty.call(responseStatus.Result, 'EventId')) {
                this.EndListeningToBackend();
                throw new Error(index_1.ErrorMessage.NoEventId);
            }
            switch (+responseStatus.Result['EventId']) {
                case index_1.EventIds.GetNewEvents:
                    return true;
                case index_1.EventIds.TokenFailure:
                    this.EndListeningToBackend();
                    throw new Error(index_1.ErrorMessage.TokenFailure);
                default:
                    this.EndListeningToBackend();
                    console.error(responseStatus);
                    throw new Error(index_1.ErrorMessage.UnrecognizedEventId);
            }
        }
        EndListeningToBackend() {
            if (!this.Status) {
                console.log(`${this.sourceID} Trying to end, but already ended.`);
                return;
            }
            this.Status = false;
            console.log(`${this.sourceID} Ending listening.`);
        }
        ConfirmEventsAsync(srcId, idList, confirmAll = false) {
            const body = {
                EventId: index_1.EventIds.FrontEndEventReceived,
                SourceId: srcId,
                Ids: idList,
                MarkAllReceived: confirmAll,
            };
            return this.sendMessageAsync('ConfirmEventsAsync', body);
        }
        DispatchEventAsync(event) {
            const eventList = [].concat(event);
            const body = {
                EventId: index_1.EventIds.RegisterNewEvent,
                Events: eventList
            };
            return this.sendMessageAsync('DispatchEventAsync', body);
        }
        GetLastEventsAsync(sourceId) {
            const body = {
                EventId: index_1.EventIds.GetNewEvents,
                SourceId: sourceId,
            };
            return this.sendMessageAsync('GetLastEventsAsync', body);
        }
        LogInAsync(timestamp, signature) {
            return __awaiter(this, void 0, void 0, function* () {
                const body = {
                    EventId: index_1.EventIds.LoginRequested,
                    LoginTimestamp: timestamp,
                    LoginSignature: signature
                };
                return this.sendMessageAsync('LogInAsync', body, true);
            });
        }
        RenewTokenAsync() {
            const body = {
                EventId: index_1.EventIds.RenewToken
            };
            return this.sendMessageAsync('RenewTokenAsync', body);
        }
        sendMessageAsync(caller, body, anonymous = false) {
            return __awaiter(this, void 0, void 0, function* () {
                const result = new index_1.ValidationStatus();
                if (!this.ApiGatewayURL) {
                    throw Error('ApiGateway URL is undefined');
                }
                const headers = this.jsonHeaders;
                const url = this.ApiGatewayURL + this.endpoint;
                if (!anonymous) {
                    body['Token'] = this.environmentService.AuthorizationToken;
                }
                const sourceName = index_1.MicroFrontendParts.GetSourceNameFromSourceID(this.sourceID);
                console.log(`
    ${caller}, source: id: ${this.sourceID} name: ${sourceName} sends to ${url} body: ${JSON.stringify(body)}`);
                return yield new rxjs_2.Observable((res) => {
                    this.httpClient
                        .post(url, body, { headers, observe: 'response' })
                        .pipe(operators_2.timeout(this.TimeoutMs), RetryWithBackoff_1.RetryWithBackoff(this.DelayMs, this.Retries, this.BackOffMS), operators_2.catchError(error => {
                        result.ErrorList.push(error);
                        return rxjs_2.of(error);
                    }))
                        .toPromise().then((httpRespone) => {
                        if (result.HasErrors()) {
                            res.error(result);
                        }
                        else {
                            result.Result = httpRespone.body;
                            res.next(result);
                            res.complete();
                        }
                    });
                }).toPromise();
            });
        }
        push(sub) {
            if (!this.Status) {
                sub.complete();
                return;
            }
            this.GetLastEventsAsync(this.sourceID).then((resolve) => {
                sub.next(resolve);
                this.push(sub);
            }, (reject) => {
                sub.error(reject);
            });
        }
    };
    EventProxyLibService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], EventProxyLibService);
    exports.EventProxyLibService = EventProxyLibService;
});
define("shared/libs/projects/event-proxy-lib/src/lib/EventProxyLibModule", ["require", "exports", "@angular/core", "@angular/common", "@angular/common/http", "shared/libs/projects/event-proxy-lib/src/lib/services/EnvironmentService", "shared/libs/projects/event-proxy-lib/src/lib/EventProxyLibService"], function (require, exports, core_2, common_1, http_2, EnvironmentService_1, EventProxyLibService_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let EventProxyLibModule = class EventProxyLibModule {
    };
    EventProxyLibModule = __decorate([
        core_2.NgModule({
            providers: [
                EnvironmentService_1.EnvironmentService,
                EventProxyLibService_1.EventProxyLibService
            ],
            imports: [
                common_1.CommonModule,
                http_2.HttpClientModule,
            ]
        })
    ], EventProxyLibModule);
    exports.EventProxyLibModule = EventProxyLibModule;
});
define("shared/libs/projects/event-proxy-lib/src/public-api", ["require", "exports", "shared/libs/projects/event-proxy-lib/src/lib/DTOs/index", "shared/libs/projects/event-proxy-lib/src/lib/services/EnvironmentService", "shared/libs/projects/event-proxy-lib/src/lib/EventProxyLibService", "shared/libs/projects/event-proxy-lib/src/lib/EventProxyLibModule"], function (require, exports, index_2, EnvironmentService_2, EventProxyLibService_2, EventProxyLibModule_1) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    __export(index_2);
    __export(EnvironmentService_2);
    __export(EventProxyLibService_2);
    __export(EventProxyLibModule_1);
});
define("observer-uf/src/config/config", ["require", "exports", "shared/libs/projects/event-proxy-lib/src/public-api"], function (require, exports, event_proxy_lib_src_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const srcId = event_proxy_lib_src_1.MicroFrontendParts.Observer.SourceId;
    const port = '3006';
    window['__env'] = window['__env'] || {};
    window['__env']['uf'] = window['__env']['uf'] || {};
    window['__env']['uf'][srcId] = window['__env']['uf'][srcId] || {};
    const domain = window['__env']['url'] || 'http://127.0.0.1';
    const url = `${domain}:${port}/`;
    const uf = {};
    uf[srcId] = new event_proxy_lib_src_1.MicroFrontendData();
    uf[srcId].events.push(event_proxy_lib_src_1.EventIds.ObserverButtonPressed);
    const scriptList = ['runtime.js', 'polyfills.js', 'main.js', 'styles.js'];
    for (const script of scriptList) {
        const temp = new event_proxy_lib_src_1.ResourceSheme();
        temp.Element = 'script';
        temp.setAttribute('src', `${url}${script}`);
        temp.setAttribute('type', 'module');
        uf[srcId].resources.push(temp);
    }
    window['__env']['uf'][srcId] = uf[srcId];
});
