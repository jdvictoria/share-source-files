/**
* DevExtreme (cjs/__internal/scheduler/r1/components/base/group_panel_props.js)
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
exports.GroupPanelRowDefaultProps = exports.GroupPanelCellDefaultProps = exports.GroupPanelBaseDefaultProps = void 0;
const GroupPanelBaseDefaultProps = exports.GroupPanelBaseDefaultProps = {
  groupPanelData: {
    groupPanelItems: [],
    baseColSpan: 1
  },
  groupByDate: false,
  styles: {}
};
const GroupPanelCellDefaultProps = exports.GroupPanelCellDefaultProps = {
  id: 0,
  text: '',
  data: {
    id: 0
  },
  className: ''
};
const GroupPanelRowDefaultProps = exports.GroupPanelRowDefaultProps = {
  groupItems: [],
  className: ''
};
