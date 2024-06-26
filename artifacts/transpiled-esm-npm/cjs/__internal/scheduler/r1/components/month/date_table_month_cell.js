"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DateTableMonthCell = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _index = require("../../../../core/r1/utils/index");
var _index2 = require("../../utils/index");
var _date_table_cell_base = require("../base/date_table_cell_base");
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
let DateTableMonthCell = exports.DateTableMonthCell = /*#__PURE__*/function (_BaseInfernoComponent) {
  _inheritsLoose(DateTableMonthCell, _BaseInfernoComponent);
  function DateTableMonthCell() {
    var _this;
    _this = _BaseInfernoComponent.apply(this, arguments) || this;
    _this.contentTemplateProps = null;
    return _this;
  }
  var _proto = DateTableMonthCell.prototype;
  _proto.getContentTemplateProps = function getContentTemplateProps() {
    if (this.contentTemplateProps !== null) {
      return this.contentTemplateProps;
    }
    const {
      index,
      text
    } = this.props;
    this.contentTemplateProps = {
      data: {
        text
      },
      index
    };
    return this.contentTemplateProps;
  };
  _proto.componentWillUpdate = function componentWillUpdate(nextProps) {
    if (this.props.index !== nextProps.index || this.props.text !== nextProps.text) {
      this.contentTemplateProps = null;
    }
  };
  _proto.render = function render() {
    const {
      dataCellTemplate,
      endDate,
      groupIndex,
      groups,
      index,
      isFirstGroupCell,
      isFocused,
      isLastGroupCell,
      isSelected,
      startDate,
      text,
      className,
      firstDayOfMonth,
      otherMonth,
      today
    } = this.props;
    const classes = _index2.renderUtils.combineClasses({
      'dx-scheduler-date-table-other-month': !!otherMonth,
      'dx-scheduler-date-table-current-date': !!today,
      'dx-scheduler-date-table-first-of-month': !!firstDayOfMonth,
      [className !== null && className !== void 0 ? className : '']: !!className
    });
    const contentTemplateProps = this.getContentTemplateProps();
    const DataCellTemplateComponent = (0, _index.getTemplate)(dataCellTemplate);
    return (0, _inferno.createComponentVNode)(2, _date_table_cell_base.DateTableCellBase, {
      "className": classes,
      "dataCellTemplate": DataCellTemplateComponent,
      "startDate": startDate,
      "endDate": endDate,
      "text": text,
      "groups": groups,
      "groupIndex": groupIndex,
      "index": index,
      "isFirstGroupCell": isFirstGroupCell,
      "isLastGroupCell": isLastGroupCell,
      "isSelected": isSelected,
      "isFocused": isFocused,
      "contentTemplateProps": contentTemplateProps,
      children: (0, _inferno.createVNode)(1, "div", "dx-scheduler-date-table-cell-text", text, 0)
    });
  };
  return DateTableMonthCell;
}(_inferno2.BaseInfernoComponent);
DateTableMonthCell.defaultProps = _date_table_cell_base.DateTableCallBaseDefaultProps;