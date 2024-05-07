"use strict";

exports.default = void 0;
var _component_registrator = _interopRequireDefault(require("../../../core/component_registrator"));
var _scrollable = require("../../component_wrapper/navigation/scrollable");
var _scrollable2 = require("./scrollable");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
let Scrollable = exports.default = /*#__PURE__*/function (_ScrollableWrapper) {
  _inheritsLoose(Scrollable, _ScrollableWrapper);
  function Scrollable() {
    return _ScrollableWrapper.apply(this, arguments) || this;
  }
  var _proto = Scrollable.prototype;
  _proto.content = function content() {
    var _this$viewRef;
    return this._toPublicElement((_this$viewRef = this.viewRef) === null || _this$viewRef === void 0 ? void 0 : _this$viewRef.content(...arguments));
  };
  _proto.container = function container() {
    var _this$viewRef2;
    return this._toPublicElement((_this$viewRef2 = this.viewRef) === null || _this$viewRef2 === void 0 ? void 0 : _this$viewRef2.container(...arguments));
  };
  _proto.scrollTo = function scrollTo(targetLocation) {
    var _this$viewRef3;
    return (_this$viewRef3 = this.viewRef) === null || _this$viewRef3 === void 0 ? void 0 : _this$viewRef3.scrollTo(...arguments);
  };
  _proto.scrollBy = function scrollBy(distance) {
    var _this$viewRef4;
    return (_this$viewRef4 = this.viewRef) === null || _this$viewRef4 === void 0 ? void 0 : _this$viewRef4.scrollBy(...arguments);
  };
  _proto.updateHandler = function updateHandler() {
    var _this$viewRef5;
    return (_this$viewRef5 = this.viewRef) === null || _this$viewRef5 === void 0 ? void 0 : _this$viewRef5.updateHandler(...arguments);
  };
  _proto.release = function release() {
    var _this$viewRef6;
    return (_this$viewRef6 = this.viewRef) === null || _this$viewRef6 === void 0 ? void 0 : _this$viewRef6.release(...arguments);
  };
  _proto.refresh = function refresh() {
    var _this$viewRef7;
    return (_this$viewRef7 = this.viewRef) === null || _this$viewRef7 === void 0 ? void 0 : _this$viewRef7.refresh(...arguments);
  };
  _proto.scrollToElement = function scrollToElement(element, offset) {
    var _this$viewRef8;
    const params = [this._patchElementParam(element), offset];
    return (_this$viewRef8 = this.viewRef) === null || _this$viewRef8 === void 0 ? void 0 : _this$viewRef8.scrollToElement(...params.slice(0, arguments.length));
  };
  _proto.scrollHeight = function scrollHeight() {
    var _this$viewRef9;
    return (_this$viewRef9 = this.viewRef) === null || _this$viewRef9 === void 0 ? void 0 : _this$viewRef9.scrollHeight(...arguments);
  };
  _proto.scrollWidth = function scrollWidth() {
    var _this$viewRef10;
    return (_this$viewRef10 = this.viewRef) === null || _this$viewRef10 === void 0 ? void 0 : _this$viewRef10.scrollWidth(...arguments);
  };
  _proto.scrollOffset = function scrollOffset() {
    var _this$viewRef11;
    return (_this$viewRef11 = this.viewRef) === null || _this$viewRef11 === void 0 ? void 0 : _this$viewRef11.scrollOffset(...arguments);
  };
  _proto.scrollTop = function scrollTop() {
    var _this$viewRef12;
    return (_this$viewRef12 = this.viewRef) === null || _this$viewRef12 === void 0 ? void 0 : _this$viewRef12.scrollTop(...arguments);
  };
  _proto.scrollLeft = function scrollLeft() {
    var _this$viewRef13;
    return (_this$viewRef13 = this.viewRef) === null || _this$viewRef13 === void 0 ? void 0 : _this$viewRef13.scrollLeft(...arguments);
  };
  _proto.clientHeight = function clientHeight() {
    var _this$viewRef14;
    return (_this$viewRef14 = this.viewRef) === null || _this$viewRef14 === void 0 ? void 0 : _this$viewRef14.clientHeight(...arguments);
  };
  _proto.clientWidth = function clientWidth() {
    var _this$viewRef15;
    return (_this$viewRef15 = this.viewRef) === null || _this$viewRef15 === void 0 ? void 0 : _this$viewRef15.clientWidth(...arguments);
  };
  _proto.getScrollElementPosition = function getScrollElementPosition(targetElement, direction, offset) {
    var _this$viewRef16;
    const params = [this._patchElementParam(targetElement), direction, offset];
    return (_this$viewRef16 = this.viewRef) === null || _this$viewRef16 === void 0 ? void 0 : _this$viewRef16.getScrollElementPosition(...params.slice(0, arguments.length));
  };
  _proto.startLoading = function startLoading() {
    var _this$viewRef17;
    return (_this$viewRef17 = this.viewRef) === null || _this$viewRef17 === void 0 ? void 0 : _this$viewRef17.startLoading(...arguments);
  };
  _proto.finishLoading = function finishLoading() {
    var _this$viewRef18;
    return (_this$viewRef18 = this.viewRef) === null || _this$viewRef18 === void 0 ? void 0 : _this$viewRef18.finishLoading(...arguments);
  };
  _proto._getActionConfigs = function _getActionConfigs() {
    return {
      onVisibilityChange: {},
      onStart: {},
      onEnd: {},
      onBounce: {},
      scrollLocationChange: {},
      onScroll: {},
      onUpdated: {},
      onPullDown: {},
      onReachBottom: {}
    };
  };
  _createClass(Scrollable, [{
    key: "_propsInfo",
    get: function () {
      return {
        twoWay: [],
        allowNull: [],
        elements: [],
        templates: ['loadPanelTemplate'],
        props: ['useNative', 'useSimulatedScrollbar', 'refreshStrategy', 'inertiaEnabled', 'useKeyboard', 'showScrollbar', 'scrollByThumb', 'onVisibilityChange', 'onStart', 'onEnd', 'onBounce', 'scrollLocationChange', 'loadPanelTemplate', 'aria', 'addWidgetClass', 'disabled', 'height', 'width', 'visible', 'rtlEnabled', 'classes', 'direction', 'bounceEnabled', 'scrollByContent', 'pullDownEnabled', 'reachBottomEnabled', 'forceGeneratePockets', 'needScrollViewContentWrapper', 'needRenderScrollbars', 'onScroll', 'onUpdated', 'onPullDown', 'onReachBottom', 'pullingDownText', 'pulledDownText', 'refreshingText', 'reachBottomText']
      };
    }
  }, {
    key: "_viewComponent",
    get: function () {
      return _scrollable2.Scrollable;
    }
  }]);
  return Scrollable;
}(_scrollable.ScrollableWrapper);
(0, _component_registrator.default)('dxScrollable', Scrollable);
module.exports = exports.default;
module.exports.default = exports.default;