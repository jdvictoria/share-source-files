"use strict";

exports.viewFunction = exports.PageSizeSmallProps = exports.PageSizeSmall = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _message = _interopRequireDefault(require("../../../../localization/message"));
var _select_box = require("../../editors/drop_down_editors/select_box");
var _calculate_values_fitted_width = require("../utils/calculate_values_fitted_width");
var _get_element_width = require("../utils/get_element_width");
var _pager_props = require("../common/pager_props");
const _excluded = ["inputAttr", "pageSize", "pageSizeChange", "pageSizes", "parentRef"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
const viewFunction = _ref => {
  let {
    props: {
      inputAttr,
      pageSize,
      pageSizeChange,
      pageSizes
    },
    width
  } = _ref;
  return (0, _inferno.createComponentVNode)(2, _select_box.SelectBox, {
    "displayExpr": "text",
    "valueExpr": "value",
    "dataSource": pageSizes,
    "value": pageSize,
    "valueChange": pageSizeChange,
    "width": width,
    "inputAttr": inputAttr
  });
};
exports.viewFunction = viewFunction;
const PageSizeSmallProps = exports.PageSizeSmallProps = {
  inputAttr: Object.freeze({
    'aria-label': _message.default.format('dxPager-ariaPageSize')
  })
};
const PageSizeSmallPropsType = Object.defineProperties({}, {
  pageSize: {
    get: function () {
      return _pager_props.InternalPagerProps.pageSize;
    },
    configurable: true,
    enumerable: true
  },
  inputAttr: {
    get: function () {
      return PageSizeSmallProps.inputAttr;
    },
    configurable: true,
    enumerable: true
  }
});
let PageSizeSmall = exports.PageSizeSmall = /*#__PURE__*/function (_InfernoComponent) {
  _inheritsLoose(PageSizeSmall, _InfernoComponent);
  function PageSizeSmall(props) {
    var _this;
    _this = _InfernoComponent.call(this, props) || this;
    _this.state = {
      minWidth: 10
    };
    _this.updateWidth = _this.updateWidth.bind(_assertThisInitialized(_this));
    return _this;
  }
  var _proto = PageSizeSmall.prototype;
  _proto.createEffects = function createEffects() {
    return [new _inferno2.InfernoEffect(this.updateWidth, [this.props, this.state.minWidth, this.props.pageSize, this.props.pageSizeChange, this.props.pageSizes, this.props.inputAttr])];
  };
  _proto.updateEffects = function updateEffects() {
    var _this$_effects$;
    (_this$_effects$ = this._effects[0]) === null || _this$_effects$ === void 0 ? void 0 : _this$_effects$.update([this.props, this.state.minWidth, this.props.pageSize, this.props.pageSizeChange, this.props.pageSizes, this.props.inputAttr]);
  };
  _proto.updateWidth = function updateWidth() {
    this.setState(__state_argument => ({
      minWidth: (0, _get_element_width.getElementMinWidth)(this.props.parentRef.current) || __state_argument.minWidth
    }));
  };
  _proto.render = function render() {
    const props = this.props;
    return viewFunction({
      props: _extends({}, props),
      width: this.width,
      restAttributes: this.restAttributes
    });
  };
  _createClass(PageSizeSmall, [{
    key: "width",
    get: function () {
      return (0, _calculate_values_fitted_width.calculateValuesFittedWidth)(this.state.minWidth, this.props.pageSizes.map(p => p.value));
    }
  }, {
    key: "restAttributes",
    get: function () {
      const _this$props = this.props,
        restProps = _objectWithoutPropertiesLoose(_this$props, _excluded);
      return restProps;
    }
  }]);
  return PageSizeSmall;
}(_inferno2.InfernoComponent);
PageSizeSmall.defaultProps = PageSizeSmallPropsType;