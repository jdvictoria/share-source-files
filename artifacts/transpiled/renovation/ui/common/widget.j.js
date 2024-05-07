"use strict";

exports.default = void 0;
var _component_registrator = _interopRequireDefault(require("../../../core/component_registrator"));
var _component = _interopRequireDefault(require("../../component_wrapper/common/component"));
var _widget = require("./widget");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
let Widget = exports.default = /*#__PURE__*/function (_BaseComponent) {
  _inheritsLoose(Widget, _BaseComponent);
  function Widget() {
    return _BaseComponent.apply(this, arguments) || this;
  }
  var _proto = Widget.prototype;
  _proto.getProps = function getProps() {
    const props = _BaseComponent.prototype.getProps.call(this);
    props.onKeyDown = this._wrapKeyDownHandler(props.onKeyDown);
    return props;
  };
  _proto.focus = function focus() {
    var _this$viewRef;
    return (_this$viewRef = this.viewRef) === null || _this$viewRef === void 0 ? void 0 : _this$viewRef.focus(...arguments);
  };
  _proto.blur = function blur() {
    var _this$viewRef2;
    return (_this$viewRef2 = this.viewRef) === null || _this$viewRef2 === void 0 ? void 0 : _this$viewRef2.blur(...arguments);
  };
  _proto.activate = function activate() {
    var _this$viewRef3;
    return (_this$viewRef3 = this.viewRef) === null || _this$viewRef3 === void 0 ? void 0 : _this$viewRef3.activate(...arguments);
  };
  _proto.deactivate = function deactivate() {
    var _this$viewRef4;
    return (_this$viewRef4 = this.viewRef) === null || _this$viewRef4 === void 0 ? void 0 : _this$viewRef4.deactivate(...arguments);
  };
  _proto._getActionConfigs = function _getActionConfigs() {
    return {
      onActive: {},
      onDimensionChanged: {},
      onInactive: {},
      onVisibilityChange: {},
      onFocusIn: {},
      onFocusOut: {},
      onHoverStart: {},
      onHoverEnd: {},
      onRootElementRendered: {},
      onClick: {}
    };
  };
  _createClass(Widget, [{
    key: "_propsInfo",
    get: function () {
      return {
        twoWay: [],
        allowNull: [],
        elements: [],
        templates: [],
        props: ['_feedbackHideTimeout', '_feedbackShowTimeout', 'activeStateUnit', 'cssText', 'aria', 'classes', 'name', 'addWidgetClass', 'onActive', 'onDimensionChanged', 'onInactive', 'onVisibilityChange', 'onFocusIn', 'onFocusOut', 'onHoverStart', 'onHoverEnd', 'onRootElementRendered', 'className', 'accessKey', 'activeStateEnabled', 'disabled', 'focusStateEnabled', 'height', 'hint', 'hoverStateEnabled', 'onClick', 'onKeyDown', 'rtlEnabled', 'tabIndex', 'visible', 'width']
      };
    }
  }, {
    key: "_viewComponent",
    get: function () {
      return _widget.Widget;
    }
  }]);
  return Widget;
}(_component.default);
(0, _component_registrator.default)('dxWidget', Widget);
module.exports = exports.default;
module.exports.default = exports.default;