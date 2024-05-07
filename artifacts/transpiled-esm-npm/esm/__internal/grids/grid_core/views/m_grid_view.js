/* eslint-disable max-classes-per-file */
import domAdapter from '../../../../core/dom_adapter';
import $ from '../../../../core/renderer';
import browser from '../../../../core/utils/browser';
import { deferRender, deferUpdate } from '../../../../core/utils/common';
import { Deferred, when } from '../../../../core/utils/deferred';
import { each } from '../../../../core/utils/iterator';
import { getBoundingRect } from '../../../../core/utils/position';
import { getHeight, getInnerWidth, getOuterWidth, getWidth } from '../../../../core/utils/size';
import { isDefined, isNumeric, isString } from '../../../../core/utils/type';
import { getWindow, hasWindow } from '../../../../core/utils/window';
import messageLocalization from '../../../../localization/message';
import * as accessibility from '../../../../ui/shared/accessibility';
import { A11yStatusContainerComponent } from '../../../grids/grid_core/views/a11y_status_container_component';
import modules from '../m_modules';
import gridCoreUtils from '../m_utils';
var BORDERS_CLASS = 'borders';
var TABLE_FIXED_CLASS = 'table-fixed';
var IMPORTANT_MARGIN_CLASS = 'important-margin';
var GRIDBASE_CONTAINER_CLASS = 'dx-gridbase-container';
var GROUP_ROW_SELECTOR = 'tr.dx-group-row';
var HIDDEN_COLUMNS_WIDTH = 'adaptiveHidden';
var VIEW_NAMES = ['columnsSeparatorView', 'blockSeparatorView', 'trackerView', 'headerPanel', 'columnHeadersView', 'rowsView', 'footerView', 'columnChooserView', 'filterPanelView', 'pagerView', 'draggingHeaderView', 'contextMenuView', 'errorView', 'headerFilterView', 'filterBuilderView'];
var E2E_ATTRIBUTES = {
  a11yStatusContainer: 'e2e-a11y-general-status-container'
};
var isPercentWidth = function isPercentWidth(width) {
  return isString(width) && width.endsWith('%');
};
var isPixelWidth = function isPixelWidth(width) {
  return isString(width) && width.endsWith('px');
};
var calculateFreeWidth = function calculateFreeWidth(that, widths) {
  var contentWidth = that._rowsView.contentWidth();
  var totalWidth = that._getTotalWidth(widths, contentWidth);
  return contentWidth - totalWidth;
};
var calculateFreeWidthWithCurrentMinWidth = function calculateFreeWidthWithCurrentMinWidth(that, columnIndex, currentMinWidth, widths) {
  return calculateFreeWidth(that, widths.map((width, index) => index === columnIndex ? currentMinWidth : width));
};
var restoreFocus = function restoreFocus(focusedElement, selectionRange) {
  accessibility.hiddenFocus(focusedElement, true);
  gridCoreUtils.setSelectionRange(focusedElement, selectionRange);
};
export class ResizingController extends modules.ViewController {
  init() {
    this._prevContentMinHeight = null;
    this._dataController = this.getController('data');
    this._columnsController = this.getController('columns');
    this._columnHeadersView = this.getView('columnHeadersView');
    this._adaptiveColumnsController = this.getController('adaptiveColumns');
    this._editorFactoryController = this.getController('editorFactory');
    this._footerView = this.getView('footerView');
    this._rowsView = this.getView('rowsView');
    this._gridView = this.getView('gridView');
  }
  _initPostRenderHandlers() {
    if (!this._refreshSizesHandler) {
      this._refreshSizesHandler = e => {
        // @ts-expect-error
        var resizeDeferred = new Deferred().resolve(null);
        var changeType = e === null || e === void 0 ? void 0 : e.changeType;
        var isDelayed = e === null || e === void 0 ? void 0 : e.isDelayed;
        var needFireContentReady = changeType && changeType !== 'updateSelection' && changeType !== 'updateFocusedRow' && changeType !== 'pageIndex' && !isDelayed;
        this._dataController.changed.remove(this._refreshSizesHandler);
        if (this._checkSize()) {
          resizeDeferred = this._refreshSizes(e);
        }
        if (needFireContentReady) {
          when(resizeDeferred).done(() => {
            this._setAriaLabel();
            this.fireContentReadyAction();
          });
        }
      };
      // TODO remove resubscribing
      this._dataController.changed.add(() => {
        this._dataController.changed.add(this._refreshSizesHandler);
      });
    }
  }
  _refreshSizes(e) {
    var _a;
    // @ts-expect-error
    var resizeDeferred = new Deferred().resolve(null);
    var changeType = e === null || e === void 0 ? void 0 : e.changeType;
    var isDelayed = e === null || e === void 0 ? void 0 : e.isDelayed;
    var items = this._dataController.items();
    if (!e || changeType === 'refresh' || changeType === 'prepend' || changeType === 'append') {
      if (!isDelayed) {
        resizeDeferred = this.resize();
      }
    } else if (changeType === 'update') {
      if (((_a = e.changeTypes) === null || _a === void 0 ? void 0 : _a.length) === 0) {
        return resizeDeferred;
      }
      if ((items.length > 1 || e.changeTypes[0] !== 'insert') && !(items.length === 0 && e.changeTypes[0] === 'remove') && !e.needUpdateDimensions) {
        // @ts-expect-error
        resizeDeferred = new Deferred();
        this._waitAsyncTemplates().done(() => {
          deferUpdate(() => deferRender(() => deferUpdate(() => {
            this._setScrollerSpacing();
            this._rowsView.resize();
            resizeDeferred.resolve();
          })));
        }).fail(resizeDeferred.reject);
      } else {
        resizeDeferred = this.resize();
      }
    }
    return resizeDeferred;
  }
  /**
   * @extended: master_detail
   */
  fireContentReadyAction() {
    this.component._fireContentReadyAction();
  }
  _getWidgetAriaLabel() {
    return 'dxDataGrid-ariaDataGrid';
  }
  _setAriaLabel() {
    var _a, _b, _c;
    var columnCount = (_c = (_b = (_a = this._columnsController) === null || _a === void 0 ? void 0 : _a._columns) === null || _b === void 0 ? void 0 : _b.filter(_ref => {
      var {
        visible
      } = _ref;
      return !!visible;
    }).length) !== null && _c !== void 0 ? _c : 0;
    var totalItemsCount = Math.max(0, this._dataController.totalItemsCount());
    var widgetAriaLabel = this._getWidgetAriaLabel();
    var widgetStatusText = messageLocalization
    // @ts-expect-error Badly typed format method
    .format(widgetAriaLabel, totalItemsCount, columnCount);
    // @ts-expect-error Badly typed dxElementWrapper
    var $ariaLabelElement = this.component.$element().children(".".concat(GRIDBASE_CONTAINER_CLASS));
    this.component.setAria('label', widgetStatusText, $ariaLabelElement);
    this._gridView.setWidgetA11yStatusText(widgetStatusText);
  }
  _getBestFitWidths() {
    var _a;
    var rowsView = this._rowsView;
    var columnHeadersView = this._columnHeadersView;
    var widths = rowsView.getColumnWidths();
    if (!(widths === null || widths === void 0 ? void 0 : widths.length)) {
      var headersTableElement = columnHeadersView.getTableElement();
      columnHeadersView.setTableElement((_a = rowsView.getTableElement()) === null || _a === void 0 ? void 0 : _a.children('.dx-header'));
      widths = columnHeadersView.getColumnWidths();
      columnHeadersView.setTableElement(headersTableElement);
    }
    return widths;
  }
  _setVisibleWidths(visibleColumns, widths) {
    var columnsController = this._columnsController;
    columnsController.beginUpdate();
    each(visibleColumns, (index, column) => {
      var columnId = columnsController.getColumnId(column);
      columnsController.columnOption(columnId, 'visibleWidth', widths[index]);
    });
    columnsController.endUpdate();
  }
  _toggleBestFitModeForView(view, className, isBestFit) {
    if (!view || !view.isVisible()) return;
    var $rowsTables = this._rowsView.getTableElements();
    var $viewTables = view.getTableElements();
    each($rowsTables, (index, tableElement) => {
      var $tableBody;
      var $rowsTable = $(tableElement);
      var $viewTable = $viewTables.eq(index);
      if ($viewTable && $viewTable.length) {
        if (isBestFit) {
          $tableBody = $viewTable.children('tbody').appendTo($rowsTable);
        } else {
          $tableBody = $rowsTable.children(".".concat(className)).appendTo($viewTable);
        }
        $tableBody.toggleClass(className, isBestFit);
        $tableBody.toggleClass(this.addWidgetPrefix('best-fit'), isBestFit);
      }
    });
  }
  /**
   * @extended: adaptivity, master_detail
   */
  _toggleBestFitMode(isBestFit) {
    var $rowsTable = this._rowsView.getTableElement();
    var $rowsFixedTable = this._rowsView.getTableElements().eq(1);
    if (!$rowsTable) return;
    $rowsTable.css('tableLayout', isBestFit ? 'auto' : 'fixed');
    $rowsTable.children('colgroup').css('display', isBestFit ? 'none' : '');
    // NOTE T1156153: Hide group row column to get correct fixed column widths.
    each($rowsFixedTable.find(GROUP_ROW_SELECTOR), (idx, item) => {
      $(item).css('display', isBestFit ? 'none' : '');
    });
    $rowsFixedTable.toggleClass(this.addWidgetPrefix(TABLE_FIXED_CLASS), !isBestFit);
    this._toggleBestFitModeForView(this._columnHeadersView, 'dx-header', isBestFit);
    this._toggleBestFitModeForView(this._footerView, 'dx-footer', isBestFit);
    if (this._needStretch()) {
      // @ts-expect-error
      $rowsTable.get(0).style.width = isBestFit ? 'auto' : '';
    }
  }
  _toggleContentMinHeight(value) {
    var scrollable = this._rowsView.getScrollable();
    var $contentElement = this._rowsView._findContentElement();
    if ((scrollable === null || scrollable === void 0 ? void 0 : scrollable.option('useNative')) === false) {
      if (value === true) {
        this._prevContentMinHeight = $contentElement.get(0).style.minHeight;
      }
      if (isDefined(this._prevContentMinHeight)) {
        $contentElement.css({
          minHeight: value ? gridCoreUtils.getContentHeightLimit(browser) : this._prevContentMinHeight
        });
      }
    }
  }
  _synchronizeColumns() {
    var columnsController = this._columnsController;
    var visibleColumns = columnsController.getVisibleColumns();
    var columnAutoWidth = this.option('columnAutoWidth');
    var wordWrapEnabled = this.option('wordWrapEnabled');
    var hasUndefinedColumnWidth = visibleColumns.some(column => !isDefined(column.width));
    var needBestFit = this._needBestFit();
    var hasMinWidth = false;
    var resetBestFitMode;
    var isColumnWidthsCorrected = false;
    var resultWidths = [];
    var focusedElement;
    var selectionRange;
    var normalizeWidthsByExpandColumns = function normalizeWidthsByExpandColumns() {
      var expandColumnWidth;
      each(visibleColumns, (index, column) => {
        if (column.type === 'groupExpand') {
          expandColumnWidth = resultWidths[index];
        }
      });
      each(visibleColumns, (index, column) => {
        if (column.type === 'groupExpand' && expandColumnWidth) {
          resultWidths[index] = expandColumnWidth;
        }
      });
    };
    !needBestFit && each(visibleColumns, (index, column) => {
      if (column.width === 'auto') {
        needBestFit = true;
        return false;
      }
      return undefined;
    });
    each(visibleColumns, (index, column) => {
      if (column.minWidth) {
        hasMinWidth = true;
        return false;
      }
      return undefined;
    });
    this._setVisibleWidths(visibleColumns, []);
    var $element = this.component.$element();
    if (needBestFit) {
      // @ts-expect-error
      focusedElement = domAdapter.getActiveElement($element.get(0));
      selectionRange = gridCoreUtils.getSelectionRange(focusedElement);
      this._toggleBestFitMode(true);
      resetBestFitMode = true;
    }
    this._toggleContentMinHeight(wordWrapEnabled); // T1047239
    // @ts-expect-error
    if ($element && $element.get(0) && this._maxWidth) {
      delete this._maxWidth;
      $element[0].style.maxWidth = '';
    }
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    deferUpdate(() => {
      if (needBestFit) {
        resultWidths = this._getBestFitWidths();
        each(visibleColumns, (index, column) => {
          var columnId = columnsController.getColumnId(column);
          columnsController.columnOption(columnId, 'bestFitWidth', resultWidths[index], true);
        });
      } else if (hasMinWidth) {
        resultWidths = this._getBestFitWidths();
      }
      each(visibleColumns, function (index) {
        var {
          width
        } = this;
        if (width !== 'auto') {
          if (isDefined(width)) {
            resultWidths[index] = isNumeric(width) || isPixelWidth(width) ? parseFloat(width) : width;
          } else if (!columnAutoWidth) {
            resultWidths[index] = undefined;
          }
        }
      });
      if (resetBestFitMode) {
        this._toggleBestFitMode(false);
        resetBestFitMode = false;
        if (focusedElement && focusedElement !== domAdapter.getActiveElement()) {
          var isFocusOutsideWindow = getBoundingRect(focusedElement).bottom < 0;
          if (!isFocusOutsideWindow) {
            restoreFocus(focusedElement, selectionRange);
          }
        }
      }
      isColumnWidthsCorrected = this._correctColumnWidths(resultWidths, visibleColumns);
      if (columnAutoWidth) {
        normalizeWidthsByExpandColumns();
        if (this._needStretch()) {
          this._processStretch(resultWidths, visibleColumns);
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      deferRender(() => {
        if (needBestFit || isColumnWidthsCorrected || hasUndefinedColumnWidth) {
          this._setVisibleWidths(visibleColumns, resultWidths);
        }
        if (wordWrapEnabled) {
          this._toggleContentMinHeight(false);
        }
      });
    });
  }
  /**
   * @extended: adaptivity
   */
  _needBestFit() {
    return this.option('columnAutoWidth');
  }
  /**
   * @extended: adaptivity
   */
  _needStretch() {
    return this._columnsController.getVisibleColumns().some(c => c.width === 'auto' && !c.command);
  }
  _getAverageColumnsWidth(resultWidths) {
    var freeWidth = calculateFreeWidth(this, resultWidths);
    var columnCountWithoutWidth = resultWidths.filter(width => width === undefined).length;
    return freeWidth / columnCountWithoutWidth;
  }
  /**
   * @extended: adaptivity
   */
  _correctColumnWidths(resultWidths, visibleColumns) {
    var that = this;
    var i;
    var hasPercentWidth = false;
    var hasAutoWidth = false;
    var isColumnWidthsCorrected = false;
    var $element = that.component.$element();
    var hasWidth = that._hasWidth;
    var _loop = function _loop() {
      var index = i;
      var column = visibleColumns[index];
      var isHiddenColumn = resultWidths[index] === HIDDEN_COLUMNS_WIDTH;
      var width = resultWidths[index];
      var {
        minWidth
      } = column;
      if (minWidth) {
        if (width === undefined) {
          var averageColumnsWidth = that._getAverageColumnsWidth(resultWidths);
          width = averageColumnsWidth;
        } else if (isPercentWidth(width)) {
          var freeWidth = calculateFreeWidthWithCurrentMinWidth(that, index, minWidth, resultWidths);
          if (freeWidth < 0) {
            width = -1;
          }
        }
      }
      var realColumnWidth = that._getRealColumnWidth(index, resultWidths.map((columnWidth, columnIndex) => index === columnIndex ? width : columnWidth));
      if (minWidth && !isHiddenColumn && realColumnWidth < minWidth) {
        resultWidths[index] = minWidth;
        isColumnWidthsCorrected = true;
        i = -1;
      }
      if (!isDefined(column.width)) {
        hasAutoWidth = true;
      }
      if (isPercentWidth(column.width)) {
        hasPercentWidth = true;
      }
    };
    for (i = 0; i < visibleColumns.length; i++) {
      _loop();
    }
    if (!hasAutoWidth && resultWidths.length) {
      var $rowsViewElement = that._rowsView.element();
      var contentWidth = that._rowsView.contentWidth();
      var scrollbarWidth = that._rowsView.getScrollbarWidth();
      var totalWidth = that._getTotalWidth(resultWidths, contentWidth);
      if (totalWidth < contentWidth) {
        var lastColumnIndex = gridCoreUtils.getLastResizableColumnIndex(visibleColumns, resultWidths);
        if (lastColumnIndex >= 0) {
          resultWidths[lastColumnIndex] = 'auto';
          isColumnWidthsCorrected = true;
          if (hasWidth === false && !hasPercentWidth) {
            var borderWidth = that.option('showBorders') ? Math.ceil(getOuterWidth($rowsViewElement) - getInnerWidth($rowsViewElement)) : 0;
            that._maxWidth = totalWidth + scrollbarWidth + borderWidth;
            // @ts-expect-error
            $element.css('maxWidth', that._maxWidth);
          }
        }
      }
    }
    return isColumnWidthsCorrected;
  }
  _processStretch(resultSizes, visibleColumns) {
    var groupSize = this._rowsView.contentWidth();
    var tableSize = this._getTotalWidth(resultSizes, groupSize);
    var unusedIndexes = {
      length: 0
    };
    if (!resultSizes.length) return;
    each(visibleColumns, function (index) {
      if (this.width || resultSizes[index] === HIDDEN_COLUMNS_WIDTH) {
        unusedIndexes[index] = true;
        unusedIndexes.length++;
      }
    });
    var diff = groupSize - tableSize;
    var diffElement = Math.floor(diff / (resultSizes.length - unusedIndexes.length));
    var onePixelElementsCount = diff - diffElement * (resultSizes.length - unusedIndexes.length);
    if (diff >= 0) {
      for (var i = 0; i < resultSizes.length; i++) {
        if (unusedIndexes[i]) {
          continue;
        }
        resultSizes[i] += diffElement;
        if (onePixelElementsCount > 0) {
          if (onePixelElementsCount < 1) {
            resultSizes[i] += onePixelElementsCount;
            onePixelElementsCount = 0;
          } else {
            resultSizes[i]++;
            onePixelElementsCount--;
          }
        }
      }
    }
  }
  _getRealColumnWidth(columnIndex, columnWidths, groupWidth) {
    var ratio = 1;
    var width = columnWidths[columnIndex];
    if (!isPercentWidth(width)) {
      return parseFloat(width);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    var percentTotalWidth = columnWidths.reduce((sum, width, index) => {
      if (!isPercentWidth(width)) {
        return sum;
      }
      return sum + parseFloat(width);
    }, 0);
    var pixelTotalWidth = columnWidths.reduce((sum, width) => {
      if (!width || width === HIDDEN_COLUMNS_WIDTH || isPercentWidth(width)) {
        return sum;
      }
      return sum + parseFloat(width);
    }, 0);
    groupWidth = groupWidth || this._rowsView.contentWidth();
    var freeSpace = groupWidth - pixelTotalWidth;
    var percentTotalWidthInPixel = percentTotalWidth * groupWidth / 100;
    if (pixelTotalWidth > 0 && percentTotalWidthInPixel + pixelTotalWidth >= groupWidth) {
      ratio = percentTotalWidthInPixel > freeSpace ? freeSpace / percentTotalWidthInPixel : 1;
    }
    return parseFloat(width) * groupWidth * ratio / 100;
  }
  _getTotalWidth(widths, groupWidth) {
    var result = 0;
    for (var i = 0; i < widths.length; i++) {
      var width = widths[i];
      if (width && width !== HIDDEN_COLUMNS_WIDTH) {
        result += this._getRealColumnWidth(i, widths, groupWidth);
      }
    }
    return Math.ceil(result);
  }
  _getGroupElement() {
    // @ts-expect-error
    return this.component.$element().children().get(0);
  }
  updateSize(rootElement) {
    var that = this;
    var $rootElement = $(rootElement);
    var importantMarginClass = that.addWidgetPrefix(IMPORTANT_MARGIN_CLASS);
    if (that._hasHeight === undefined && $rootElement && $rootElement.is(':visible') && getWidth($rootElement)) {
      var $groupElement = $rootElement.children(".".concat(that.getWidgetContainerClass()));
      if ($groupElement.length) {
        $groupElement.detach();
      }
      that._hasHeight = !!getHeight($rootElement);
      var width = getWidth($rootElement);
      $rootElement.addClass(importantMarginClass);
      that._hasWidth = getWidth($rootElement) === width;
      $rootElement.removeClass(importantMarginClass);
      if ($groupElement.length) {
        $groupElement.appendTo($rootElement);
      }
    }
  }
  publicMethods() {
    return ['resize', 'updateDimensions'];
  }
  _waitAsyncTemplates() {
    var _a, _b, _c;
    return when((_a = this._columnHeadersView) === null || _a === void 0 ? void 0 : _a.waitAsyncTemplates(true), (_b = this._rowsView) === null || _b === void 0 ? void 0 : _b.waitAsyncTemplates(true), (_c = this._footerView) === null || _c === void 0 ? void 0 : _c.waitAsyncTemplates(true));
  }
  /**
   * @extended: virtual_scrolling
   */
  resize() {
    if (this.component._requireResize) {
      return;
    }
    // @ts-expect-error
    var d = new Deferred();
    this._waitAsyncTemplates().done(() => {
      when(this.updateDimensions()).done(d.resolve).fail(d.reject);
    }).fail(d.reject);
    return d.promise();
  }
  updateDimensions(checkSize) {
    var that = this;
    that._initPostRenderHandlers();
    // T335767
    if (!that._checkSize(checkSize)) {
      return;
    }
    var prevResult = that._resizeDeferred;
    // @ts-expect-error
    var result = that._resizeDeferred = new Deferred();
    when(prevResult).always(() => {
      deferRender(() => {
        if (that._dataController.isLoaded()) {
          that._synchronizeColumns();
        }
        // IE11
        that._resetGroupElementHeight();
        deferUpdate(() => {
          deferRender(() => {
            deferUpdate(() => {
              that._updateDimensionsCore();
            });
          });
        });
        // @ts-expect-error
      }).done(result.resolve).fail(result.reject);
    });
    return result.promise();
  }
  _resetGroupElementHeight() {
    var groupElement = this._getGroupElement();
    var scrollable = this._rowsView.getScrollable();
    if (groupElement && groupElement.style.height && (!scrollable || !scrollable.scrollTop())) {
      groupElement.style.height = '';
    }
  }
  _checkSize(checkSize) {
    var $rootElement = this.component.$element();
    // @ts-expect-error
    var isWidgetVisible = $rootElement.is(':visible');
    var isGridSizeChanged = this._lastWidth !== getWidth($rootElement) || this._lastHeight !== getHeight($rootElement) || this._devicePixelRatio !== getWindow().devicePixelRatio;
    return isWidgetVisible && (!checkSize || isGridSizeChanged);
  }
  _setScrollerSpacingCore() {
    var that = this;
    var vScrollbarWidth = that._rowsView.getScrollbarWidth();
    var hScrollbarWidth = that._rowsView.getScrollbarWidth(true);
    deferRender(() => {
      that._columnHeadersView && that._columnHeadersView.setScrollerSpacing(vScrollbarWidth);
      that._footerView && that._footerView.setScrollerSpacing(vScrollbarWidth);
      that._rowsView.setScrollerSpacing(vScrollbarWidth, hScrollbarWidth);
    });
  }
  _setScrollerSpacing() {
    var scrollable = this._rowsView.getScrollable();
    // T722415, T758955
    var isNativeScrolling = this.option('scrolling.useNative') === true;
    if (!scrollable || isNativeScrolling) {
      deferRender(() => {
        deferUpdate(() => {
          this._setScrollerSpacingCore();
        });
      });
    } else {
      this._setScrollerSpacingCore();
    }
  }
  /**
   * @extended: column_fixing
   */
  _setAriaOwns() {
    var _a, _b, _c;
    var headerTable = (_a = this._columnHeadersView) === null || _a === void 0 ? void 0 : _a.getTableElement();
    var footerTable = (_b = this._footerView) === null || _b === void 0 ? void 0 : _b.getTableElement();
    // @ts-expect-error
    (_c = this._rowsView) === null || _c === void 0 ? void 0 : _c.setAriaOwns(headerTable === null || headerTable === void 0 ? void 0 : headerTable.attr('id'), footerTable === null || footerTable === void 0 ? void 0 : footerTable.attr('id'));
  }
  /**
   * @extended: header_panel
   */
  _updateDimensionsCore() {
    var _a;
    var that = this;
    var dataController = that._dataController;
    var rowsView = that._rowsView;
    var $rootElement = that.component.$element();
    var groupElement = this._getGroupElement();
    var rootElementHeight = getHeight($rootElement);
    // @ts-expect-error
    var height = (_a = that.option('height')) !== null && _a !== void 0 ? _a : $rootElement.get(0).style.height;
    var isHeightSpecified = !!height && height !== 'auto';
    // @ts-expect-error
    // eslint-disable-next-line radix
    var maxHeight = parseInt($rootElement.css('maxHeight'));
    var maxHeightHappened = maxHeight && rootElementHeight >= maxHeight;
    var isMaxHeightApplied = groupElement && groupElement.scrollHeight === groupElement.offsetHeight;
    that.updateSize($rootElement);
    deferRender(() => {
      var hasHeight = that._hasHeight || !!maxHeight || isHeightSpecified;
      rowsView.hasHeight(hasHeight);
      this._setAriaOwns();
      // IE11
      if (maxHeightHappened && !isMaxHeightApplied) {
        $(groupElement).css('height', maxHeight);
      }
      if (!dataController.isLoaded()) {
        rowsView.setLoading(dataController.isLoading());
        return;
      }
      deferUpdate(() => {
        that._updateLastSizes($rootElement);
        that._setScrollerSpacing();
        each(VIEW_NAMES, (index, viewName) => {
          // TODO getView
          // @ts-expect-error
          var view = that.getView(viewName);
          if (view) {
            view.resize();
          }
        });
        this._editorFactoryController && this._editorFactoryController.resize();
      });
    });
  }
  _updateLastSizes($rootElement) {
    this._lastWidth = getWidth($rootElement);
    this._lastHeight = getHeight($rootElement);
    this._devicePixelRatio = getWindow().devicePixelRatio;
  }
  optionChanged(args) {
    switch (args.name) {
      case 'width':
      case 'height':
        this.component._renderDimensions();
        this.resize();
      /* falls through */
      case 'renderAsync':
        args.handled = true;
        return;
      default:
        super.optionChanged(args);
    }
  }
}
export class SynchronizeScrollingController extends modules.ViewController {
  _scrollChangedHandler(views, pos, viewName) {
    for (var j = 0; j < views.length; j++) {
      if (views[j] && views[j].name !== viewName) {
        views[j].scrollTo({
          left: pos.left,
          top: pos.top
        });
      }
    }
  }
  init() {
    var views = [this.getView('columnHeadersView'), this.getView('footerView'), this.getView('rowsView')];
    for (var i = 0; i < views.length; i++) {
      var view = views[i];
      if (view) {
        view.scrollChanged.add(this._scrollChangedHandler.bind(this, views));
      }
    }
  }
}
export class GridView extends modules.View {
  init() {
    this._resizingController = this.getController('resizing');
    this._dataController = this.getController('data');
  }
  _endUpdateCore() {
    if (this.component._requireResize) {
      this.component._requireResize = false;
      this._resizingController.resize();
    }
  }
  getView(name) {
    return this.component._views[name];
  }
  element() {
    return this._groupElement;
  }
  optionChanged(args) {
    var that = this;
    if (isDefined(that._groupElement) && args.name === 'showBorders') {
      that._groupElement.toggleClass(that.addWidgetPrefix(BORDERS_CLASS), !!args.value);
      args.handled = true;
    } else {
      super.optionChanged(args);
    }
  }
  _renderViews($groupElement) {
    var that = this;
    each(VIEW_NAMES, (index, viewName) => {
      // TODO getView
      var view = that.getView(viewName);
      if (view) {
        view.render($groupElement);
      }
    });
  }
  _getTableRoleName() {
    return 'group';
  }
  render($rootElement) {
    var isFirstRender = !this._groupElement;
    var $groupElement = this._groupElement || $('<div>').addClass(this.getWidgetContainerClass());
    $groupElement.addClass(GRIDBASE_CONTAINER_CLASS);
    $groupElement.toggleClass(this.addWidgetPrefix(BORDERS_CLASS), !!this.option('showBorders'));
    this.setAria('role', 'presentation', $rootElement);
    this.component.setAria('role', this._getTableRoleName(), $groupElement);
    this._rootElement = $rootElement || this._rootElement;
    if (isFirstRender) {
      this._groupElement = $groupElement;
      hasWindow() && this._resizingController.updateSize($rootElement);
      $groupElement.appendTo($rootElement);
    }
    if (!this._a11yGeneralStatusElement) {
      this._a11yGeneralStatusElement = A11yStatusContainerComponent({});
      this._a11yGeneralStatusElement.attr(E2E_ATTRIBUTES.a11yStatusContainer, 'true');
      this._rootElement.append(this._a11yGeneralStatusElement);
    }
    this._renderViews($groupElement);
  }
  update() {
    var that = this;
    var $rootElement = that._rootElement;
    var $groupElement = that._groupElement;
    if ($rootElement && $groupElement) {
      this._resizingController.resize();
      if (that._dataController.isLoaded()) {
        that._resizingController.fireContentReadyAction();
      }
    }
  }
  setWidgetA11yStatusText(statusText) {
    var _a;
    (_a = this._a11yGeneralStatusElement) === null || _a === void 0 ? void 0 : _a.text(statusText);
  }
}
export var gridViewModule = {
  defaultOptions() {
    return {
      showBorders: false,
      renderAsync: false
    };
  },
  controllers: {
    resizing: ResizingController,
    synchronizeScrolling: SynchronizeScrollingController
  },
  views: {
    gridView: GridView
  },
  VIEW_NAMES
};