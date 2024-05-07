/**
* DevExtreme (cjs/__internal/grids/grid_core/views/m_rows_view.js)
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
exports.rowsModule = exports.RowsView = void 0;
var _renderer = _interopRequireDefault(require("../../../../core/renderer"));
var _browser = _interopRequireDefault(require("../../../../core/utils/browser"));
var _common = require("../../../../core/utils/common");
var _data = require("../../../../core/utils/data");
var _extend = require("../../../../core/utils/extend");
var _iterator = require("../../../../core/utils/iterator");
var _position = require("../../../../core/utils/position");
var _size = require("../../../../core/utils/size");
var _string = require("../../../../core/utils/string");
var _style = require("../../../../core/utils/style");
var _type = require("../../../../core/utils/type");
var _window = require("../../../../core/utils/window");
var _events_engine = _interopRequireDefault(require("../../../../events/core/events_engine"));
var _remove = require("../../../../events/remove");
var _message = _interopRequireDefault(require("../../../../localization/message"));
var _ui = _interopRequireDefault(require("../../../../ui/scroll_view/ui.scrollable"));
var _m_utils = _interopRequireDefault(require("../m_utils"));
var _m_columns_view = require("./m_columns_view");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
const ROWS_VIEW_CLASS = 'rowsview';
const CONTENT_CLASS = 'content';
const NOWRAP_CLASS = 'nowrap';
const GROUP_ROW_CLASS = 'dx-group-row';
const GROUP_CELL_CLASS = 'dx-group-cell';
const DATA_ROW_CLASS = 'dx-data-row';
const FREE_SPACE_CLASS = 'dx-freespace-row';
const ROW_LINES_CLASS = 'dx-row-lines';
const COLUMN_LINES_CLASS = 'dx-column-lines';
const ROW_ALTERNATION_CLASS = 'dx-row-alt';
const LAST_ROW_BORDER = 'dx-last-row-border';
const EMPTY_CLASS = 'dx-empty';
const ROW_INSERTED_ANIMATION_CLASS = 'row-inserted-animation';
const LOADPANEL_HIDE_TIMEOUT = 200;
function getMaxHorizontalScrollOffset(scrollable) {
  return scrollable ? Math.round(scrollable.scrollWidth() - scrollable.clientWidth()) : 0;
}
function isGroupRow(_ref) {
  let {
    rowType,
    column
  } = _ref;
  return rowType === 'group' && (0, _type.isDefined)(column.groupIndex) && !column.showWhenGrouped && !column.command;
}
function setWatcher(_ref2) {
  let {
    element,
    watch,
    getter,
    callBack
  } = _ref2;
  if (watch) {
    const dispose = watch(getter, callBack);
    _events_engine.default.on(element, _remove.removeEvent, dispose);
  }
}
const defaultCellTemplate = function ($container, options) {
  const isDataTextEmpty = (0, _string.isEmpty)(options.text) && options.rowType === 'data';
  const {
    text
  } = options;
  const container = $container.get(0);
  if (isDataTextEmpty) {
    _m_utils.default.setEmptyText($container);
  } else if (options.column.encodeHtml) {
    container.textContent = text;
  } else {
    container.innerHTML = text;
  }
};
const getScrollableBottomPadding = function (that) {
  const scrollable = that.getScrollable();
  // @ts-expect-error
  return scrollable ? Math.ceil(parseFloat((0, _renderer.default)(scrollable.content()).css('paddingBottom'))) : 0;
};
let RowsView = exports.RowsView = /*#__PURE__*/function (_ColumnsView) {
  _inheritsLoose(RowsView, _ColumnsView);
  function RowsView() {
    return _ColumnsView.apply(this, arguments) || this;
  }
  var _proto = RowsView.prototype;
  _proto.init = function init() {
    _ColumnsView.prototype.init.call(this);
    this._editingController = this.getController('editing');
    this._resizingController = this.getController('resizing');
    this._columnsResizerController = this.getController('columnsResizer');
    this._focusController = this.getController('focus');
    this._keyboardNavigationController = this.getController('keyboardNavigation');
    this._validatingController = this.getController('validating');
    this._errorHandlingController = this.getController('errorHandling');
    this._columnHeadersView = this.getView('columnHeadersView');
    this._rowHeight = 0;
    this._scrollTop = 0;
    this._scrollLeft = -1;
    this._scrollRight = 0;
    this._hasHeight = undefined;
    this._contentChanges = [];
    this._dataController.loadingChanged.add((isLoading, messageText) => {
      this.setLoading(isLoading, messageText);
    });
    this._dataController.dataSourceChanged.add(() => {
      if (this._scrollLeft >= 0 && !this._dataController.isLoading()) {
        this._handleScroll({
          component: this.getScrollable(),
          forceUpdateScrollPosition: true,
          scrollOffset: {
            top: this._scrollTop,
            left: this._scrollLeft
          }
        });
      }
    });
  };
  _proto._getDefaultTemplate = function _getDefaultTemplate(column) {
    switch (column.command) {
      case 'empty':
        return function (container) {
          container.html('&nbsp;');
        };
      default:
        return defaultCellTemplate;
    }
  };
  _proto._getDefaultGroupTemplate = function _getDefaultGroupTemplate(column) {
    const that = this;
    const summaryTexts = that.option('summary.texts');
    return function ($container, options) {
      const {
        data
      } = options;
      let text = "".concat(options.column.caption, ": ").concat(options.text);
      const container = $container.get(0);
      if (options.summaryItems && options.summaryItems.length) {
        text += " ".concat(_m_utils.default.getGroupRowSummaryText(options.summaryItems, summaryTexts));
      }
      if (data) {
        if (options.groupContinuedMessage && options.groupContinuesMessage) {
          text += " (".concat(options.groupContinuedMessage, ". ").concat(options.groupContinuesMessage, ")");
        } else if (options.groupContinuesMessage) {
          text += " (".concat(options.groupContinuesMessage, ")");
        } else if (options.groupContinuedMessage) {
          text += " (".concat(options.groupContinuedMessage, ")");
        }
      }
      if (column.encodeHtml) {
        container.textContent = text;
      } else {
        container.innerHTML = text;
      }
    };
  }
  /**
   * @extended: editing_row_based, focus, selection
   */;
  _proto._update = function _update(change) {}
  /**
   * @extended: editing_form_based, search
   */;
  _proto._updateCell = function _updateCell($cell, options) {
    if (isGroupRow(options)) {
      $cell.addClass(GROUP_CELL_CLASS);
    }
    _ColumnsView.prototype._updateCell.apply(this, arguments);
  }
  /**
   * @extended: adaptivity, editing, master_detail
   */;
  _proto._getCellTemplate = function _getCellTemplate(options) {
    const that = this;
    const {
      column
    } = options;
    let template;
    if (isGroupRow(options)) {
      template = column.groupCellTemplate || {
        allowRenderToDetachedContainer: true,
        render: that._getDefaultGroupTemplate(column)
      };
    } else if ((options.rowType === 'data' || column.command) && column.cellTemplate) {
      template = column.cellTemplate;
    } else {
      template = {
        allowRenderToDetachedContainer: true,
        render: that._getDefaultTemplate(column)
      };
    }
    return template;
  }
  /**
   * @extended: adaptivity, editing, editing_row_based, focus, master_detail
   */;
  _proto._createRow = function _createRow(row, tag) {
    const $row = _ColumnsView.prototype._createRow.apply(this, arguments);
    if (row) {
      const isGroup = row.rowType === 'group';
      const isDataRow = row.rowType === 'data';
      isDataRow && $row.addClass(DATA_ROW_CLASS);
      isDataRow && this.option('showRowLines') && $row.addClass(ROW_LINES_CLASS);
      this.option('showColumnLines') && $row.addClass(COLUMN_LINES_CLASS);
      if (row.visible === false) {
        $row.hide();
      }
      if (isGroup) {
        $row.addClass(GROUP_ROW_CLASS);
        this.setAriaExpandedAttribute($row, row);
      }
    }
    return $row;
  };
  _proto._rowPrepared = function _rowPrepared($row, rowOptions, row) {
    if (rowOptions.rowType === 'data') {
      if (this.option('rowAlternationEnabled')) {
        this._isAltRow(row) && $row.addClass(ROW_ALTERNATION_CLASS);
        setWatcher({
          element: $row.get(0),
          watch: rowOptions.watch,
          getter: () => this._isAltRow(row),
          callBack: value => {
            $row.toggleClass(ROW_ALTERNATION_CLASS, value);
          }
        });
      }
      this._setAriaRowIndex(rowOptions, $row);
      setWatcher({
        element: $row.get(0),
        watch: rowOptions.watch,
        getter: () => rowOptions.rowIndex,
        callBack: () => this._setAriaRowIndex(rowOptions, $row)
      });
    }
    _ColumnsView.prototype._rowPrepared.apply(this, arguments);
  };
  _proto._setAriaRowIndex = function _setAriaRowIndex(row, $row) {
    if (!$row.is('tr')) {
      return;
    }
    const {
      component
    } = this;
    const isPagerMode = component.option('scrolling.mode') === 'standard' && !_m_utils.default.isVirtualRowRendering(component);
    let rowIndex = row.rowIndex + 1;
    if (isPagerMode) {
      rowIndex = component.pageIndex() * component.pageSize() + rowIndex;
    } else {
      rowIndex += this._dataController.getRowIndexOffset();
    }
    this.setAria('rowindex', rowIndex, $row);
  };
  _proto.setAriaExpandedAttribute = function setAriaExpandedAttribute($row, row) {
    const description = row.isExpanded ? this.localize('dxDataGrid-ariaExpandedRow') : this.localize('dxDataGrid-ariaCollapsedRow');
    this.setAria('roledescription', description, $row);
  }
  /**
   * @extended: column_fixing
   */;
  _proto._afterRowPrepared = function _afterRowPrepared(e) {
    const arg = e.args[0];
    const dataController = this._dataController;
    const row = dataController.getVisibleRows()[arg.rowIndex];
    const watch = this.option('integrationOptions.watchMethod');
    if (!arg.data || arg.rowType !== 'data' || arg.isNewRow || !this.option('twoWayBindingEnabled') || !watch || !row) return;
    const dispose = watch(() => dataController.generateDataValues(arg.data, arg.columns), () => {
      dataController.repaintRows([row.rowIndex], this.option('repaintChangesOnly'));
    }, {
      deep: true,
      skipImmediate: true
    });
    _events_engine.default.on(arg.rowElement, _remove.removeEvent, dispose);
  };
  _proto._renderScrollable = function _renderScrollable(force) {
    const that = this;
    const $element = that.element();
    if (!$element.children().length) {
      $element.append('<div>');
    }
    if (force || !that._loadPanel) {
      that._renderLoadPanel($element, $element.parent(), that._dataController.isLocalStore());
    }
    if ((force || !that.getScrollable()) && that._dataController.isLoaded()) {
      const columns = that.getColumns();
      let allColumnsHasWidth = true;
      for (let i = 0; i < columns.length; i++) {
        if (!columns[i].width && !columns[i].minWidth) {
          allColumnsHasWidth = false;
          break;
        }
      }
      if (that.option('columnAutoWidth') || that._hasHeight || allColumnsHasWidth || that._columnsController._isColumnFixing()) {
        that._renderScrollableCore($element);
      }
    }
  }
  /**
   * @extended: column_fixing, virtual_column, virtual_scrolling
   */;
  _proto._handleScroll = function _handleScroll(e) {
    const that = this;
    const rtlEnabled = that.option('rtlEnabled');
    const isNativeScrolling = e.component.option('useNative');
    that._scrollTop = e.scrollOffset.top;
    that._scrollLeft = e.scrollOffset.left;
    let scrollLeft = e.scrollOffset.left;
    if (rtlEnabled) {
      this._scrollRight = getMaxHorizontalScrollOffset(e.component) - this._scrollLeft;
      if (isNativeScrolling) {
        scrollLeft = -this._scrollRight;
      }
      if (!this.isScrollbarVisible(true)) {
        this._scrollLeft = -1;
      }
    }
    that.scrollChanged.fire(_extends(_extends({}, e.scrollOffset), {
      left: scrollLeft
    }), that.name);
  };
  _proto._renderScrollableCore = function _renderScrollableCore($element) {
    const that = this;
    const dxScrollableOptions = that._createScrollableOptions();
    const scrollHandler = that._handleScroll.bind(that);
    dxScrollableOptions.onScroll = scrollHandler;
    that._scrollable = that._createComponent($element, _ui.default, dxScrollableOptions);
    that._scrollableContainer = that._scrollable && (0, _renderer.default)(that._scrollable.container());
  };
  _proto._renderLoadPanel = function _renderLoadPanel() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    return _m_utils.default.renderLoadPanel.apply(this, arguments);
  }
  /**
   * @extended: column_fixing, row_dragging
   */;
  _proto._renderContent = function _renderContent(contentElement, tableElement, isFixedTableRendering) {
    contentElement.empty().append(tableElement);
    return this._findContentElement();
  }
  /**
   * @extended: editing_form_based, virtual_scrolling
   */;
  _proto._updateContent = function _updateContent(newTableElement, change, isFixedTableRendering) {
    this._contentChanges.push({
      newTableElement,
      change,
      isFixedTableRendering
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.waitAsyncTemplates().done(() => {
      const contentChanges = this._contentChanges;
      this._contentChanges = [];
      contentChanges.forEach(_ref3 => {
        let {
          newTableElement,
          change,
          isFixedTableRendering
        } = _ref3;
        const tableElement = this.getTableElement(isFixedTableRendering);
        const contentElement = this._findContentElement(isFixedTableRendering);
        const changeType = change === null || change === void 0 ? void 0 : change.changeType;
        const executors = [];
        const highlightChanges = this.option('highlightChanges');
        const rowInsertedClass = this.addWidgetPrefix(ROW_INSERTED_ANIMATION_CLASS);
        switch (changeType) {
          case 'update':
            (0, _iterator.each)(change.rowIndices, (index, rowIndex) => {
              var _a;
              const $newRowElement = this._getRowElements(newTableElement).eq(index);
              const dataChangeType = (_a = change.changeTypes) === null || _a === void 0 ? void 0 : _a[index];
              const item = change.items && change.items[index];
              executors.push(() => {
                var _a;
                const $rowElements = this._getRowElements(tableElement);
                const $rowElement = $rowElements.eq(rowIndex);
                // eslint-disable-next-line default-case
                switch (dataChangeType) {
                  case 'update':
                    if (item) {
                      const columnIndices = (_a = change.columnIndices) === null || _a === void 0 ? void 0 : _a[index];
                      if ((0, _type.isDefined)(item.visible) && item.visible !== $rowElement.is(':visible')) {
                        $rowElement.toggle(item.visible);
                      } else if (columnIndices) {
                        this._updateCells($rowElement, $newRowElement, columnIndices);
                      } else {
                        $rowElement.replaceWith($newRowElement);
                      }
                    }
                    break;
                  case 'insert':
                    if (!$rowElements.length) {
                      if (tableElement) {
                        const target = $newRowElement.is('tbody') ? tableElement : tableElement.children('tbody');
                        $newRowElement.prependTo(target);
                      }
                    } else if ($rowElement.length) {
                      $newRowElement.insertBefore($rowElement);
                    } else {
                      $newRowElement.insertAfter($rowElements.last());
                    }
                    if (highlightChanges && change.isLiveUpdate) {
                      $newRowElement.addClass(rowInsertedClass);
                    }
                    break;
                  case 'remove':
                    $rowElement.remove();
                    break;
                }
              });
            });
            (0, _iterator.each)(executors, function () {
              this();
            });
            newTableElement.remove();
            break;
          default:
            this.setTableElement(newTableElement, isFixedTableRendering);
            contentElement.addClass(this.addWidgetPrefix(CONTENT_CLASS));
            this._setGridRole(contentElement);
            this._renderContent(contentElement, newTableElement, isFixedTableRendering);
            break;
        }
      });
    }).fail(() => {
      this._contentChanges = [];
    });
  };
  _proto._getGridRoleName = function _getGridRoleName() {
    return 'grid';
  };
  _proto._setGridRole = function _setGridRole($element) {
    var _a;
    const hasData = !((_a = this._dataController) === null || _a === void 0 ? void 0 : _a.isEmpty());
    const gridRoleName = this._getGridRoleName();
    if (($element === null || $element === void 0 ? void 0 : $element.length) && hasData) {
      this.setAria('role', gridRoleName, $element);
    }
  };
  _proto._createEmptyRow = function _createEmptyRow(className, isFixed, height) {
    const that = this;
    let $cell;
    const $row = that._createRow();
    const columns = isFixed ? this.getFixedColumns() : this.getColumns();
    $row.addClass(className).toggleClass(COLUMN_LINES_CLASS, that.option('showColumnLines'));
    for (let i = 0; i < columns.length; i++) {
      $cell = that._createCell({
        column: columns[i],
        rowType: 'freeSpace',
        columnIndex: i,
        columns
      });
      (0, _type.isNumeric)(height) && $cell.css('height', height);
      $row.append($cell);
    }
    that.setAria('role', 'presentation', $row);
    return $row;
  };
  _proto.getFixedColumns = function getFixedColumns() {
    throw new Error('Method not implemented.');
  };
  _proto._appendEmptyRow = function _appendEmptyRow($table, $emptyRow, location) {
    const $tBodies = this._getBodies($table);
    const isTableContainer = !$tBodies.length || $emptyRow.is('tbody');
    const $container = isTableContainer ? $table : $tBodies;
    if (location === 'top') {
      $container.first().prepend($emptyRow);
      if (isTableContainer) {
        const $colgroup = $container.children('colgroup');
        $container.prepend($colgroup);
      }
    } else {
      $container.last().append($emptyRow);
    }
  };
  _proto._renderFreeSpaceRow = function _renderFreeSpaceRow($tableElement, change) {
    let $freeSpaceRowElement = this._createEmptyRow(FREE_SPACE_CLASS);
    $freeSpaceRowElement = this._wrapRowIfNeed($tableElement, $freeSpaceRowElement, (change === null || change === void 0 ? void 0 : change.changeType) === 'refresh');
    this._appendEmptyRow($tableElement, $freeSpaceRowElement);
  }
  /**
   * @extended: focues
   */;
  _proto._checkRowKeys = function _checkRowKeys(options) {
    const that = this;
    const rows = that._getRows(options);
    const keyExpr = that._dataController.store() && that._dataController.store().key();
    keyExpr && rows.some(row => {
      if (row.rowType === 'data' && row.key === undefined) {
        that._dataController.fireError('E1046', keyExpr);
        return true;
      }
      return undefined;
    });
  }
  /**
   * @extended: columns_resizing_reordering, virtual_scrolling
   */;
  _proto._needUpdateRowHeight = function _needUpdateRowHeight(itemsCount) {
    return itemsCount > 0 && !this._rowHeight;
  };
  _proto._getRowsHeight = function _getRowsHeight($tableElement) {
    $tableElement = $tableElement || this._tableElement;
    const $rowElements = $tableElement.children('tbody').children().not('.dx-virtual-row').not(".".concat(FREE_SPACE_CLASS));
    return $rowElements.toArray().reduce((sum, row) => sum + (0, _position.getBoundingRect)(row).height, 0);
  }
  /**
   * @extended: virtual_scrolling
   */;
  _proto._updateRowHeight = function _updateRowHeight() {
    const that = this;
    const $tableElement = that.getTableElement();
    const itemsCount = that._dataController.items().length;
    if ($tableElement && that._needUpdateRowHeight(itemsCount)) {
      const rowsHeight = that._getRowsHeight($tableElement);
      that._rowHeight = rowsHeight / itemsCount;
    }
  }
  /**
   * @extended: column_fixing
   */;
  _proto._findContentElement = function _findContentElement(isFixedTableRendering) {
    let $content = this.element();
    const scrollable = this.getScrollable();
    if ($content) {
      if (scrollable) {
        $content = (0, _renderer.default)(scrollable.content());
      }
      return $content.children().first();
    }
  }
  /**
   * @extended virtual_scrolling
   */;
  _proto._getRowElements = function _getRowElements(tableElement) {
    const $rows = _ColumnsView.prototype._getRowElements.call(this, tableElement);
    return $rows && $rows.not(".".concat(FREE_SPACE_CLASS));
  };
  _proto._getFreeSpaceRowElements = function _getFreeSpaceRowElements($table) {
    const tableElements = $table || this.getTableElements();
    return tableElements && tableElements.children('tbody').children(".".concat(FREE_SPACE_CLASS));
  };
  _proto._getNoDataText = function _getNoDataText() {
    return this.option('noDataText');
  }
  /**
   * @extended: editing, keyboard_navigation, selection
   */;
  _proto._rowClick = function _rowClick(e) {
    const item = this._dataController.items()[e.rowIndex] || {};
    this.executeAction('onRowClick', (0, _extend.extend)({
      evaluate(expr) {
        const getter = (0, _data.compileGetter)(expr);
        // @ts-expect-error
        return getter(item.data);
      }
    }, e, item));
  }
  /**
   * @extended: editing
   */;
  _proto._rowDblClick = function _rowDblClick(e) {
    const item = this._dataController.items()[e.rowIndex] || {};
    this.executeAction('onRowDblClick', (0, _extend.extend)({}, e, item));
  };
  _proto._getColumnsCountBeforeGroups = function _getColumnsCountBeforeGroups(columns) {
    for (let i = 0; i < columns.length; i++) {
      if (columns[i].type === 'groupExpand') {
        return i;
      }
    }
    return 0;
  }
  /**
   * @extended: column_fixing
   */;
  _proto._getGroupCellOptions = function _getGroupCellOptions(options) {
    const columnsCountBeforeGroups = this._getColumnsCountBeforeGroups(options.columns);
    const columnIndex = (options.row.groupIndex || 0) + columnsCountBeforeGroups;
    return {
      columnIndex,
      colspan: options.columns.length - columnIndex - 1
    };
  };
  _proto._needWrapRow = function _needWrapRow() {
    return _ColumnsView.prototype._needWrapRow.apply(this, arguments) || !!this.option('dataRowTemplate');
  }
  /**
   * @extended: adaptivity, master_details
   */;
  _proto._renderCells = function _renderCells($row, options) {
    if (options.row.rowType === 'group') {
      this._renderGroupedCells($row, options);
    } else if (options.row.values) {
      _ColumnsView.prototype._renderCells.call(this, $row, options);
    }
  }
  /**
   * @extended: column_fixing
   */;
  _proto._renderGroupedCells = function _renderGroupedCells($row, options) {
    const {
      row
    } = options;
    let expandColumn;
    const {
      columns
    } = options;
    const {
      rowIndex
    } = row;
    let isExpanded;
    const groupCellOptions = this._getGroupCellOptions(options);
    for (let i = 0; i <= groupCellOptions.columnIndex; i++) {
      if (i === groupCellOptions.columnIndex && columns[i].allowCollapsing && options.scrollingMode !== 'infinite') {
        isExpanded = !!row.isExpanded;
        expandColumn = columns[i];
      } else {
        isExpanded = null;
        expandColumn = {
          command: 'expand',
          cssClass: columns[i].cssClass
        };
      }
      if (this._needRenderCell(i, options.columnIndices)) {
        this._renderCell($row, {
          value: isExpanded,
          row,
          rowIndex,
          column: expandColumn,
          columnIndex: i,
          columnIndices: options.columnIndices,
          change: options.change
        });
      }
    }
    const groupColumnAlignment = (0, _position.getDefaultAlignment)(this.option('rtlEnabled'));
    const groupColumn = (0, _extend.extend)({}, columns[groupCellOptions.columnIndex], {
      command: null,
      type: null,
      cssClass: null,
      width: null,
      showWhenGrouped: false,
      alignment: groupColumnAlignment
    });
    if (groupCellOptions.colspan > 1) {
      groupColumn.colspan = groupCellOptions.colspan;
    }
    if (this._needRenderCell(groupCellOptions.columnIndex + 1, options.columnIndices)) {
      this._renderCell($row, {
        value: row.values[row.groupIndex],
        row,
        rowIndex,
        column: groupColumn,
        columnIndex: groupCellOptions.columnIndex + 1,
        columnIndices: options.columnIndices,
        change: options.change
      });
    }
  };
  _proto._renderRows = function _renderRows($table, options) {
    const that = this;
    const scrollingMode = that.option('scrolling.mode');
    _ColumnsView.prototype._renderRows.call(this, $table, (0, _extend.extend)({
      scrollingMode
    }, options));
    that._checkRowKeys(options.change);
    that._renderFreeSpaceRow($table, options.change);
    if (!that._hasHeight) {
      that.updateFreeSpaceRowHeight($table);
    }
  };
  _proto._renderDataRowByTemplate = function _renderDataRowByTemplate($table, options, dataRowTemplate) {
    const {
      row
    } = options;
    const rowOptions = (0, _extend.extend)({
      columns: options.columns
    }, row);
    const $tbody = this._createRow(row, 'tbody');
    $tbody.appendTo($table);
    this.renderTemplate($tbody, dataRowTemplate, rowOptions, true, options.change);
    this._rowPrepared($tbody, rowOptions, options.row);
  }
  /**
   * @extended: column_fixing
   */;
  _proto._renderRow = function _renderRow($table, options) {
    const {
      row
    } = options;
    const {
      rowTemplate
    } = this.option();
    const dataRowTemplate = this.option('dataRowTemplate');
    if (row.rowType === 'data' && dataRowTemplate) {
      this._renderDataRowByTemplate($table, options, dataRowTemplate);
    } else if ((row.rowType === 'data' || row.rowType === 'group') && !(0, _type.isDefined)(row.groupIndex) && rowTemplate) {
      this.renderTemplate($table, rowTemplate, (0, _extend.extend)({
        columns: options.columns
      }, row), true);
    } else {
      _ColumnsView.prototype._renderRow.call(this, $table, options);
    }
  }
  /**
   * @extended: column_fixing
   */;
  _proto._renderTable = function _renderTable(options) {
    const that = this;
    const $table = _ColumnsView.prototype._renderTable.call(this, options);
    const resizeCompletedHandler = function () {
      const scrollableInstance = that.getScrollable();
      if (scrollableInstance && that.element().closest((0, _window.getWindow)().document).length) {
        that.resizeCompleted.remove(resizeCompletedHandler);
        scrollableInstance._visibilityChanged(true);
      }
    };
    if (!(0, _type.isDefined)(that.getTableElement())) {
      that.setTableElement($table);
      that._renderScrollable(true);
      that.resizeCompleted.add(resizeCompletedHandler);
    } else {
      that._renderScrollable();
    }
    return $table;
  }
  /**
   * @extended: editing_cell_based
   */;
  _proto._createTable = function _createTable() {
    const $table = _ColumnsView.prototype._createTable.apply(this, arguments);
    if (this.option().rowTemplate || this.option().dataRowTemplate) {
      $table.appendTo(this.component.$element());
    }
    return $table;
  }
  /**
   * @extended: column_fixing, editing, keyboard_navigation, row_dragging, search, selection, virtual_column, virtual_scrolling
   */;
  _proto._renderCore = function _renderCore(change) {
    const $element = this.element();
    $element.addClass(this.addWidgetPrefix(ROWS_VIEW_CLASS)).toggleClass(this.addWidgetPrefix(NOWRAP_CLASS), !this.option('wordWrapEnabled'));
    $element.toggleClass(EMPTY_CLASS, this._dataController.isEmpty());
    this.setAria('role', 'presentation', $element);
    const $table = this._renderTable({
      change
    });
    const deferred = this._updateContent($table, change);
    _ColumnsView.prototype._renderCore.call(this, change);
    this._lastColumnWidths = null;
    return deferred;
  };
  _proto._getRows = function _getRows(change) {
    return change && change.items || this._dataController.items();
  }
  /**
   * @extended: editing
   */;
  _proto._getCellOptions = function _getCellOptions(options) {
    const that = this;
    const {
      column
    } = options;
    const {
      row
    } = options;
    const {
      data
    } = row;
    const summaryCells = row && row.summaryCells;
    const {
      value
    } = options;
    const displayValue = _m_utils.default.getDisplayValue(column, value, data, row.rowType);
    const parameters = _ColumnsView.prototype._getCellOptions.call(this, options);
    parameters.value = value;
    parameters.oldValue = options.oldValue;
    parameters.displayValue = displayValue;
    parameters.row = row;
    parameters.key = row.key;
    parameters.data = data;
    parameters.rowType = row.rowType;
    parameters.values = row.values;
    parameters.text = !column.command ? _m_utils.default.formatValue(displayValue, column) : '';
    parameters.rowIndex = row.rowIndex;
    parameters.summaryItems = summaryCells && summaryCells[options.columnIndex];
    parameters.resized = column.resizedCallbacks;
    if ((0, _type.isDefined)(column.groupIndex) && !column.command) {
      const groupingTextsOptions = that.option('grouping.texts');
      const scrollingMode = that.option('scrolling.mode');
      if (scrollingMode !== 'virtual' && scrollingMode !== 'infinite') {
        parameters.groupContinuesMessage = data && data.isContinuationOnNextPage && groupingTextsOptions && groupingTextsOptions.groupContinuesMessage;
        parameters.groupContinuedMessage = data && data.isContinuation && groupingTextsOptions && groupingTextsOptions.groupContinuedMessage;
      }
    }
    return parameters;
  };
  _proto._setRowsOpacityCore = function _setRowsOpacityCore($rows, visibleColumns, columnIndex, value) {
    const columnsController = this._columnsController;
    const columns = columnsController.getColumns();
    const column = columns && columns[columnIndex];
    const columnID = column && column.isBand && column.index;
    (0, _iterator.each)($rows, (rowIndex, row) => {
      if (!(0, _renderer.default)(row).hasClass(GROUP_ROW_CLASS)) {
        for (let i = 0; i < visibleColumns.length; i++) {
          if ((0, _type.isNumeric)(columnID) && columnsController.isParentBandColumn(visibleColumns[i].index, columnID) || visibleColumns[i].index === columnIndex) {
            $rows.eq(rowIndex).children().eq(i).css({
              opacity: value
            });
            if (!(0, _type.isNumeric)(columnID)) {
              break;
            }
          }
        }
      }
    });
  };
  _proto._getDevicePixelRatio = function _getDevicePixelRatio() {
    return (0, _window.getWindow)().devicePixelRatio;
  };
  _proto.renderNoDataText = function renderNoDataText() {
    return _m_utils.default.renderNoDataText.apply(this, arguments);
  };
  _proto.getCellOptions = function getCellOptions(rowIndex, columnIdentifier) {
    const rowOptions = this._dataController.items()[rowIndex];
    let cellOptions;
    let column;
    if (rowOptions) {
      if ((0, _type.isString)(columnIdentifier)) {
        column = this._columnsController.columnOption(columnIdentifier);
      } else {
        column = this._columnsController.getVisibleColumns()[columnIdentifier];
      }
      if (column) {
        cellOptions = this._getCellOptions({
          value: column.calculateCellValue(rowOptions.data),
          rowIndex: rowOptions.rowIndex,
          row: rowOptions,
          column
        });
      }
    }
    return cellOptions;
  };
  _proto.getRow = function getRow(index) {
    if (index >= 0) {
      const rows = this._getRowElements();
      if (rows.length > index) {
        return (0, _renderer.default)(rows[index]);
      }
    }
    return undefined;
  }
  /**
   * @extended: validating, virtual_scrolling
   */;
  _proto.updateFreeSpaceRowHeight = function updateFreeSpaceRowHeight($table) {
    const dataController = this._dataController;
    const itemCount = dataController.items(true).length;
    const contentElement = this._findContentElement();
    const freeSpaceRowElements = this._getFreeSpaceRowElements($table);
    if (freeSpaceRowElements && contentElement && dataController.totalCount() >= 0) {
      let isFreeSpaceRowVisible = false;
      if (itemCount > 0) {
        if (!this._hasHeight) {
          const freeSpaceRowCount = dataController.pageSize() - itemCount;
          const scrollingMode = this.option('scrolling.mode');
          if (freeSpaceRowCount > 0 && dataController.pageCount() > 1 && scrollingMode !== 'virtual' && scrollingMode !== 'infinite') {
            (0, _style.setHeight)(freeSpaceRowElements, freeSpaceRowCount * this._rowHeight);
            isFreeSpaceRowVisible = true;
          }
          if (!isFreeSpaceRowVisible && $table) {
            (0, _style.setHeight)(freeSpaceRowElements, 0);
          } else {
            freeSpaceRowElements.toggle(isFreeSpaceRowVisible);
          }
          this._updateLastRowBorder(isFreeSpaceRowVisible);
        } else {
          freeSpaceRowElements.hide();
          (0, _common.deferUpdate)(() => {
            const scrollbarWidth = this.getScrollbarWidth(true);
            const elementHeightWithoutScrollbar = (0, _size.getHeight)(this.element()) - scrollbarWidth;
            const contentHeight = (0, _size.getOuterHeight)(contentElement);
            const showFreeSpaceRow = elementHeightWithoutScrollbar - contentHeight > 0;
            const rowsHeight = this._getRowsHeight(contentElement.children().first());
            const $tableElement = $table || this.getTableElements();
            const borderTopWidth = Math.ceil(parseFloat($tableElement.css('borderTopWidth')));
            const heightCorrection = this._getHeightCorrection();
            const resultHeight = elementHeightWithoutScrollbar - rowsHeight - borderTopWidth - heightCorrection;
            if (showFreeSpaceRow) {
              (0, _common.deferRender)(() => {
                freeSpaceRowElements.css('height', resultHeight);
                isFreeSpaceRowVisible = true;
                freeSpaceRowElements.show();
              });
            }
            (0, _common.deferRender)(() => this._updateLastRowBorder(isFreeSpaceRowVisible));
          });
        }
      } else {
        freeSpaceRowElements.css('height', 0);
        freeSpaceRowElements.show();
        this._updateLastRowBorder(true);
      }
    }
  };
  _proto._getHeightCorrection = function _getHeightCorrection() {
    const isZoomedWebkit = _browser.default.webkit && this._getDevicePixelRatio() >= 2; // T606935
    // @ts-expect-error
    const isChromeLatest = _browser.default.chrome && _browser.default.version >= 91;
    // @ts-expect-error
    const hasExtraBorderTop = _browser.default.mozilla && _browser.default.version >= 70 && !this.option('showRowLines');
    return isZoomedWebkit || hasExtraBorderTop || isChromeLatest ? 1 : 0;
  };
  _proto._columnOptionChanged = function _columnOptionChanged(e) {
    const {
      optionNames
    } = e;
    if (e.changeTypes.grouping) return;
    if (optionNames.width || optionNames.visibleWidth) {
      _ColumnsView.prototype._columnOptionChanged.call(this, e);
      this._fireColumnResizedCallbacks();
    }
  };
  _proto.getScrollable = function getScrollable() {
    return this._scrollable;
  };
  _proto._handleDataChanged = function _handleDataChanged(change) {
    const that = this;
    switch (change.changeType) {
      case 'refresh':
      case 'prepend':
      case 'append':
      case 'update':
        that.render(null, change);
        break;
      default:
        that._update(change);
        break;
    }
  };
  _proto.publicMethods = function publicMethods() {
    return ['isScrollbarVisible', 'getTopVisibleRowData', 'getScrollbarWidth', 'getCellElement', 'getRowElement', 'getScrollable'];
  };
  _proto.contentWidth = function contentWidth() {
    return (0, _size.getWidth)(this.element()) - this.getScrollbarWidth();
  };
  _proto.getScrollbarWidth = function getScrollbarWidth(isHorizontal) {
    const scrollableContainer = this._scrollableContainer && this._scrollableContainer.get(0);
    let scrollbarWidth = 0;
    if (scrollableContainer) {
      if (!isHorizontal) {
        scrollbarWidth = scrollableContainer.clientWidth ? scrollableContainer.offsetWidth - scrollableContainer.clientWidth : 0;
      } else {
        scrollbarWidth = scrollableContainer.clientHeight ? scrollableContainer.offsetHeight - scrollableContainer.clientHeight : 0;
        scrollbarWidth += getScrollableBottomPadding(this); // T703649, T697699
      }
    }
    return scrollbarWidth > 0 ? scrollbarWidth : 0;
  }
  // TODO remove this call, move _fireColumnResizedCallbacks functionality to columnsController
  ;
  _proto._fireColumnResizedCallbacks = function _fireColumnResizedCallbacks() {
    const that = this;
    const lastColumnWidths = that._lastColumnWidths || [];
    const columnWidths = [];
    const columns = that.getColumns();
    for (let i = 0; i < columns.length; i++) {
      columnWidths[i] = columns[i].visibleWidth;
      if (columns[i].resizedCallbacks && !(0, _type.isDefined)(columns[i].groupIndex) && lastColumnWidths[i] !== columnWidths[i]) {
        columns[i].resizedCallbacks.fire(columnWidths[i]);
      }
    }
    that._lastColumnWidths = columnWidths;
  };
  _proto._updateLastRowBorder = function _updateLastRowBorder(isFreeSpaceRowVisible) {
    if (this.option('showBorders') && !isFreeSpaceRowVisible) {
      this.element().addClass(LAST_ROW_BORDER);
    } else {
      this.element().removeClass(LAST_ROW_BORDER);
    }
  }
  /**
   * @extended: column_fixing
   */;
  _proto._updateScrollable = function _updateScrollable() {
    const scrollable = _ui.default.getInstance(this.element());
    if (scrollable) {
      // @ts-expect-error
      scrollable.update();
      // @ts-expect-error
      if (scrollable.option('useNative') || !(scrollable === null || scrollable === void 0 ? void 0 : scrollable.isRenovated())) {
        this._updateHorizontalScrollPosition();
      }
    }
  };
  _proto._updateHorizontalScrollPosition = function _updateHorizontalScrollPosition() {
    const scrollable = this.getScrollable();
    const scrollLeft = scrollable && scrollable.scrollOffset().left;
    const rtlEnabled = this.option('rtlEnabled');
    if (rtlEnabled) {
      const maxHorizontalScrollOffset = getMaxHorizontalScrollOffset(scrollable);
      const scrollRight = maxHorizontalScrollOffset - scrollLeft;
      if (scrollRight !== this._scrollRight) {
        this._scrollLeft = maxHorizontalScrollOffset - this._scrollRight;
      }
    }
    if (this._scrollLeft >= 0 && scrollLeft !== this._scrollLeft) {
      scrollable.scrollTo({
        x: this._scrollLeft
      });
    }
  }
  /**
   * @extended: column_fixing, filter_row, row_dragging, vitrual_columns, virtual_scrolling
   */;
  _proto._resizeCore = function _resizeCore() {
    const that = this;
    that._fireColumnResizedCallbacks();
    that._updateRowHeight();
    (0, _common.deferRender)(() => {
      that._renderScrollable();
      that.renderNoDataText();
      that.updateFreeSpaceRowHeight();
      (0, _common.deferUpdate)(() => {
        that._updateScrollable();
      });
    });
  };
  _proto.scrollTo = function scrollTo(location) {
    const $element = this.element();
    const dxScrollable = $element && _ui.default.getInstance($element);
    if (dxScrollable) {
      dxScrollable.scrollTo(location);
    }
  };
  _proto.height = function height(_height) {
    const that = this;
    const $element = this.element();
    if (arguments.length === 0) {
      return $element ? (0, _size.getOuterHeight)($element, true) : 0;
    }
    if ((0, _type.isDefined)(_height) && $element) {
      that.hasHeight(_height !== 'auto');
      (0, _style.setHeight)($element, _height);
    }
  };
  _proto.hasHeight = function hasHeight(_hasHeight) {
    if (arguments.length === 0) {
      return !!this._hasHeight;
    }
    this._hasHeight = _hasHeight;
    return undefined;
  }
  /**
   * @extended: virtual_scrolling
   */;
  _proto.setLoading = function setLoading(isLoading, messageText) {
    const that = this;
    let loadPanel = that._loadPanel;
    const dataController = that._dataController;
    const loadPanelOptions = that.option('loadPanel') || {};
    const animation = dataController.isLoaded() ? loadPanelOptions.animation : null;
    const $element = that.element();
    if (!(0, _window.hasWindow)()) {
      return;
    }
    if (!loadPanel && messageText !== undefined && dataController.isLocalStore() && loadPanelOptions.enabled === 'auto' && $element) {
      that._renderLoadPanel($element, $element.parent());
      loadPanel = that._loadPanel;
    }
    if (loadPanel) {
      const visibilityOptions = {
        message: messageText || loadPanelOptions.text,
        animation,
        visible: isLoading
      };
      if (isLoading) {
        visibilityOptions.position = _m_utils.default.calculateLoadPanelPosition($element);
      }
      clearTimeout(that._hideLoadingTimeoutID);
      if (loadPanel.option('visible') && !isLoading) {
        that._hideLoadingTimeoutID = setTimeout(() => {
          loadPanel.option(visibilityOptions);
        }, LOADPANEL_HIDE_TIMEOUT);
      } else {
        loadPanel.option(visibilityOptions);
      }
    }
  }
  /**
   * @extended: column_fixing
   */;
  _proto.setRowsOpacity = function setRowsOpacity(columnIndex, value) {
    const $rows = this._getRowElements().not(".".concat(GROUP_ROW_CLASS)) || [];
    this._setRowsOpacityCore($rows, this.getColumns(), columnIndex, value);
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ;
  _proto._getCellElementsCore = function _getCellElementsCore(rowIndex) {
    const $cells = _ColumnsView.prototype._getCellElementsCore.apply(this, arguments);
    if ($cells) {
      const groupCellIndex = $cells.filter(".".concat(GROUP_CELL_CLASS)).index();
      if (groupCellIndex >= 0 && $cells.length > groupCellIndex + 1) {
        return $cells.slice(0, groupCellIndex + 1);
      }
    }
    return $cells;
  };
  _proto._getBoundaryVisibleItemIndex = function _getBoundaryVisibleItemIndex(isTop, isFloor) {
    const that = this;
    let itemIndex = 0;
    let prevOffset = 0;
    let offset = 0;
    let viewportBoundary = that._scrollTop;
    const $contentElement = that._findContentElement();
    const contentElementOffsetTop = $contentElement && $contentElement.offset().top;
    const items = this._dataController.items();
    const tableElement = that.getTableElement();
    if (items.length && tableElement) {
      const rowElements = that._getRowElements(tableElement).filter(':visible');
      if (!isTop) {
        const height = (0, _size.getOuterHeight)(this._hasHeight ? this.element() : (0, _window.getWindow)());
        viewportBoundary += height;
      }
      for (itemIndex = 0; itemIndex < items.length; itemIndex++) {
        prevOffset = offset;
        const $rowElement = (0, _renderer.default)(rowElements).eq(itemIndex);
        if ($rowElement.length) {
          offset = $rowElement.offset();
          offset = (isTop ? offset.top : offset.top + (0, _size.getOuterHeight)($rowElement)) - contentElementOffsetTop;
          if (offset > viewportBoundary) {
            if (itemIndex) {
              if (isFloor || viewportBoundary * 2 < Math.round(offset + prevOffset)) {
                itemIndex--;
              }
            }
            break;
          }
        }
      }
      if (itemIndex && itemIndex === items.length) {
        itemIndex--;
      }
    }
    return itemIndex;
  };
  _proto.getTopVisibleItemIndex = function getTopVisibleItemIndex(isFloor) {
    return this._getBoundaryVisibleItemIndex(true, isFloor);
  };
  _proto.getBottomVisibleItemIndex = function getBottomVisibleItemIndex(isFloor) {
    return this._getBoundaryVisibleItemIndex(false, isFloor);
  };
  _proto.getTopVisibleRowData = function getTopVisibleRowData() {
    const itemIndex = this.getTopVisibleItemIndex();
    const items = this._dataController.items();
    if (items[itemIndex]) {
      return items[itemIndex].data;
    }
    return undefined;
  }
  /**
   * @extended: column_fixing
   */;
  _proto._scrollToElement = function _scrollToElement($element, offset) {
    const scrollable = this.getScrollable();
    scrollable && scrollable.scrollToElement($element, offset);
  };
  _proto.optionChanged = function optionChanged(args) {
    const that = this;
    _ColumnsView.prototype.optionChanged.call(this, args);
    // eslint-disable-next-line default-case
    switch (args.name) {
      case 'wordWrapEnabled':
      case 'showColumnLines':
      case 'showRowLines':
      case 'rowAlternationEnabled':
      case 'rowTemplate':
      case 'dataRowTemplate':
      case 'twoWayBindingEnabled':
        that._invalidate(true, true);
        args.handled = true;
        break;
      case 'scrolling':
        that._rowHeight = null;
        that._tableElement = null;
        args.handled = true;
        break;
      case 'rtlEnabled':
        that._rowHeight = null;
        that._tableElement = null;
        break;
      case 'loadPanel':
        that._tableElement = null;
        that._invalidate(true, args.fullName !== 'loadPanel.enabled');
        args.handled = true;
        break;
      case 'noDataText':
        that.renderNoDataText();
        args.handled = true;
        break;
    }
  }
  /**
   * @extended: column_fixing
   */;
  _proto.setAriaOwns = function setAriaOwns(headerTableId, footerTableId, isFixed) {
    var _a;
    const $contentElement = this._findContentElement();
    const $tableElement = this.getTableElement();
    if ($tableElement === null || $tableElement === void 0 ? void 0 : $tableElement.length) {
      this.setAria('owns', "".concat(headerTableId !== null && headerTableId !== void 0 ? headerTableId : '', " ").concat((_a = $tableElement.attr('id')) !== null && _a !== void 0 ? _a : '', " ").concat(footerTableId !== null && footerTableId !== void 0 ? footerTableId : '').trim(), $contentElement);
    }
  };
  _proto.dispose = function dispose() {
    _ColumnsView.prototype.dispose.call(this);
    clearTimeout(this._hideLoadingTimeoutID);
    this._scrollable && this._scrollable.dispose();
  }
  /**
   * @extended: column_fixing
   */;
  _proto.setScrollerSpacing = function setScrollerSpacing(vScrollbarWidth, hScrollbarWidth) {}
  /**
   * @extended: validating, virtual_scrolling
   */
  // eslint-disable-next-line
  ;
  _proto._restoreErrorRow = function _restoreErrorRow(contentTable) {};
  _proto.isElementInside = function isElementInside($element) {
    const $rowsViewElement = $element.closest(".".concat(this.addWidgetPrefix(ROWS_VIEW_CLASS)));
    return $rowsViewElement.is(this.element());
  };
  return RowsView;
}(_m_columns_view.ColumnsView);
const rowsModule = exports.rowsModule = {
  defaultOptions() {
    return {
      hoverStateEnabled: false,
      scrolling: {
        useNative: 'auto'
      },
      loadPanel: {
        enabled: 'auto',
        text: _message.default.format('Loading'),
        width: 200,
        height: 90,
        showIndicator: true,
        indicatorSrc: '',
        showPane: true
      },
      dataRowTemplate: null,
      columnAutoWidth: false,
      noDataText: _message.default.format('dxDataGrid-noDataText'),
      wordWrapEnabled: false,
      showColumnLines: true,
      showRowLines: false,
      rowAlternationEnabled: false,
      activeStateEnabled: false,
      twoWayBindingEnabled: true
    };
  },
  views: {
    rowsView: RowsView
  }
};
