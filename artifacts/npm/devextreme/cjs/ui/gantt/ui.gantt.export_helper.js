/**
* DevExtreme (cjs/ui/gantt/ui.gantt.export_helper.js)
* Version: 24.1.1
* Build date: Tue May 07 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.GanttExportHelper = void 0;
var _window = require("../../core/utils/window");
var _uiGrid_core = _interopRequireDefault(require("../grid_core/ui.grid_core.utils"));
var _type = require("../../core/utils/type");
var _date = _interopRequireDefault(require("../../localization/date"));
var _number = _interopRequireDefault(require("../../localization/number"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const window = (0, _window.getWindow)();
const TREELIST_EMPTY_SPACE = 'dx-treelist-empty-space';
const TREELIST_TABLE = 'dx-treelist-table';
let GanttExportHelper = exports.GanttExportHelper = /*#__PURE__*/function () {
  function GanttExportHelper(gantt) {
    this._gantt = gantt;
    this._treeList = gantt._treeList;
    this._cache = {};
  }
  var _proto = GanttExportHelper.prototype;
  _proto.reset = function reset() {
    this._cache = {};
  };
  _proto.getTreeListTableStyle = function getTreeListTableStyle() {
    const table = this._getTreeListTable();
    const style = window.getComputedStyle(table);
    return {
      color: style.color,
      backgroundColor: style.backgroundColor,
      fontSize: style.fontSize,
      fontFamily: style.fontFamily,
      fontWeight: style.fontWeight,
      fontStyle: style.fontStyle,
      textAlign: 'left',
      verticalAlign: 'middle'
    };
  };
  _proto.getTreeListColCount = function getTreeListColCount() {
    const headerView = this._getHeaderView();
    const widths = headerView.getColumnWidths().filter(w => w > 0);
    return widths.length;
  };
  _proto.getTreeListHeaderInfo = function getTreeListHeaderInfo(colIndex) {
    const element = this._getHeaderElement(colIndex);
    if (!element) return null;
    const style = window.getComputedStyle(element);
    const styleForExport = {
      color: style.color,
      padding: style.padding,
      paddingLeft: style.paddingLeft,
      paddingTop: style.paddingTop,
      paddingRight: style.paddingRight,
      paddingBottom: style.paddingBottom,
      verticalAlign: style.verticalAlign,
      width: this._getColumnWidth(colIndex)
    };
    return {
      content: element.textContent,
      styles: styleForExport
    };
  };
  _proto.getTreeListCellInfo = function getTreeListCellInfo(key, colIndex) {
    var _cell$textContent;
    const node = this._treeList.getNodeByKey(key);
    const visibleRowIndex = this._treeList.getRowIndexByKey(key);
    const cell = visibleRowIndex > -1 ? this._getDataCell(visibleRowIndex, colIndex) : null;
    const style = cell ? window.getComputedStyle(cell) : this._getColumnCellStyle(colIndex);
    const styleForExport = {
      color: style.color,
      padding: style.padding,
      paddingLeft: style.paddingLeft,
      paddingTop: style.paddingTop,
      paddingRight: style.paddingRight,
      paddingBottom: style.paddingBottom,
      width: this._getColumnWidth(colIndex)
    };
    if (colIndex === 0) {
      styleForExport.extraLeftPadding = this._getEmptySpaceWidth(node.level);
    }
    return {
      content: (_cell$textContent = cell === null || cell === void 0 ? void 0 : cell.textContent) !== null && _cell$textContent !== void 0 ? _cell$textContent : this._getDisplayText(key, colIndex),
      styles: styleForExport
    };
  };
  _proto.getTreeListEmptyDataCellInfo = function getTreeListEmptyDataCellInfo() {
    return {
      content: this._treeList.option('noDataText')
    };
  };
  _proto._ensureColumnWidthCache = function _ensureColumnWidthCache(colIndex) {
    var _this$_cache, _columnWidths, _this$_cache$_columnW;
    (_this$_cache$_columnW = (_this$_cache = this._cache)[_columnWidths = 'columnWidths']) !== null && _this$_cache$_columnW !== void 0 ? _this$_cache$_columnW : _this$_cache[_columnWidths] = {};
    if (!this._cache['columnWidths'][colIndex]) {
      var _header$clientWidth;
      const header = this._getHeaderElement(colIndex);
      this._cache['columnWidths'][colIndex] = (_header$clientWidth = header === null || header === void 0 ? void 0 : header.clientWidth) !== null && _header$clientWidth !== void 0 ? _header$clientWidth : 0;
    }
  };
  _proto._getColumnWidth = function _getColumnWidth(colIndex) {
    this._ensureColumnWidthCache(colIndex);
    const widths = this._cache['columnWidths'];
    return widths && widths[colIndex];
  };
  _proto._getEmptySpaceWidth = function _getEmptySpaceWidth(level) {
    if (!this._cache['emptyWidth']) {
      var _this$_cache2, _emptyWidth, _this$_cache2$_emptyW, _element$offsetWidth;
      const element = this._getTreeListElement(TREELIST_EMPTY_SPACE);
      (_this$_cache2$_emptyW = (_this$_cache2 = this._cache)[_emptyWidth = 'emptyWidth']) !== null && _this$_cache2$_emptyW !== void 0 ? _this$_cache2$_emptyW : _this$_cache2[_emptyWidth] = (_element$offsetWidth = element.offsetWidth) !== null && _element$offsetWidth !== void 0 ? _element$offsetWidth : 0;
    }
    return this._cache['emptyWidth'] * (level + 1);
  };
  _proto._getColumnCellStyle = function _getColumnCellStyle(colIndex) {
    this._ensureColumnCellStyleCache(colIndex);
    return this._cache['columnStyles'][colIndex];
  };
  _proto._ensureColumnCellStyleCache = function _ensureColumnCellStyleCache(colIndex) {
    var _this$_cache3, _columnStyles, _this$_cache3$_column;
    (_this$_cache3$_column = (_this$_cache3 = this._cache)[_columnStyles = 'columnStyles']) !== null && _this$_cache3$_column !== void 0 ? _this$_cache3$_column : _this$_cache3[_columnStyles] = {};
    if (!this._cache['columnStyles'][colIndex]) {
      const cell = this._getDataCell(0, colIndex);
      this._cache['columnStyles'][colIndex] = window.getComputedStyle(cell);
    }
  };
  _proto._getTask = function _getTask(key) {
    this._ensureTaskCache(key);
    return this._cache['tasks'][key];
  };
  _proto._ensureTaskCache = function _ensureTaskCache(key) {
    var _this$_cache4, _tasks, _this$_cache4$_tasks, _this$_cache$tasks, _this$_cache$tasks$ke;
    (_this$_cache4$_tasks = (_this$_cache4 = this._cache)[_tasks = 'tasks']) !== null && _this$_cache4$_tasks !== void 0 ? _this$_cache4$_tasks : _this$_cache4[_tasks] = {};
    (_this$_cache$tasks$ke = (_this$_cache$tasks = this._cache['tasks'])[key]) !== null && _this$_cache$tasks$ke !== void 0 ? _this$_cache$tasks$ke : _this$_cache$tasks[key] = this._gantt._findTaskByKey(key);
  };
  _proto._getTreeListTable = function _getTreeListTable() {
    return this._getTreeListElement(TREELIST_TABLE);
  };
  _proto._getTreeListElement = function _getTreeListElement(className) {
    return this._treeList._$element.find('.' + className).get(0);
  };
  _proto._getDataCell = function _getDataCell(rowIndex, colIndex) {
    const treeList = this._treeList;
    const cellElement = treeList.getCellElement(rowIndex, colIndex);
    return cellElement && cellElement.length ? cellElement[0] : cellElement;
  };
  _proto._getHeaderElement = function _getHeaderElement(index) {
    return this._getHeaderView().getHeaderElement(index).get(0);
  };
  _proto._getHeaderView = function _getHeaderView() {
    return this._treeList._views.columnHeadersView;
  };
  _proto._getDisplayText = function _getDisplayText(key, colIndex) {
    const task = this._getTask(key);
    return task && this._getGridDisplayText(colIndex, task);
  };
  _proto._getGridDisplayText = function _getGridDisplayText(colIndex, data) {
    const columns = this._treeList.getController('columns').getColumns();
    const column = columns[colIndex];
    const field = column === null || column === void 0 ? void 0 : column.dataField;
    const format = column === null || column === void 0 ? void 0 : column.format;
    const value = _uiGrid_core.default.getDisplayValue(column, data[field], data, 'data');
    if ((0, _type.isDefined)(format)) {
      if ((column === null || column === void 0 ? void 0 : column.dataType) === 'date' || (column === null || column === void 0 ? void 0 : column.dataType) === 'datetime') {
        const date = (0, _type.isDate)(value) ? value : new Date(value);
        return _date.default.format(date, format);
      }
      if ((0, _type.isNumeric)(value)) {
        return _number.default.format(value, format);
      }
    }
    return typeof value === 'string' ? value : value === null || value === void 0 ? void 0 : value.toString();
  };
  return GanttExportHelper;
}();
