/**
* DevExtreme (cjs/__internal/scheduler/r1/components/base/time_panel_table.js)
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
exports.TimePanelTableDefaultProps = exports.TimePanelTable = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
var _index = require("../../../../core/r1/utils/index");
var _all_day_panel_title = require("./all_day_panel_title");
var _cell = require("./cell");
var _row = require("./row");
var _table = require("./table");
var _time_panel_cell = require("./time_panel_cell");
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
const TimePanelTableDefaultProps = exports.TimePanelTableDefaultProps = {
  timePanelData: {
    groupedData: [],
    leftVirtualCellCount: 0,
    rightVirtualCellCount: 0,
    topVirtualRowCount: 0,
    bottomVirtualRowCount: 0
  }
};
let TimePanelTable = exports.TimePanelTable = /*#__PURE__*/function (_InfernoWrapperCompon) {
  _inheritsLoose(TimePanelTable, _InfernoWrapperCompon);
  function TimePanelTable() {
    return _InfernoWrapperCompon.apply(this, arguments) || this;
  }
  var _proto = TimePanelTable.prototype;
  _proto.createEffects = function createEffects() {
    return [(0, _inferno2.createReRenderEffect)()];
  };
  _proto.render = function render() {
    const _a = this.props,
      {
        timePanelData,
        tableRef,
        timeCellTemplate
      } = _a,
      restProps = __rest(_a, ["timePanelData", "tableRef", "timeCellTemplate"]);
    const {
      topVirtualRowHeight,
      bottomVirtualRowHeight
    } = timePanelData;
    const TimeCellTemplateComponent = (0, _index.getTemplate)(timeCellTemplate);
    return (0, _inferno.normalizeProps)((0, _inferno.createComponentVNode)(2, _table.Table, _extends({}, restProps, {
      "className": "dx-scheduler-time-panel",
      "topVirtualRowHeight": topVirtualRowHeight !== null && topVirtualRowHeight !== void 0 ? topVirtualRowHeight : 0,
      "bottomVirtualRowHeight": bottomVirtualRowHeight !== null && bottomVirtualRowHeight !== void 0 ? bottomVirtualRowHeight : 0,
      "virtualCellsCount": 1,
      "tableRef": tableRef,
      children: timePanelData.groupedData.map(_ref => {
        let {
          dateTable,
          groupIndex,
          isGroupedAllDayPanel,
          key: fragmentKey
        } = _ref;
        return (0, _inferno.createFragment)([isGroupedAllDayPanel && (0, _inferno.createComponentVNode)(2, _row.Row, {
          "leftVirtualCellWidth": _row.RowDefaultProps.leftVirtualCellWidth,
          "rightVirtualCellWidth": _row.RowDefaultProps.rightVirtualCellWidth,
          children: (0, _inferno.createComponentVNode)(2, _cell.CellBase, {
            "className": "dx-scheduler-time-panel-title-cell",
            "startDate": _cell.CellBaseDefaultProps.startDate,
            "endDate": _cell.CellBaseDefaultProps.endDate,
            "index": _cell.CellBaseDefaultProps.index,
            children: (0, _inferno.createComponentVNode)(2, _all_day_panel_title.AllDayPanelTitle)
          })
        }), dateTable.map(_ref2 => {
          let {
            groups,
            highlighted,
            index: cellIndex,
            isFirstGroupCell,
            isLastGroupCell,
            key,
            startDate,
            text
          } = _ref2;
          return (0, _inferno.createComponentVNode)(2, _row.Row, {
            "className": "dx-scheduler-time-panel-row",
            "leftVirtualCellWidth": _row.RowDefaultProps.leftVirtualCellWidth,
            "rightVirtualCellWidth": _row.RowDefaultProps.rightVirtualCellWidth,
            children: (0, _inferno.createComponentVNode)(2, _time_panel_cell.TimePanelCell, {
              "startDate": startDate,
              "endDate": _cell.CellBaseDefaultProps.endDate,
              "text": text,
              "groups": groups,
              "groupIndex": groupIndex,
              "isFirstGroupCell": isFirstGroupCell,
              "isLastGroupCell": isLastGroupCell,
              "index": cellIndex,
              "timeCellTemplate": TimeCellTemplateComponent,
              "highlighted": highlighted
            })
          }, key);
        })], 0, fragmentKey);
      })
    })));
  };
  return TimePanelTable;
}(_inferno2.InfernoWrapperComponent);
TimePanelTable.defaultProps = TimePanelTableDefaultProps;
