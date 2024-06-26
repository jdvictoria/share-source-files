"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GroupPanelHorizontal = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _index = require("../../../../core/r1/utils/index");
var _group_panel_horizontal_row = require("./group_panel_horizontal_row");
var _group_panel_props = require("./group_panel_props");
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
let GroupPanelHorizontal = exports.GroupPanelHorizontal = /*#__PURE__*/function (_BaseInfernoComponent) {
  _inheritsLoose(GroupPanelHorizontal, _BaseInfernoComponent);
  function GroupPanelHorizontal() {
    var _this;
    _this = _BaseInfernoComponent.apply(this, arguments) || this;
    _this._groupPanelItems = null;
    return _this;
  }
  var _proto = GroupPanelHorizontal.prototype;
  _proto.getGroupPanelItems = function getGroupPanelItems() {
    if (this._groupPanelItems !== null) {
      return this._groupPanelItems;
    }
    const {
      groupPanelData: {
        baseColSpan,
        groupPanelItems
      }
    } = this.props;
    const colSpans = groupPanelItems.reduceRight((currentColSpans, groupsRow, idx) => {
      const nextColSpans = currentColSpans;
      const currentLevelGroupCount = groupsRow.length;
      const previousColSpan = idx === groupPanelItems.length - 1 ? baseColSpan : currentColSpans[idx + 1];
      const previousLevelGroupCount = idx === groupPanelItems.length - 1 ? currentLevelGroupCount : groupPanelItems[idx + 1].length;
      const groupCountDiff = previousLevelGroupCount / currentLevelGroupCount;
      nextColSpans[idx] = groupCountDiff * previousColSpan;
      return nextColSpans;
    }, [...new Array(groupPanelItems.length)]);
    this._groupPanelItems = groupPanelItems.map((groupsRenderRow, index) => {
      const colSpan = colSpans[index];
      return groupsRenderRow.map(groupItem => _extends(_extends({}, groupItem), {
        colSpan
      }));
    });
    return this._groupPanelItems;
  };
  _proto.componentWillUpdate = function componentWillUpdate(nextProps) {
    if (this.props.groupPanelData !== nextProps.groupPanelData) {
      this._groupPanelItems = null;
    }
  };
  _proto.render = function render() {
    const {
      resourceCellTemplate
    } = this.props;
    const groupPanelItems = this.getGroupPanelItems();
    const ResourceCellTemplateComponent = (0, _index.getTemplate)(resourceCellTemplate);
    return (0, _inferno.createFragment)(groupPanelItems.map(group => (0, _inferno.createComponentVNode)(2, _group_panel_horizontal_row.GroupPanelHorizontalRow, {
      "groupItems": group,
      "cellTemplate": ResourceCellTemplateComponent
    }, group[0].key)), 0);
  };
  return GroupPanelHorizontal;
}(_inferno2.BaseInfernoComponent);
GroupPanelHorizontal.defaultProps = _group_panel_props.GroupPanelBaseDefaultProps;