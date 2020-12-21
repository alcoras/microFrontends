/* eslint-disable */
(function (window) {

  "use strict";

  const srcId = "$source_id$";
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
  // if (!window.__env.one_language)
  //   url = url + window.__env.lang + '/';
  var url = "$project_name$/";
  uf[srcId] = new UFData();
  uf[srcId].events.push(1005);
  temp = new ResourceSheme();
  temp.Element = 'script';
  temp.Attributes['src'] = url + 'runtime.js';
  uf[srcId].resources.push(temp);

  temp = new ResourceSheme();
  temp.Element = 'script';
  temp.Attributes['src'] = url + 'polyfills.js';
  uf[srcId].resources.push(temp);

  var temp = new ResourceSheme();
  temp.Element = 'script';
  temp.Attributes['src'] = url + 'main.js';
  uf[srcId].resources.push(temp);

  // For production
  // temp = new ResourceSheme();
  // temp.Element = 'link';
  // temp.Attributes['rel'] = 'stylesheet';
  // temp.Attributes['href'] = url + 'styles.css';
  // uf[srcId].resources.push(temp);

  // For development
  temp = new ResourceSheme();
  temp.Element = 'script';
  temp.Attributes['src'] = url + 'styles.js';
  temp.Attributes['type'] = 'module';
  uf[srcId].resources.push(temp);

  window.__env.uf[srcId] = uf[srcId];

}(this));
