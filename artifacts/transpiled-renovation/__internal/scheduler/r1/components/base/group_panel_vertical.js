"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GroupPanelVertical = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _index = require("../../../../core/r1/utils/index");
var _index2 = require("../../utils/index");
var _group_panel_props = require("./group_panel_props");
var _group_panel_vertical_row = require("./group_panel_vertical_row");
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
let GroupPanelVertical = exports.GroupPanelVertical = /*#__PURE__*/function (_BaseInfernoComponent) {
  _inheritsLoose(GroupPanelVertical, _BaseInfernoComponent);
  function GroupPanelVertical() {
    return _BaseInfernoComponent.apply(this, arguments) || this;
  }
  var _proto = GroupPanelVertical.prototype;
  _proto.render = function render() {
    const {
      className,
      elementRef,
      groupPanelData,
      resourceCellTemplate,
      height,
      styles
    } = this.props;
    const style = (0, _inferno2.normalizeStyles)(_index2.renderUtils.addHeightToStyle(height, styles));
    const ResourceCellTemplateComponent = (0, _index.getTemplate)(resourceCellTemplate);
    return (0, _inferno.createVNode)(1, "div", className, (0, _inferno.createVNode)(1, "div", "dx-scheduler-group-flex-container", groupPanelData.groupPanelItems.map(group => (0, _inferno.createComponentVNode)(2, _group_panel_vertical_row.GroupPanelVerticalRow, {
      "groupItems": group,
      "cellTemplate": ResourceCellTemplateComponent
    }, group[0].key)), 0), 2, {
      "style": style
    }, null, elementRef);
  };
  return GroupPanelVertical;
}(_inferno2.BaseInfernoComponent);
GroupPanelVertical.defaultProps = _group_panel_props.GroupPanelBaseDefaultProps;