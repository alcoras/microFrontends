define("shared/models/UParts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class UParts {
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
    exports.UParts = UParts;
    UParts.FrontendShell = {
        SourceId: '1000',
        SourceName: 'FrontendShell'
    };
    UParts.Menu = {
        SourceId: '1001',
        SourceName: 'Menu'
    };
    UParts.Personnel = {
        SourceId: '1002',
        SourceName: 'Personnel'
    };
    UParts.Occupations = {
        SourceId: '1005',
        SourceName: 'Occupations'
    };
    UParts.UFManager = {
        SourceId: '1006',
        SourceName: 'UFManager'
    };
    UParts.Observer = {
        SourceId: '1007',
        SourceName: 'Observer'
    };
});
define("shared/models/event", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class uEvent {
        constructor() {
            this.EventId = 1;
            this.SourceEventUniqueId = 0;
            this.SourceId = 'undefined';
            this.AggregateId = 0;
            this.SourceName = '';
            this.EventLevel = 0;
            this.UserID = 0;
            this.ParentID = 0;
            this.ProtocolVersion = '';
            this.Comment = '';
        }
    }
    exports.uEvent = uEvent;
    var uEventsIds;
    (function (uEventsIds) {
        uEventsIds[uEventsIds["InitEvent"] = 1000] = "InitEvent";
        uEventsIds[uEventsIds["PersonnelButtonPressed"] = 1001] = "PersonnelButtonPressed";
        uEventsIds[uEventsIds["InitMenu"] = 1002] = "InitMenu";
        uEventsIds[uEventsIds["RequestToLoadScript"] = 1003] = "RequestToLoadScript";
        uEventsIds[uEventsIds["LoadedResource"] = 1004] = "LoadedResource";
        uEventsIds[uEventsIds["OccupationNg9ButtonPressed"] = 1005] = "OccupationNg9ButtonPressed";
        uEventsIds[uEventsIds["LanguageChange"] = 1006] = "LanguageChange";
        uEventsIds[uEventsIds["ObserverButtonPressed"] = 1007] = "ObserverButtonPressed";
        uEventsIds[uEventsIds["PingRequest"] = 2001] = "PingRequest";
        uEventsIds[uEventsIds["SubscribeToEvent"] = 2002] = "SubscribeToEvent";
        uEventsIds[uEventsIds["EventProccessedSuccessfully"] = 2003] = "EventProccessedSuccessfully";
        uEventsIds[uEventsIds["EventProccessedWithFails"] = 2004] = "EventProccessedWithFails";
        uEventsIds[uEventsIds["EventReceived"] = 2005] = "EventReceived";
        uEventsIds[uEventsIds["CreatePersonData"] = 2006] = "CreatePersonData";
        uEventsIds[uEventsIds["RegisterNewEvent"] = 2007] = "RegisterNewEvent";
        uEventsIds[uEventsIds["GetNewEvents"] = 2008] = "GetNewEvents";
        uEventsIds[uEventsIds["RegisterEventIds"] = 2009] = "RegisterEventIds";
        uEventsIds[uEventsIds["RemovePersonData"] = 2010] = "RemovePersonData";
        uEventsIds[uEventsIds["ReadPersonDataQuery"] = 2011] = "ReadPersonDataQuery";
        uEventsIds[uEventsIds["FrontEndEventReceived"] = 2012] = "FrontEndEventReceived";
        uEventsIds[uEventsIds["ReadPersonData"] = 2013] = "ReadPersonData";
        uEventsIds[uEventsIds["UpdatePersonData"] = 2014] = "UpdatePersonData";
        uEventsIds[uEventsIds["OccupationsCreate"] = 2015] = "OccupationsCreate";
        uEventsIds[uEventsIds["OccupationsUpdate"] = 2016] = "OccupationsUpdate";
        uEventsIds[uEventsIds["OccupationsDelete"] = 2017] = "OccupationsDelete";
        uEventsIds[uEventsIds["OccupationsReadQuery"] = 2018] = "OccupationsReadQuery";
        uEventsIds[uEventsIds["OccupationsRead"] = 2019] = "OccupationsRead";
        uEventsIds[uEventsIds["ReadPersonDataOnDateQuery"] = 2020] = "ReadPersonDataOnDateQuery";
        uEventsIds[uEventsIds["LoginRequested"] = 2021] = "LoginRequested";
        uEventsIds[uEventsIds["LoginFailed"] = 2022] = "LoginFailed";
        uEventsIds[uEventsIds["LoginSuccess"] = 2023] = "LoginSuccess";
    })(uEventsIds = exports.uEventsIds || (exports.uEventsIds = {}));
});
define("shared/events/helpers/ResourceSheme", ["require", "exports"], function (require, exports) {
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
define("shared/events/RequestToLoadScript", ["require", "exports", "shared/models/event"], function (require, exports, event_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class RequestToLoadScripts extends event_1.uEvent {
        constructor(RequestEventId, ResourceSchemes) {
            super();
            this.RequestEventId = RequestEventId;
            this.ResourceSchemes = ResourceSchemes;
            this.EventId = event_1.uEventsIds.RequestToLoadScript;
        }
    }
    exports.RequestToLoadScripts = RequestToLoadScripts;
});
define("shared/events/LoadedResource", ["require", "exports", "shared/models/event"], function (require, exports, event_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class LoadedResource extends event_2.uEvent {
        constructor(ResourceEventId, ResourceScheme) {
            super();
            this.ResourceEventId = ResourceEventId;
            this.ResourceScheme = ResourceScheme;
            this.EventId = event_2.uEventsIds.LoadedResource;
        }
    }
    exports.LoadedResource = LoadedResource;
});
define("shared/events/helpers/ButtonIds", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ButtonIds;
    (function (ButtonIds) {
        ButtonIds[ButtonIds["PersonnelButtonPressed"] = 1001] = "PersonnelButtonPressed";
        ButtonIds[ButtonIds["OccupationNg9ButtonPressed"] = 1005] = "OccupationNg9ButtonPressed";
        ButtonIds[ButtonIds["ObserverButtonPressed"] = 1007] = "ObserverButtonPressed";
    })(ButtonIds = exports.ButtonIds || (exports.ButtonIds = {}));
});
define("shared/events/EventButtonPressed", ["require", "exports", "shared/models/event", "shared/events/helpers/ButtonIds"], function (require, exports, event_3, ButtonIds_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class EventButtonPressed extends event_3.uEvent {
        constructor(buttonPressedEventId, UniqueElementId) {
            super();
            this.UniqueElementId = UniqueElementId;
            if (Object.values(ButtonIds_1.ButtonIds).includes(buttonPressedEventId)) {
                this.EventId = buttonPressedEventId;
            }
            else {
                throw new Error('Provided ButtonPressed Id is unsupported.');
            }
        }
    }
    exports.EventButtonPressed = EventButtonPressed;
});
define("shared/events/LanguageChange", ["require", "exports", "shared/models/event"], function (require, exports, event_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class LanguageChange extends event_4.uEvent {
        constructor(NewLanguage) {
            super();
            this.NewLanguage = NewLanguage;
            this.EventId = event_4.uEventsIds.LanguageChange;
        }
    }
    exports.LanguageChange = LanguageChange;
});
define("shared/events/InitializeMenuEvent", ["require", "exports", "shared/models/event"], function (require, exports, event_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class InitializeMenuEvent extends event_5.uEvent {
        constructor(sourceId) {
            super();
            this.EventId = event_5.uEventsIds.InitMenu;
            this.SourceId = sourceId;
        }
    }
    exports.InitializeMenuEvent = InitializeMenuEvent;
});
define("shared/events/helpers/MicroFrontendData", ["require", "exports"], function (require, exports) {
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
define("shared/events/backend/SubscibeToEvent", ["require", "exports", "shared/models/event"], function (require, exports, event_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class SubscibeToEvent extends event_6.uEvent {
        constructor(SourceId, IdsTripleList, CleanSubscriptionList = false) {
            super();
            this.IdsTripleList = IdsTripleList;
            this.CleanSubscriptionList = CleanSubscriptionList;
            this.EventId = event_6.uEventsIds.SubscribeToEvent;
            this.SourceId = SourceId;
        }
    }
    exports.SubscibeToEvent = SubscibeToEvent;
});
define("shared/events/backend/LoginSuccess", ["require", "exports", "shared/models/event"], function (require, exports, event_7) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class LoginSuccess extends event_7.uEvent {
    }
    exports.LoginSuccess = LoginSuccess;
});
define("shared/events/backend/Personnel/ReadPersonDataQuery", ["require", "exports", "shared/models/event"], function (require, exports, event_8) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class ReadPersonDataQuery extends event_8.uEvent {
        constructor(sourceId, ListParametersNameForSorting, NumberPageOutput, NumberRecordsOnPage) {
            super();
            this.ListParametersNameForSorting = ListParametersNameForSorting;
            this.NumberPageOutput = NumberPageOutput;
            this.NumberRecordsOnPage = NumberRecordsOnPage;
            this.SourceId = sourceId;
            this.EventId = event_8.uEventsIds.ReadPersonDataQuery;
        }
    }
    exports.ReadPersonDataQuery = ReadPersonDataQuery;
});
define("shared/models/Interfaces/IPersonnel", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("shared/events/backend/Personnel/CreateUpdatePersonData", ["require", "exports", "shared/models/event"], function (require, exports, event_9) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PersonDataCreateUpdateFlag;
    (function (PersonDataCreateUpdateFlag) {
        PersonDataCreateUpdateFlag[PersonDataCreateUpdateFlag["Create"] = 2006] = "Create";
        PersonDataCreateUpdateFlag[PersonDataCreateUpdateFlag["Update"] = 2014] = "Update";
    })(PersonDataCreateUpdateFlag = exports.PersonDataCreateUpdateFlag || (exports.PersonDataCreateUpdateFlag = {}));
    class CreateUpdatePersonData extends event_9.uEvent {
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
define("shared/events/backend/Personnel/RemoveEnterpisePersonData", ["require", "exports", "shared/models/event"], function (require, exports, event_10) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class RemoveEnterpisePersonData extends event_10.uEvent {
        constructor(sourceId, PersonDataID) {
            super();
            this.PersonDataID = PersonDataID;
            this.SourceId = sourceId;
            this.EventId = event_10.uEventsIds.RemovePersonData;
        }
    }
    exports.RemoveEnterpisePersonData = RemoveEnterpisePersonData;
});
define("shared/models/Adds/OccupationData", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class OccupationData {
    }
    exports.OccupationData = OccupationData;
});
define("shared/events/backend/Occupations/OccupationsCreateUpdate", ["require", "exports", "shared/models/event"], function (require, exports, event_11) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var OccupationCreateUpdateFlag;
    (function (OccupationCreateUpdateFlag) {
        OccupationCreateUpdateFlag[OccupationCreateUpdateFlag["Create"] = 2015] = "Create";
        OccupationCreateUpdateFlag[OccupationCreateUpdateFlag["Update"] = 2016] = "Update";
    })(OccupationCreateUpdateFlag = exports.OccupationCreateUpdateFlag || (exports.OccupationCreateUpdateFlag = {}));
    class OccupationsCreateUpdate extends event_11.uEvent {
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
define("shared/events/backend/Occupations/OccupationsReadQuery", ["require", "exports", "shared/models/event"], function (require, exports, event_12) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class OccupationsReadQuery extends event_12.uEvent {
        constructor(sourceId, DateTimeValue, Page, Limit) {
            super();
            this.DateTimeValue = DateTimeValue;
            this.Page = Page;
            this.Limit = Limit;
            if (Page <= 0 || Limit <= 0)
                throw new Error('Page or Limit cannot be 0 or below');
            this.SourceId = sourceId;
            this.EventId = event_12.uEventsIds.OccupationsReadQuery;
        }
    }
    exports.OccupationsReadQuery = OccupationsReadQuery;
});
define("shared/events/backend/Occupations/OccupationsReadResults", ["require", "exports", "shared/models/event"], function (require, exports, event_13) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class OccupationsReadResults extends event_13.uEvent {
    }
    exports.OccupationsReadResults = OccupationsReadResults;
});
define("shared/events/backend/Occupations/OccupationsDeleteEvent", ["require", "exports", "shared/models/event"], function (require, exports, event_14) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class OccupationsDeleteEvent extends event_14.uEvent {
        constructor(sourceId, ObjectAggregateId) {
            super();
            this.ObjectAggregateId = ObjectAggregateId;
            this.SourceId = sourceId;
            this.EventId = event_14.uEventsIds.OccupationsDelete;
        }
    }
    exports.OccupationsDeleteEvent = OccupationsDeleteEvent;
});
define("shared/events/index", ["require", "exports", "shared/events/RequestToLoadScript", "shared/events/LoadedResource", "shared/events/EventButtonPressed", "shared/events/LanguageChange", "shared/events/InitializeMenuEvent", "shared/events/helpers/MicroFrontendData", "shared/events/helpers/ResourceSheme", "shared/events/backend/SubscibeToEvent", "shared/events/backend/LoginSuccess", "shared/events/backend/Personnel/ReadPersonDataQuery", "shared/events/backend/Personnel/CreateUpdatePersonData", "shared/events/backend/Personnel/RemoveEnterpisePersonData", "shared/events/backend/Occupations/OccupationsCreateUpdate", "shared/events/backend/Occupations/OccupationsReadQuery", "shared/events/backend/Occupations/OccupationsReadResults", "shared/events/backend/Occupations/OccupationsDeleteEvent"], function (require, exports, RequestToLoadScript_1, LoadedResource_1, EventButtonPressed_1, LanguageChange_1, InitializeMenuEvent_1, MicroFrontendData_1, ResourceSheme_1, SubscibeToEvent_1, LoginSuccess_1, ReadPersonDataQuery_1, CreateUpdatePersonData_1, RemoveEnterpisePersonData_1, OccupationsCreateUpdate_1, OccupationsReadQuery_1, OccupationsReadResults_1, OccupationsDeleteEvent_1) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    __export(RequestToLoadScript_1);
    __export(LoadedResource_1);
    __export(EventButtonPressed_1);
    __export(LanguageChange_1);
    __export(InitializeMenuEvent_1);
    __export(MicroFrontendData_1);
    __export(ResourceSheme_1);
    __export(SubscibeToEvent_1);
    __export(LoginSuccess_1);
    __export(ReadPersonDataQuery_1);
    __export(CreateUpdatePersonData_1);
    __export(RemoveEnterpisePersonData_1);
    __export(OccupationsCreateUpdate_1);
    __export(OccupationsReadQuery_1);
    __export(OccupationsReadResults_1);
    __export(OccupationsDeleteEvent_1);
});
define("menu-uf/src/config/config", ["require", "exports", "shared/models/UParts", "shared/models/event", "shared/events/helpers/ResourceSheme", "shared/events/index"], function (require, exports, UParts_1, event_15, ResourceSheme_2, _uf_shared_events_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const srcId = UParts_1.UParts.Menu.SourceId;
    const port = '3002';
    const domain = window['__env']['url'] || 'http://127.0.0.1';
    let url = `${domain}:${port}/`;
    if (!window['__env']['one_language'])
        url = url + window['__env']['lang'] + '/';
    window['__env'] = window['__env'] || {};
    window['__env']['uf'] = window['__env']['uf'] || {};
    window['__env']['uf'][srcId] = window['__env']['uf'][srcId] || {};
    const uf = {};
    uf[srcId] = new _uf_shared_events_1.MicroFrontendData();
    uf[srcId].events.push(event_15.uEventsIds.InitMenu);
    const scriptList = ['runtime.js', 'polyfills.js', 'main.js', 'styles.js'];
    for (const script of scriptList) {
        const temp = new ResourceSheme_2.ResourceSheme();
        temp.Element = 'script';
        temp.setAttribute('src', `${url}${script}`);
        temp.setAttribute('type', 'module');
        uf[srcId].resources.push(temp);
    }
    const temp = new ResourceSheme_2.ResourceSheme();
    temp.Element = 'link';
    temp.Attributes['rel'] = 'stylesheet';
    temp.Attributes['id'] = 'themeAsset';
    temp.Attributes['href'] = url + 'assets/deeppurple-amber.css';
    uf[srcId].resources.push(temp);
    window['__env']['uf'][srcId] = uf[srcId];
});
