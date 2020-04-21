import { UParts } from '@uf-shared-models/UParts';
import { uEventsIds } from '@uf-shared-models/event';
import { ResourceSheme } from '@uf-shared-events/helpers/ResourceSheme';
import { UFData } from '@uf-shared-events/helpers/UFData';

/**
 * Source Id
 */
const srcId = UParts.Observer.SourceId;

/**
 * Microservice's port
 */
const port = '3006';

/**
 * Microservice's domain
 */
const domain = window['__env']['url'] || 'http://127.0.0.1';

/**
 * Microservice's URL
 */
const url = `${domain}:${port}/`;

window['__env'] = window['__env'] || {};
window['__env']['uf'] = window['__env']['uf'] || {};
window['__env']['uf'][srcId] = window['__env']['uf'][srcId] || {};

/**
 * Microservice's config
 */
const uf: { [id: string]: UFData } = {};

uf[srcId] = new UFData();
uf[srcId].events.push(uEventsIds.ObserverButtonPressed);

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
