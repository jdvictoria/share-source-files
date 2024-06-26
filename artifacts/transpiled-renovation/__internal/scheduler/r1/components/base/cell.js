"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CellBaseDefaultProps = exports.CellBase = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _index = require("../../utils/index");
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
const CellBaseDefaultProps = exports.CellBaseDefaultProps = {
  className: '',
  isFirstGroupCell: false,
  isLastGroupCell: false,
  startDate: new Date(),
  endDate: new Date(),
  allDay: false,
  text: '',
  index: 0,
  contentTemplateProps: {
    data: {},
    index: 0
  }
};
let CellBase = exports.CellBase = /*#__PURE__*/function (_BaseInfernoComponent) {
  _inheritsLoose(CellBase, _BaseInfernoComponent);
  function CellBase() {
    return _BaseInfernoComponent.apply(this, arguments) || this;
  }
  var _proto = CellBase.prototype;
  _proto.render = function render() {
    const {
      className,
      isFirstGroupCell,
      isLastGroupCell,
      children,
      ariaLabel
    } = this.props;
    const classes = _index.renderUtils.getGroupCellClasses(isFirstGroupCell, isLastGroupCell, className);
    return (0, _inferno.createVNode)(1, "td", classes, children, 0, {
      "aria-label": ariaLabel
    });
  };
  return CellBase;
}(_inferno2.BaseInfernoComponent);
CellBase.defaultProps = CellBaseDefaultProps;