/**
* DevExtreme (cjs/renovation/ui/editors/check_box/check_box.js)
* Version: 24.1.1
* Build date: Tue May 07 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.CheckBoxPropsType = exports.CheckBoxProps = exports.CheckBox = void 0;
exports.defaultOptions = defaultOptions;
exports.viewFunction = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _devices = _interopRequireDefault(require("../../../../core/devices"));
var _editor = require("../common/editor");
var _combine_classes = require("../../../utils/combine_classes");
var _check_box_icon = require("./check_box_icon");
var _widget = require("../../common/widget");
var _utils = require("../../../../core/options/utils");
const _excluded = ["accessKey", "activeStateEnabled", "aria", "className", "defaultValue", "disabled", "enableThreeStateBehavior", "focusStateEnabled", "height", "hint", "hoverStateEnabled", "iconSize", "inputAttr", "isDirty", "isValid", "name", "onClick", "onFocusIn", "onKeyDown", "readOnly", "rtlEnabled", "saveValueChangeEvent", "tabIndex", "text", "validationError", "validationErrors", "validationMessageMode", "validationMessagePosition", "validationStatus", "value", "valueChange", "visible", "width"];
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
const getCssClasses = model => {
  const {
    text,
    value
  } = model;
  const checked = value;
  const indeterminate = checked === null;
  const classesMap = {
    'dx-checkbox': true,
    'dx-checkbox-checked': checked === true,
    'dx-checkbox-has-text': !!text,
    'dx-checkbox-indeterminate': indeterminate
  };
  return (0, _combine_classes.combineClasses)(classesMap);
};
const viewFunction = viewModel => {
  const {
    aria,
    cssClasses: classes,
    editorRef,
    keyDown: onKeyDown,
    onWidgetClick: onClick,
    props: {
      accessKey,
      activeStateEnabled,
      className,
      disabled,
      focusStateEnabled,
      height,
      hint,
      hoverStateEnabled,
      iconSize,
      isValid,
      name,
      onFocusIn,
      readOnly,
      rtlEnabled,
      tabIndex,
      text,
      validationError,
      validationErrors,
      validationMessageMode,
      validationMessagePosition,
      validationStatus,
      value,
      visible,
      width
    },
    restAttributes
  } = viewModel;
  return (0, _inferno.normalizeProps)((0, _inferno.createComponentVNode)(2, _editor.Editor, _extends({
    "aria": aria,
    "classes": classes,
    "onClick": onClick,
    "onKeyDown": onKeyDown,
    "accessKey": accessKey,
    "activeStateEnabled": activeStateEnabled,
    "focusStateEnabled": focusStateEnabled,
    "hoverStateEnabled": hoverStateEnabled,
    "className": className,
    "disabled": disabled,
    "readOnly": readOnly,
    "hint": hint,
    "height": height,
    "width": width,
    "rtlEnabled": rtlEnabled,
    "tabIndex": tabIndex,
    "visible": visible,
    "validationError": validationError,
    "validationErrors": validationErrors,
    "validationMessageMode": validationMessageMode,
    "validationMessagePosition": validationMessagePosition,
    "validationStatus": validationStatus,
    "isValid": isValid,
    "onFocusIn": onFocusIn
  }, restAttributes, {
    children: (0, _inferno.createFragment)([(0, _inferno.normalizeProps)((0, _inferno.createVNode)(64, "input", null, null, 1, _extends({
      "type": "hidden",
      "value": "".concat(value)
    }, name && {
      name
    }))), (0, _inferno.createVNode)(1, "div", "dx-checkbox-container", [(0, _inferno.createComponentVNode)(2, _check_box_icon.CheckBoxIcon, {
      "size": iconSize,
      "isChecked": value === true
    }), text && (0, _inferno.createVNode)(1, "span", "dx-checkbox-text", text, 0)], 0)], 4)
  }), null, editorRef));
};
exports.viewFunction = viewFunction;
const CheckBoxProps = exports.CheckBoxProps = Object.create(Object.prototype, _extends(Object.getOwnPropertyDescriptors(_editor.EditorProps), Object.getOwnPropertyDescriptors(Object.defineProperties({
  text: '',
  enableThreeStateBehavior: false,
  activeStateEnabled: true,
  hoverStateEnabled: true,
  defaultValue: false,
  valueChange: () => {}
}, {
  focusStateEnabled: {
    get: function () {
      return _devices.default.real().deviceType === 'desktop' && !_devices.default.isSimulator();
    },
    configurable: true,
    enumerable: true
  }
}))));
const CheckBoxPropsType = exports.CheckBoxPropsType = Object.defineProperties({}, {
  text: {
    get: function () {
      return CheckBoxProps.text;
    },
    configurable: true,
    enumerable: true
  },
  enableThreeStateBehavior: {
    get: function () {
      return CheckBoxProps.enableThreeStateBehavior;
    },
    configurable: true,
    enumerable: true
  },
  activeStateEnabled: {
    get: function () {
      return CheckBoxProps.activeStateEnabled;
    },
    configurable: true,
    enumerable: true
  },
  hoverStateEnabled: {
    get: function () {
      return CheckBoxProps.hoverStateEnabled;
    },
    configurable: true,
    enumerable: true
  },
  focusStateEnabled: {
    get: function () {
      return CheckBoxProps.focusStateEnabled;
    },
    configurable: true,
    enumerable: true
  },
  defaultValue: {
    get: function () {
      return CheckBoxProps.defaultValue;
    },
    configurable: true,
    enumerable: true
  },
  valueChange: {
    get: function () {
      return CheckBoxProps.valueChange;
    },
    configurable: true,
    enumerable: true
  },
  readOnly: {
    get: function () {
      return CheckBoxProps.readOnly;
    },
    configurable: true,
    enumerable: true
  },
  name: {
    get: function () {
      return CheckBoxProps.name;
    },
    configurable: true,
    enumerable: true
  },
  validationError: {
    get: function () {
      return CheckBoxProps.validationError;
    },
    configurable: true,
    enumerable: true
  },
  validationErrors: {
    get: function () {
      return CheckBoxProps.validationErrors;
    },
    configurable: true,
    enumerable: true
  },
  validationMessageMode: {
    get: function () {
      return CheckBoxProps.validationMessageMode;
    },
    configurable: true,
    enumerable: true
  },
  validationMessagePosition: {
    get: function () {
      return CheckBoxProps.validationMessagePosition;
    },
    configurable: true,
    enumerable: true
  },
  validationStatus: {
    get: function () {
      return CheckBoxProps.validationStatus;
    },
    configurable: true,
    enumerable: true
  },
  isValid: {
    get: function () {
      return CheckBoxProps.isValid;
    },
    configurable: true,
    enumerable: true
  },
  isDirty: {
    get: function () {
      return CheckBoxProps.isDirty;
    },
    configurable: true,
    enumerable: true
  },
  inputAttr: {
    get: function () {
      return CheckBoxProps.inputAttr;
    },
    configurable: true,
    enumerable: true
  },
  className: {
    get: function () {
      return CheckBoxProps.className;
    },
    configurable: true,
    enumerable: true
  },
  disabled: {
    get: function () {
      return CheckBoxProps.disabled;
    },
    configurable: true,
    enumerable: true
  },
  tabIndex: {
    get: function () {
      return CheckBoxProps.tabIndex;
    },
    configurable: true,
    enumerable: true
  },
  visible: {
    get: function () {
      return CheckBoxProps.visible;
    },
    configurable: true,
    enumerable: true
  },
  aria: {
    get: function () {
      return _widget.WidgetProps.aria;
    },
    configurable: true,
    enumerable: true
  }
});
let CheckBox = exports.CheckBox = /*#__PURE__*/function (_InfernoWrapperCompon) {
  _inheritsLoose(CheckBox, _InfernoWrapperCompon);
  function CheckBox(props) {
    var _this;
    _this = _InfernoWrapperCompon.call(this, props) || this;
    _this.editorRef = (0, _inferno.createRef)();
    _this.state = {
      value: _this.props.value !== undefined ? _this.props.value : _this.props.defaultValue
    };
    _this.focus = _this.focus.bind(_assertThisInitialized(_this));
    _this.blur = _this.blur.bind(_assertThisInitialized(_this));
    _this.onWidgetClick = _this.onWidgetClick.bind(_assertThisInitialized(_this));
    _this.keyDown = _this.keyDown.bind(_assertThisInitialized(_this));
    return _this;
  }
  var _proto = CheckBox.prototype;
  _proto.createEffects = function createEffects() {
    return [(0, _inferno2.createReRenderEffect)()];
  };
  _proto.onWidgetClick = function onWidgetClick(event) {
    const {
      enableThreeStateBehavior,
      readOnly,
      saveValueChangeEvent
    } = this.props;
    if (!readOnly) {
      saveValueChangeEvent === null || saveValueChangeEvent === void 0 ? void 0 : saveValueChangeEvent(event);
      if (enableThreeStateBehavior) {
        {
          let __newValue;
          this.setState(__state_argument => {
            __newValue = (this.props.value !== undefined ? this.props.value : __state_argument.value) === null || (!(this.props.value !== undefined ? this.props.value : __state_argument.value) ? null : false);
            return {
              value: __newValue
            };
          });
          this.props.valueChange(__newValue);
        }
      } else {
        {
          let __newValue;
          this.setState(__state_argument => {
            var _ref;
            __newValue = !((_ref = this.props.value !== undefined ? this.props.value : __state_argument.value) !== null && _ref !== void 0 ? _ref : false);
            return {
              value: __newValue
            };
          });
          this.props.valueChange(__newValue);
        }
      }
    }
  };
  _proto.keyDown = function keyDown(e) {
    const {
      onKeyDown
    } = this.props;
    const {
      keyName,
      originalEvent,
      which
    } = e;
    const result = onKeyDown === null || onKeyDown === void 0 ? void 0 : onKeyDown(e);
    if (result !== null && result !== void 0 && result.cancel) {
      return result;
    }
    if (keyName === 'space' || which === 'space') {
      originalEvent.preventDefault();
      this.onWidgetClick(originalEvent);
    }
    return undefined;
  };
  _proto.focus = function focus() {
    this.editorRef.current.focus();
  };
  _proto.blur = function blur() {
    this.editorRef.current.blur();
  };
  _proto.render = function render() {
    const props = this.props;
    return viewFunction({
      props: _extends({}, props, {
        value: this.props.value !== undefined ? this.props.value : this.state.value
      }),
      editorRef: this.editorRef,
      onWidgetClick: this.onWidgetClick,
      keyDown: this.keyDown,
      cssClasses: this.cssClasses,
      aria: this.aria,
      restAttributes: this.restAttributes
    });
  };
  _createClass(CheckBox, [{
    key: "cssClasses",
    get: function () {
      return getCssClasses(_extends({}, this.props, {
        value: this.props.value !== undefined ? this.props.value : this.state.value
      }));
    }
  }, {
    key: "aria",
    get: function () {
      const checked = (this.props.value !== undefined ? this.props.value : this.state.value) === true;
      const indeterminate = (this.props.value !== undefined ? this.props.value : this.state.value) === null;
      const result = {
        role: 'checkbox',
        checked: indeterminate ? 'mixed' : "".concat(checked)
      };
      return _extends({}, result, this.props.aria);
    }
  }, {
    key: "restAttributes",
    get: function () {
      const _this$props$value = _extends({}, this.props, {
          value: this.props.value !== undefined ? this.props.value : this.state.value
        }),
        restProps = _objectWithoutPropertiesLoose(_this$props$value, _excluded);
      return restProps;
    }
  }]);
  return CheckBox;
}(_inferno2.InfernoWrapperComponent);
function __processTwoWayProps(defaultProps) {
  const twoWayProps = ['value'];
  return Object.keys(defaultProps).reduce((props, propName) => {
    const propValue = defaultProps[propName];
    const defaultPropName = twoWayProps.some(p => p === propName) ? 'default' + propName.charAt(0).toUpperCase() + propName.slice(1) : propName;
    props[defaultPropName] = propValue;
    return props;
  }, {});
}
CheckBox.defaultProps = CheckBoxPropsType;
const __defaultOptionRules = [];
function defaultOptions(rule) {
  __defaultOptionRules.push(rule);
  CheckBox.defaultProps = Object.create(Object.prototype, _extends(Object.getOwnPropertyDescriptors(CheckBox.defaultProps), Object.getOwnPropertyDescriptors(__processTwoWayProps((0, _utils.convertRulesToOptions)(__defaultOptionRules)))));
}
