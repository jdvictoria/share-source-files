"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DateTableMonth = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _index = require("../../../../core/r1/utils/index");
var _date_table = require("../base/date_table");
var _date_table_month_cell = require("./date_table_month_cell");
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
var __rest = void 0 && (void 0).__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
let DateTableMonth = exports.DateTableMonth = /*#__PURE__*/function (_InfernoWrapperCompon) {
  _inheritsLoose(DateTableMonth, _InfernoWrapperCompon);
  function DateTableMonth() {
    return _InfernoWrapperCompon.apply(this, arguments) || this;
  }
  var _proto = DateTableMonth.prototype;
  _proto.createEffects = function createEffects() {
    return [(0, _inferno2.createReRenderEffect)()];
  };
  _proto.render = function render() {
    const _a = this.props,
      {
        addDateTableClass,
        addVerticalSizesClassToRows,
        dataCellTemplate,
        groupOrientation,
        tableRef,
        viewData,
        width
      } = _a,
      restProps = __rest(_a, ["addDateTableClass", "addVerticalSizesClassToRows", "dataCellTemplate", "groupOrientation", "tableRef", "viewData", "width"]);
    const DataCellTemplateComponent = (0, _index.getTemplate)(dataCellTemplate);
    return (0, _inferno.normalizeProps)((0, _inferno.createComponentVNode)(2, _date_table.DateTable, _extends({}, restProps, {
      "viewData": viewData,
      "groupOrientation": groupOrientation,
      "addDateTableClass": addDateTableClass,
      "dataCellTemplate": DataCellTemplateComponent,
      "cellTemplate": _date_table_month_cell.DateTableMonthCell,
      "tableRef": tableRef,
      "addVerticalSizesClassToRows": addVerticalSizesClassToRows,
      "width": width
    })));
  };
  return DateTableMonth;
}(_inferno2.InfernoWrapperComponent);
DateTableMonth.defaultProps = _date_table.DateTableDefaultProps;