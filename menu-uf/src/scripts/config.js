define("config", ["require", "exports", "@uf-shared-models/UParts", "@uf-shared-models/event", "@uf-shared-events/helpers/ResourceSheme", "@uf-shared-events/"], function (require, exports, UParts_1, event_1, ResourceSheme_1, _uf_shared_events_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const srcId = UParts_1.UParts.Menu.SourceId;
    const port = "3002";
    const domain = window["__env"]["url"] || "http://127.0.0.1";
    let url = `${domain}:${port}/`;
    if (!window["__env"]["one_language"])
        url = url + window["__env"]["lang"] + "/";
    window["__env"] = window["__env"] || {};
    window["__env"]["uf"] = window["__env"]["uf"] || {};
    window["__env"]["uf"][srcId] = window["__env"]["uf"][srcId] || {};
    const uf = {};
    uf[srcId] = new _uf_shared_events_1.MicroFrontendData();
    uf[srcId].events.push(event_1.uEventsIds.InitMenu);
    const scriptList = ["runtime.js", "polyfills.js", "main.js", "styles.js"];
    for (const script of scriptList) {
        const temp = new ResourceSheme_1.ResourceSheme();
        temp.Element = "script";
        temp.setAttribute("src", `${url}${script}`);
        temp.setAttribute("type", "module");
        uf[srcId].resources.push(temp);
    }
    const temp = new ResourceSheme_1.ResourceSheme();
    temp.Element = "link";
    temp.Attributes["rel"] = "stylesheet";
    temp.Attributes["id"] = "themeAsset";
    temp.Attributes["href"] = url + "assets/deeppurple-amber.css";
    uf[srcId].resources.push(temp);
    window["__env"]["uf"][srcId] = uf[srcId];
});
