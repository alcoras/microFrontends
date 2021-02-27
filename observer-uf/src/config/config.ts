import { EventIds, MicroFrontendData, MicroFrontendParts, ResourceSheme } from "event-proxy-lib-src";

/**
 * Source Id
 */
const srcId = MicroFrontendParts.Observer.SourceId;

/**
 * Microservice's port
 */
const port = '3006';

window['__env'] = window['__env'] || {};
window['__env']['uf'] = window['__env']['uf'] || {};
window['__env']['uf'][srcId] = window['__env']['uf'][srcId] || {};

/**
 * Microservice's domain
 */
const domain = window['__env']['url'] || 'http://127.0.0.1';

/**
 * Microservice's URL
 */
const url = `${domain}:${port}/`;

/**
 * Microservice's config
 */
const uf: { [id: string]: MicroFrontendData } = {};

uf[srcId] = new MicroFrontendData();
uf[srcId].events.push(EventIds.ObserverButtonPressed);

/**
 * List of scripts to be loaded by shell
 */
const scriptList = ['runtime.js', 'polyfills.js', 'main.js', 'styles.js'];

for (const script of scriptList) {
  const temp = new ResourceSheme();
  temp.Element = 'script';
  temp.setAttribute('src', `${url}${script}`);
  temp.setAttribute('type', 'module');
  uf[srcId].resources.push(temp);
}

window['__env']['uf'][srcId] = uf[srcId];
