(function (window) {

  "use strict";

  const srcId = 1003;
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
  var url = "http://127.0.0.1:3003/";
  uf[srcId] = new UFData();
  uf[srcId].events.push(1002);
  var temp = new ResourceSheme();
  temp.Element = 'script';
  temp.Attributes['src'] = url + 'main.js';
  uf[srcId].resources.push(temp);

  window.__env.uf[srcId] = uf[srcId];

}(this));
