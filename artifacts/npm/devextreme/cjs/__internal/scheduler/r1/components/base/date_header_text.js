/**
* DevExtreme (cjs/__internal/scheduler/r1/components/base/date_header_text.js)
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
exports.DateHeaderText = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
const DateHeaderTextDefaultProps = {
  text: '',
  splitText: false
};
let DateHeaderText = exports.DateHeaderText = /*#__PURE__*/function (_BaseInfernoComponent) {
  _inheritsLoose(DateHeaderText, _BaseInfernoComponent);
  function DateHeaderText() {
    var _this;
    _this = _BaseInfernoComponent.apply(this, arguments) || this;
    _this._textCache = null;
    return _this;
  }
  var _proto = DateHeaderText.prototype;
  _proto.getTextParts = function getTextParts() {
    if (this._textCache !== null) {
      return this._textCache;
    }
    const {
      text
    } = this.props;
    this._textCache = text ? text.split(' ') : [''];
    return this._textCache;
  };
  _proto.componentWillUpdate = function componentWillUpdate(nextProps) {
    if (this.props.text !== nextProps.text) {
      this._textCache = null;
    }
  };
  _proto.render = function render() {
    const {
      splitText,
      text
    } = this.props;
    const textParts = this.getTextParts();
    return (0, _inferno.createFragment)(splitText ? textParts.map(part => (0, _inferno.createVNode)(1, "div", "dx-scheduler-header-panel-cell-date", (0, _inferno.createVNode)(1, "span", null, part, 0), 2)) : text, 0);
  };
  return DateHeaderText;
}(_inferno2.BaseInfernoComponent);
DateHeaderText.defaultProps = DateHeaderTextDefaultProps;
