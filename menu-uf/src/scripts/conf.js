(function (window) {

  "use strict";

  const srcId = 1001;
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
  var url = "http://127.0.0.1:3002/";
  uf[srcId] = new UFData();
  uf[srcId].events.push(1002);
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

  // temp = new ResourceSheme();
  // temp.Element = 'link';
  // temp.Attributes['rel'] = 'stylesheet';
  // temp.Attributes['href'] = url + 'styles.css';
  // uf[srcId].resources.push(temp);

  temp = new ResourceSheme();
  temp.Element = 'link';
  temp.Attributes['rel'] = 'stylesheet';
  temp.Attributes['id'] = 'themeAsset';
  temp.Attributes['href'] = url + 'assets/deeppurple-amber.css';
  uf[srcId].resources.push(temp);

  temp = new ResourceSheme();
  temp.Element = 'link';
  temp.Attributes['rel'] = 'stylesheet';
  temp.Attributes['href'] = url + 'assets/indigo-pink.css';
  uf[srcId].resources.push(temp);

  temp = new ResourceSheme();
  temp.Element = 'link';
  temp.Attributes['rel'] = 'stylesheet';
  temp.Attributes['href'] = url + 'assets/pink-bluegrey.css';
  uf[srcId].resources.push(temp);

  temp = new ResourceSheme();
  temp.Element = 'link';
  temp.Attributes['rel'] = 'stylesheet';
  temp.Attributes['href'] = url + 'assets/purple-green.css';
  uf[srcId].resources.push(temp);

  window.__env.uf[srcId] = uf[srcId];

}(this));
