"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VirtualRowDefaultProps = exports.VirtualRow = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _index = require("../../utils/index");
var _row = require("./row");
var _virtual_cell = require("./virtual_cell");
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const VirtualRowDefaultProps = exports.VirtualRowDefaultProps = _extends(_extends({}, _row.RowDefaultProps), {
  leftVirtualCellWidth: 0,
  rightVirtualCellWidth: 0,
  cellsCount: 1
});
let VirtualRow = exports.VirtualRow = /*#__PURE__*/function (_BaseInfernoComponent) {
  _inheritsLoose(VirtualRow, _BaseInfernoComponent);
  function VirtualRow() {
    var _this;
    _this = _BaseInfernoComponent.apply(this, arguments) || this;
    _this.virtualCells = null;
    return _this;
  }
  var _proto = VirtualRow.prototype;
  _proto.getVirtualCells = function getVirtualCells() {
    if (this.virtualCells !== null) {
      return this.virtualCells;
    }
    const {
      cellsCount
    } = this.props;
    this.virtualCells = [...Array(cellsCount)];
    return this.virtualCells;
  };
  _proto.componentWillUpdate = function componentWillUpdate(nextProps) {
    if (this.props.cellsCount !== nextProps.cellsCount) {
      this.virtualCells = null;
    }
  };
  _proto.render = function render() {
    const {
      className,
      leftVirtualCellCount,
      leftVirtualCellWidth,
      rightVirtualCellCount,
      rightVirtualCellWidth,
      styles,
      height
    } = this.props;
    const classes = "dx-scheduler-virtual-row ".concat(className);
    const modifiedStyles = _index.renderUtils.addHeightToStyle(height, styles);
    const virtualCells = this.getVirtualCells();
    return (0, _inferno.createComponentVNode)(2, _row.Row, {
      "className": classes,
      "styles": modifiedStyles,
      "leftVirtualCellWidth": leftVirtualCellWidth,
      "rightVirtualCellWidth": rightVirtualCellWidth,
      "leftVirtualCellCount": leftVirtualCellCount,
      "rightVirtualCellCount": rightVirtualCellCount,
      children: virtualCells.map((_, index) => (0, _inferno.createComponentVNode)(2, _virtual_cell.VirtualCell, {
        "width": _virtual_cell.VirtualCellDefaultProps.width,
        "isHeaderCell": _virtual_cell.VirtualCellDefaultProps.isHeaderCell
      }, index.toString()))
    });
  };
  return VirtualRow;
}(_inferno2.BaseInfernoComponent);
VirtualRow.defaultProps = VirtualRowDefaultProps;