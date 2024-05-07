/**
* DevExtreme (renovation/ui/overlays/popover.js)
* Version: 24.1.1
* Build date: Tue May 07 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.PopoverProps = exports.Popover = void 0;
exports.defaultOptions = defaultOptions;
exports.viewFunction = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _devices = _interopRequireDefault(require("../../../core/devices"));
var _ui = _interopRequireDefault(require("../../../ui/popover/ui.popover"));
var _dom_component_wrapper = require("../common/dom_component_wrapper");
var _base_props = require("../common/base_props");
var _utils = require("../../../core/options/utils");
const _excluded = ["children"],
  _excluded2 = ["accessKey", "activeStateEnabled", "animation", "children", "className", "container", "contentTemplate", "defaultVisible", "deferRendering", "disabled", "focusStateEnabled", "height", "hideEvent", "hideOnOutsideClick", "hint", "hoverStateEnabled", "maxHeight", "maxWidth", "minHeight", "minWidth", "onClick", "onHidden", "onHiding", "onInitialized", "onKeyDown", "onOptionChanged", "onShowing", "onShown", "onTitleRendered", "position", "rtlEnabled", "shading", "shadingColor", "showCloseButton", "showEvent", "showTitle", "tabIndex", "target", "title", "titleTemplate", "toolbarItems", "visible", "visibleChange", "width"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const isDesktop = !(!_devices.default.real().generic || _devices.default.isSimulator());
const viewFunction = _ref => {
  let {
    componentProps,
    domComponentWrapperRef,
    restAttributes
  } = _ref;
  return (0, _inferno.normalizeProps)((0, _inferno.createComponentVNode)(2, _dom_component_wrapper.DomComponentWrapper, _extends({
    "componentType": _ui.default,
    "componentProps": componentProps.restProps,
    "templateNames": ['titleTemplate', 'contentTemplate']
  }, restAttributes, {
    children: componentProps.children
  }), null, domComponentWrapperRef));
};
exports.viewFunction = viewFunction;
const PopoverProps = exports.PopoverProps = Object.create(Object.prototype, _extends(Object.getOwnPropertyDescriptors(_base_props.BaseWidgetProps), Object.getOwnPropertyDescriptors({
  animation: Object.freeze({
    show: {
      type: 'fade',
      from: 0,
      to: 1
    },
    hide: {
      type: 'fade',
      to: 0
    }
  }),
  hideOnOutsideClick: false,
  contentTemplate: 'content',
  deferRendering: true,
  disabled: false,
  height: 'auto',
  hoverStateEnabled: false,
  maxHeight: null,
  maxWidth: null,
  minHeight: null,
  minWidth: null,
  position: 'bottom',
  rtlEnabled: false,
  shading: false,
  shadingColor: '',
  showCloseButton: isDesktop,
  showTitle: false,
  title: '',
  titleTemplate: 'title',
  width: 'auto',
  defaultVisible: true,
  visibleChange: () => {},
  isReactComponentWrapper: true
})));
const getTemplate = TemplateProp => TemplateProp && (TemplateProp.defaultProps ? props => (0, _inferno.normalizeProps)((0, _inferno.createComponentVNode)(2, TemplateProp, _extends({}, props))) : TemplateProp);
let Popover = exports.Popover = /*#__PURE__*/function (_InfernoComponent) {
  _inheritsLoose(Popover, _InfernoComponent);
  function Popover(props) {
    var _this;
    _this = _InfernoComponent.call(this, props) || this;
    _this.domComponentWrapperRef = (0, _inferno.createRef)();
    _this.__getterCache = {};
    _this.state = {
      visible: _this.props.visible !== undefined ? _this.props.visible : _this.props.defaultVisible
    };
    _this.saveInstance = _this.saveInstance.bind(_assertThisInitialized(_this));
    _this.setHideEventListener = _this.setHideEventListener.bind(_assertThisInitialized(_this));
    return _this;
  }
  var _proto = Popover.prototype;
  _proto.createEffects = function createEffects() {
    return [new _inferno2.InfernoEffect(this.saveInstance, []), new _inferno2.InfernoEffect(this.setHideEventListener, [this.props.visibleChange])];
  };
  _proto.updateEffects = function updateEffects() {
    var _this$_effects$, _this$_effects$2;
    (_this$_effects$ = this._effects[0]) === null || _this$_effects$ === void 0 ? void 0 : _this$_effects$.update([]);
    (_this$_effects$2 = this._effects[1]) === null || _this$_effects$2 === void 0 ? void 0 : _this$_effects$2.update([this.props.visibleChange]);
  };
  _proto.saveInstance = function saveInstance() {
    var _this$domComponentWra;
    this.instance = (_this$domComponentWra = this.domComponentWrapperRef.current) === null || _this$domComponentWra === void 0 ? void 0 : _this$domComponentWra.getInstance();
  };
  _proto.setHideEventListener = function setHideEventListener() {
    this.instance.option('onHiding', () => {
      {
        let __newValue;
        this.setState(__state_argument => {
          __newValue = false;
          return {
            visible: __newValue
          };
        });
        this.props.visibleChange(__newValue);
      }
    });
  };
  _proto.componentWillUpdate = function componentWillUpdate(nextProps, nextState, context) {
    _InfernoComponent.prototype.componentWillUpdate.call(this);
    if (this.props !== nextProps) {
      this.__getterCache['componentProps'] = undefined;
    }
  };
  _proto.render = function render() {
    const props = this.props;
    return viewFunction({
      props: _extends({}, props, {
        visible: this.props.visible !== undefined ? this.props.visible : this.state.visible,
        contentTemplate: getTemplate(props.contentTemplate),
        titleTemplate: getTemplate(props.titleTemplate)
      }),
      domComponentWrapperRef: this.domComponentWrapperRef,
      componentProps: this.componentProps,
      restAttributes: this.restAttributes
    });
  };
  _createClass(Popover, [{
    key: "componentProps",
    get: function () {
      if (this.__getterCache['componentProps'] !== undefined) {
        return this.__getterCache['componentProps'];
      }
      return this.__getterCache['componentProps'] = (() => {
        const _this$props$visible = _extends({}, this.props, {
            visible: this.props.visible !== undefined ? this.props.visible : this.state.visible
          }),
          {
            children
          } = _this$props$visible,
          restProps = _objectWithoutPropertiesLoose(_this$props$visible, _excluded);
        return {
          children,
          restProps
        };
      })();
    }
  }, {
    key: "restAttributes",
    get: function () {
      const _this$props$visible2 = _extends({}, this.props, {
          visible: this.props.visible !== undefined ? this.props.visible : this.state.visible
        }),
        restProps = _objectWithoutPropertiesLoose(_this$props$visible2, _excluded2);
      return restProps;
    }
  }]);
  return Popover;
}(_inferno2.InfernoComponent);
function __processTwoWayProps(defaultProps) {
  const twoWayProps = ['visible'];
  return Object.keys(defaultProps).reduce((props, propName) => {
    const propValue = defaultProps[propName];
    const defaultPropName = twoWayProps.some(p => p === propName) ? 'default' + propName.charAt(0).toUpperCase() + propName.slice(1) : propName;
    props[defaultPropName] = propValue;
    return props;
  }, {});
}
Popover.defaultProps = PopoverProps;
const __defaultOptionRules = [];
function defaultOptions(rule) {
  __defaultOptionRules.push(rule);
  Popover.defaultProps = Object.create(Object.prototype, _extends(Object.getOwnPropertyDescriptors(Popover.defaultProps), Object.getOwnPropertyDescriptors(__processTwoWayProps((0, _utils.convertRulesToOptions)(__defaultOptionRules)))));
}
