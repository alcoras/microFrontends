/* eslint-disable */
(function (window) {

  "use strict";
  const srcId = 1008;
  const port = '3008';
  const eventIdToPush = 1008;

  window.__env = window.__env || {};
  window.__env.uf = window.__env.uf || {};
  window.__env.uf[srcId] = window.__env.uf[srcId] || {};

  var ResourceSheme = /** @class */ (function () {
      function ResourceSheme() {
          this.Attributes = {};
      }
      ResourceSheme.prototype.setAttribute = function (attr, value) {
          this.Attributes[attr] = value;
      };
      return ResourceSheme;
  }());
  var UFData = /** @class */ (function () {
      function UFData() {
          this.events = [];
          this.resources = [];
      }
      return UFData;
  }());
  var uf = {};

  var domain = window.__env['url'] || "http://127.0.0.1";
  var url = domain + ':' + port + '/';
  // if (!window.__env.one_language)
  //   url = url + window.__env.lang + '/';
  uf[srcId] = new UFData();
  uf[srcId].events.push(eventIdToPush);
  temp = new ResourceSheme();
  temp.Element = 'script';
  temp.Attributes['src'] = url + 'runtime.js';
  temp.Attributes['type'] = 'module';
  uf[srcId].resources.push(temp);

  temp = new ResourceSheme();
  temp.Element = 'script';
  temp.Attributes['src'] = url + 'polyfills.js';
  temp.Attributes['type'] = 'module';
  uf[srcId].resources.push(temp);

  var temp = new ResourceSheme();
  temp.Element = 'script';
  temp.Attributes['src'] = url + 'main.js';
  temp.Attributes['type'] = 'module';
  uf[srcId].resources.push(temp);

  temp = new ResourceSheme();
  temp.Element = 'script';
  temp.Attributes['src'] = url + 'styles.js';
  temp.Attributes['type'] = 'module';
  uf[srcId].resources.push(temp);

  window.__env.uf[srcId] = uf[srcId];

}(this));
