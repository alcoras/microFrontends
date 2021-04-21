import { UParts } from "@uf-shared-models/UParts";
import { uEventsIds } from "@uf-shared-models/event";
import { ResourceSheme } from "@uf-shared-events/helpers/ResourceSheme";
import { MicroFrontendData } from "@uf-shared-events/";

/**
 * Source Id
 */
const srcId = UParts.Menu.SourceId;

/**
 * Microservice"s port
 */
const port = "3002";

/**
 * Microservice"s domain
 */
const domain = window["__env"]["url"] || "http://127.0.0.1";

/**
 * Microservice"s URL
 */
let url = `${domain}:${port}/`;

if (!window["__env"]["one_language"])
  url = url + window["__env"]["lang"] + "/";

window["__env"] = window["__env"] || {};
window["__env"]["uf"] = window["__env"]["uf"] || {};
window["__env"]["uf"][srcId] = window["__env"]["uf"][srcId] || {};

/**
 * Microservice"s config
 */
const uf: { [id: string]: MicroFrontendData } = {};

uf[srcId] = new MicroFrontendData();
uf[srcId].events.push(uEventsIds.InitMenu);

/**
 * List of scripts to be loaded by shell
 */
const scriptList = ["runtime.js", "polyfills.js", "main.js", "styles.js"];

for (const script of scriptList) {
  const temp = new ResourceSheme();
  temp.Element = "script";
  temp.setAttribute("src", `${url}${script}`);
  temp.setAttribute("type", "module");
  uf[srcId].resources.push(temp);
}

/**
 * Adding theme
 */
const temp = new ResourceSheme();
temp.Element = "link";
temp.Attributes["rel"] = "stylesheet";
temp.Attributes["id"] = "themeAsset";
temp.Attributes["href"] = url + "assets/deeppurple-amber.css";
uf[srcId].resources.push(temp);

window["__env"]["uf"][srcId] = uf[srcId];
