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
            this.SourceId = '';
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
        uEventsIds[uEventsIds["PerssonelButtonPressed"] = 1001] = "PerssonelButtonPressed";
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
        uEventsIds[uEventsIds["CreateUpdatePersonData"] = 2006] = "CreateUpdatePersonData";
        uEventsIds[uEventsIds["RegisterNewEvent"] = 2007] = "RegisterNewEvent";
        uEventsIds[uEventsIds["GetNewEvents"] = 2008] = "GetNewEvents";
        uEventsIds[uEventsIds["RegisterEventIds"] = 2009] = "RegisterEventIds";
        uEventsIds[uEventsIds["RemovePersonData"] = 2010] = "RemovePersonData";
        uEventsIds[uEventsIds["ReadPersonDataQuery"] = 2011] = "ReadPersonDataQuery";
        uEventsIds[uEventsIds["FrontEndEventReceived"] = 2012] = "FrontEndEventReceived";
        uEventsIds[uEventsIds["ReadPersonData"] = 2013] = "ReadPersonData";
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
define("shared/events/helpers/UFData", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class UFData {
        constructor() {
            this.events = [];
            this.resources = [];
        }
    }
    exports.UFData = UFData;
});
define("observer-uf/src/config/config", ["require", "exports", "shared/models/UParts", "shared/models/event", "shared/events/helpers/ResourceSheme", "shared/events/helpers/UFData"], function (require, exports, UParts_1, event_1, ResourceSheme_1, UFData_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const srcId = UParts_1.UParts.Observer.SourceId;
    const port = '3006';
    const domain = window['__env']['url'] || 'http://127.0.0.1';
    const url = `${domain}:${port}/`;
    window['__env'] = window['__env'] || {};
    window['__env']['uf'] = window['__env']['uf'] || {};
    window['__env']['uf'][srcId] = window['__env']['uf'][srcId] || {};
    const uf = {};
    uf[srcId] = new UFData_1.UFData();
    uf[srcId].events.push(event_1.uEventsIds.ObserverButtonPressed);
    const scriptList = ['runtime.js', 'polyfills.js', 'main.js', 'styles.js'];
    for (const script of scriptList) {
        const temp = new ResourceSheme_1.ResourceSheme();
        temp.Element = 'script';
        temp.setAttribute('src', `${url}${script}`);
        temp.setAttribute('type', 'module');
        uf[srcId].resources.push(temp);
    }
    window['__env']['uf'][srcId] = uf[srcId];
});
