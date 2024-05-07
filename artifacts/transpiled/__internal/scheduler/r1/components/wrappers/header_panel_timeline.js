"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HeaderPanelTimelineComponent = void 0;
var _component_registrator = _interopRequireDefault(require("../../../../../core/component_registrator"));
var _header_panel_timeline = require("../timeline/header_panel_timeline");
var _header_panel = require("./header_panel");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
let HeaderPanelTimelineComponent = exports.HeaderPanelTimelineComponent = /*#__PURE__*/function (_HeaderPanelComponent) {
  _inheritsLoose(HeaderPanelTimelineComponent, _HeaderPanelComponent);
  function HeaderPanelTimelineComponent() {
    return _HeaderPanelComponent.apply(this, arguments) || this;
  }
  _createClass(HeaderPanelTimelineComponent, [{
    key: "_propsInfo",
    get: /* eslint-disable @typescript-eslint/explicit-module-boundary-types */
    /* eslint-disable @typescript-eslint/explicit-function-return-type */
    function () {
      return {
        twoWay: [],
        allowNull: [],
        elements: [],
        templates: ['dateCellTemplate', 'timeCellTemplate', 'dateHeaderTemplate', 'resourceCellTemplate'],
        props: ['dateHeaderData', 'isRenderDateHeader', 'dateCellTemplate', 'timeCellTemplate', 'dateHeaderTemplate', 'groups', 'groupOrientation', 'groupPanelData', 'groupByDate', 'height', 'className', 'resourceCellTemplate']
      };
    }
    /* eslint-enable @typescript-eslint/explicit-module-boundary-types */
    /* eslint-enable @typescript-eslint/explicit-function-return-type */
  }, {
    key: "_viewComponent",
    get: function () {
      return _header_panel_timeline.HeaderPanelTimeline;
    }
  }]);
  return HeaderPanelTimelineComponent;
}(_header_panel.HeaderPanelComponent);
(0, _component_registrator.default)('dxTimelineHeaderPanelLayout', HeaderPanelTimelineComponent);