"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VirtualCellDefaultProps = exports.VirtualCell = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _index = require("../../utils/index");
var _header_cell = require("./header_cell");
var _ordinary_cell = require("./ordinary_cell");
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
const VirtualCellDefaultProps = exports.VirtualCellDefaultProps = {
  width: 0,
  isHeaderCell: false
};
let VirtualCell = exports.VirtualCell = /*#__PURE__*/function (_BaseInfernoComponent) {
  _inheritsLoose(VirtualCell, _BaseInfernoComponent);
  function VirtualCell() {
    return _BaseInfernoComponent.apply(this, arguments) || this;
  }
  var _proto = VirtualCell.prototype;
  _proto.render = function render() {
    const {
      colSpan,
      isHeaderCell,
      width,
      styles
    } = this.props;
    const modifiedStyles = _index.renderUtils.addWidthToStyle(width, styles);
    const Cell = isHeaderCell ? _header_cell.HeaderCell : _ordinary_cell.OrdinaryCell;
    return (0, _inferno.createComponentVNode)(2, Cell, {
      "className": "dx-scheduler-virtual-cell",
      "styles": modifiedStyles,
      "colSpan": colSpan
    });
  };
  return VirtualCell;
}(_inferno2.BaseInfernoComponent);
VirtualCell.defaultProps = VirtualCellDefaultProps;