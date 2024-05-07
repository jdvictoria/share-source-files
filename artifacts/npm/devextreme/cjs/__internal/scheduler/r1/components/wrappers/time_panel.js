/**
* DevExtreme (cjs/__internal/scheduler/r1/components/wrappers/time_panel.js)
* Version: 24.1.1
* Build date: Tue May 07 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TimePanelComponent = void 0;
var _component_registrator = _interopRequireDefault(require("../../../../../core/component_registrator"));
var _index = require("../../../../core/r1/index");
var _time_panel_table = require("../base/time_panel_table");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
let TimePanelComponent = exports.TimePanelComponent = /*#__PURE__*/function (_ComponentWrapper) {
  _inheritsLoose(TimePanelComponent, _ComponentWrapper);
  function TimePanelComponent() {
    return _ComponentWrapper.apply(this, arguments) || this;
  }
  var _proto = TimePanelComponent.prototype;
  _proto._setOptionsByReference = function _setOptionsByReference() {
    // @ts-expect-error badly typed DomComponent
    _ComponentWrapper.prototype._setOptionsByReference.call(this);
    // @ts-expect-error badly typed DomComponent
    this._optionsByReference = _extends(_extends({}, this._optionsByReference), {
      timeCellTemplate: true
    });
  }
  /* eslint-disable @typescript-eslint/explicit-module-boundary-types */
  /* eslint-disable @typescript-eslint/explicit-function-return-type */;
  _createClass(TimePanelComponent, [{
    key: "_propsInfo",
    get: function () {
      return {
        twoWay: [],
        allowNull: [],
        elements: [],
        templates: ['timeCellTemplate'],
        props: ['groupOrientation', 'timePanelData', 'timeCellTemplate']
      };
    }
    /* eslint-enable @typescript-eslint/explicit-module-boundary-types */
    /* eslint-enable @typescript-eslint/explicit-function-return-type */
    // @ts-expect-error types error in R1
  }, {
    key: "_viewComponent",
    get: function () {
      return _time_panel_table.TimePanelTable;
    }
  }]);
  return TimePanelComponent;
}(_index.ComponentWrapper);
(0, _component_registrator.default)('dxTimePanelTableLayout', TimePanelComponent);
