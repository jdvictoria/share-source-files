"use strict";

exports.default = void 0;
var _utils = require("./utils");
require("./query_adapter");
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
const DEFAULT_PROTOCOL_VERSION = 4;
let RequestDispatcher = exports.default = /*#__PURE__*/function () {
  function RequestDispatcher(options) {
    options = options || {};
    this._url = String(options.url).replace(/\/+$/, '');
    this._beforeSend = options.beforeSend;
    this._jsonp = options.jsonp;
    this._version = options.version || DEFAULT_PROTOCOL_VERSION;
    this._withCredentials = options.withCredentials;
    this._deserializeDates = options.deserializeDates;
    this._filterToLower = options.filterToLower;
  }
  var _proto = RequestDispatcher.prototype;
  _proto.sendRequest = function sendRequest(url, method, params, payload) {
    return (0, _utils.sendRequest)(this.version, {
      url,
      method,
      params: params || {},
      payload
    }, {
      beforeSend: this._beforeSend,
      jsonp: this._jsonp,
      withCredentials: this._withCredentials,
      deserializeDates: this._deserializeDates
    });
  };
  _createClass(RequestDispatcher, [{
    key: "version",
    get: function () {
      return this._version;
    }
  }, {
    key: "beforeSend",
    get: function () {
      return this._beforeSend;
    }
  }, {
    key: "url",
    get: function () {
      return this._url;
    }
  }, {
    key: "jsonp",
    get: function () {
      return this._jsonp;
    }
  }, {
    key: "filterToLower",
    get: function () {
      return this._filterToLower;
    }
  }]);
  return RequestDispatcher;
}();
module.exports = exports.default;
module.exports.default = exports.default;