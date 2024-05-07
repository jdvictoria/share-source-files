/**
* DevExtreme (esm/__internal/grids/grid_core/column_chooser/m_column_chooser.js)
* Version: 24.1.1
* Build date: Tue May 07 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
/* eslint-disable max-classes-per-file */
import devices from '../../../../core/devices';
import $ from '../../../../core/renderer';
import { deferUpdate } from '../../../../core/utils/common';
import { extend } from '../../../../core/utils/extend';
import { each } from '../../../../core/utils/iterator';
import { getOuterHeight, getOuterWidth } from '../../../../core/utils/size';
import { isDefined } from '../../../../core/utils/type';
import messageLocalization from '../../../../localization/message';
import Button from '../../../../ui/button';
import Popup from '../../../../ui/popup/ui.popup';
// @ts-expect-error
import { current, isGeneric, isMaterial as isMaterialTheme } from '../../../../ui/themes';
import TreeView from '../../../../ui/tree_view';
import modules from '../m_modules';
import { ColumnsView } from '../views/m_columns_view';
var COLUMN_CHOOSER_CLASS = 'column-chooser';
var COLUMN_CHOOSER_BUTTON_CLASS = 'column-chooser-button';
var NOTOUCH_ACTION_CLASS = 'notouch-action';
var COLUMN_CHOOSER_LIST_CLASS = 'column-chooser-list';
var COLUMN_CHOOSER_PLAIN_CLASS = 'column-chooser-plain';
var COLUMN_CHOOSER_DRAG_CLASS = 'column-chooser-mode-drag';
var COLUMN_CHOOSER_SELECT_CLASS = 'column-chooser-mode-select';
var COLUMN_CHOOSER_ICON_NAME = 'column-chooser';
var COLUMN_CHOOSER_ITEM_CLASS = 'dx-column-chooser-item';
var COLUMN_OPTIONS_USED_IN_ITEMS = ['showInColumnChooser', 'caption', 'allowHiding', 'visible', 'cssClass', 'ownerBand'];
var processItems = function processItems(that, chooserColumns) {
  var items = [];
  var isSelectMode = that.isSelectMode();
  var isRecursive = that.option('columnChooser.selection.recursive');
  if (chooserColumns.length) {
    each(chooserColumns, (index, column) => {
      var item = {
        text: column.caption,
        cssClass: column.cssClass,
        allowHiding: column.allowHiding,
        expanded: true,
        id: column.index,
        disabled: column.allowHiding === false,
        parentId: isDefined(column.ownerBand) ? column.ownerBand : null
      };
      var isRecursiveWithColumns = isRecursive && column.hasColumns;
      if (isSelectMode && !isRecursiveWithColumns) {
        item.selected = column.visible;
      }
      items.push(item);
    });
  }
  return items;
};
export class ColumnChooserController extends modules.ViewController {
  init() {
    super.init();
    this._rowsView = this.getView('rowsView');
  }
  renderShowColumnChooserButton($element) {
    var that = this;
    var columnChooserButtonClass = that.addWidgetPrefix(COLUMN_CHOOSER_BUTTON_CLASS);
    var columnChooserEnabled = that.option('columnChooser.enabled');
    var $showColumnChooserButton = $element.find(".".concat(columnChooserButtonClass));
    var $columnChooserButton;
    if (columnChooserEnabled) {
      if (!$showColumnChooserButton.length) {
        $columnChooserButton = $('<div>').addClass(columnChooserButtonClass).appendTo($element);
        that._createComponent($columnChooserButton, Button, {
          icon: COLUMN_CHOOSER_ICON_NAME,
          onClick() {
            // TODO getView
            that.getView('columnChooserView').showColumnChooser();
          },
          hint: that.option('columnChooser.title'),
          // @ts-expect-error
          integrationOptions: {}
        });
      } else {
        $showColumnChooserButton.show();
      }
    } else {
      $showColumnChooserButton.hide();
    }
  }
  getPosition() {
    var position = this.option('columnChooser.position');
    return isDefined(position) ? position : {
      my: 'right bottom',
      at: 'right bottom',
      of: this._rowsView && this._rowsView.element(),
      collision: 'fit',
      offset: '-2 -2',
      boundaryOffset: '2 2'
    };
  }
}
export class ColumnChooserView extends ColumnsView {
  optionChanged(args) {
    switch (args.name) {
      case 'columnChooser':
        this._initializePopupContainer();
        this.render(null, 'full');
        break;
      default:
        super.optionChanged(args);
    }
  }
  publicMethods() {
    return ['showColumnChooser', 'hideColumnChooser'];
  }
  _resizeCore() {}
  _isWinDevice() {
    // @ts-expect-error
    return !!devices.real().win;
  }
  _initializePopupContainer() {
    var that = this;
    var columnChooserClass = that.addWidgetPrefix(COLUMN_CHOOSER_CLASS);
    var $element = that.element().addClass(columnChooserClass);
    var columnChooserOptions = that.option('columnChooser');
    var popupPosition = this._columnChooserController.getPosition();
    var themeName = current();
    var isGenericTheme = isGeneric(themeName);
    var isMaterial = isMaterialTheme(themeName);
    var dxPopupOptions = {
      visible: false,
      shading: false,
      showCloseButton: false,
      dragEnabled: true,
      resizeEnabled: true,
      wrapperAttr: {
        class: columnChooserClass
      },
      toolbarItems: [{
        text: columnChooserOptions.title,
        toolbar: 'top',
        location: isGenericTheme || isMaterial ? 'before' : 'center'
      }],
      position: popupPosition,
      width: columnChooserOptions.width,
      height: columnChooserOptions.height,
      rtlEnabled: that.option('rtlEnabled'),
      onHidden() {
        if (that._isWinDevice()) {
          $('body').removeClass(that.addWidgetPrefix(NOTOUCH_ACTION_CLASS));
        }
      },
      container: columnChooserOptions.container
    };
    if (isGenericTheme || isMaterial) {
      extend(dxPopupOptions, {
        showCloseButton: true
      });
    } else {
      // @ts-expect-error
      dxPopupOptions.toolbarItems[dxPopupOptions.toolbarItems.length] = {
        shortcut: 'cancel'
      };
    }
    if (!isDefined(this._popupContainer)) {
      that._popupContainer = that._createComponent($element, Popup, dxPopupOptions);
      that._popupContainer.on('optionChanged', args => {
        if (args.name === 'visible') {
          that.renderCompleted.fire();
        }
      });
    } else {
      this._popupContainer.option(dxPopupOptions);
    }
    this.setPopupAttributes();
  }
  setPopupAttributes() {
    var isSelectMode = this.isSelectMode();
    var isBandColumnsUsed = this._columnsController.isBandColumnsUsed();
    this._popupContainer.setAria({
      role: 'dialog',
      label: messageLocalization.format('dxDataGrid-columnChooserTitle')
    });
    this._popupContainer.$wrapper().toggleClass(this.addWidgetPrefix(COLUMN_CHOOSER_DRAG_CLASS), !isSelectMode).toggleClass(this.addWidgetPrefix(COLUMN_CHOOSER_SELECT_CLASS), isSelectMode);
    this._popupContainer.$content().addClass(this.addWidgetPrefix(COLUMN_CHOOSER_LIST_CLASS));
    if (isSelectMode && !isBandColumnsUsed) {
      this._popupContainer.$content().addClass(this.addWidgetPrefix(COLUMN_CHOOSER_PLAIN_CLASS));
    }
  }
  _renderCore(change) {
    if (this._popupContainer) {
      var isDragMode = !this.isSelectMode();
      if (!this._columnChooserList || change === 'full') {
        this._renderTreeView();
      } else if (isDragMode) {
        this._updateItems();
      }
    }
  }
  _renderTreeView() {
    var _a, _b, _c;
    var that = this;
    var $container = this._popupContainer.$content();
    var columnChooser = this.option('columnChooser');
    var isSelectMode = this.isSelectMode();
    var searchEnabled = isDefined(columnChooser.allowSearch) ? columnChooser.allowSearch : (_a = columnChooser.search) === null || _a === void 0 ? void 0 : _a.enabled;
    var searchTimeout = isDefined(columnChooser.searchTimeout) ? columnChooser.searchTimeout : (_b = columnChooser.search) === null || _b === void 0 ? void 0 : _b.timeout;
    var treeViewConfig = {
      dataStructure: 'plain',
      activeStateEnabled: true,
      focusStateEnabled: true,
      hoverStateEnabled: true,
      itemTemplate: 'item',
      showCheckBoxesMode: 'none',
      rootValue: null,
      searchEnabled,
      searchTimeout,
      searchEditorOptions: (_c = columnChooser.search) === null || _c === void 0 ? void 0 : _c.editorOptions
    };
    if (this._isWinDevice()) {
      treeViewConfig.useNativeScrolling = false;
    }
    extend(treeViewConfig, isSelectMode ? this._prepareSelectModeConfig() : this._prepareDragModeConfig());
    if (this._columnChooserList) {
      if (!treeViewConfig.searchEnabled) {
        treeViewConfig.searchValue = '';
      }
      this._columnChooserList.option(treeViewConfig);
      // we need to set items after setting selectNodesRecursive, so they will be processed correctly inside TreeView
      this._updateItems();
    } else {
      this._columnChooserList = this._createComponent($container, TreeView, treeViewConfig);
      // we need to set items after setting selectNodesRecursive, so they will be processed correctly inside TreeView
      this._updateItems();
      var scrollTop = 0;
      this._columnChooserList.on('optionChanged', e => {
        var scrollable = e.component.getScrollable();
        scrollTop = scrollable.scrollTop();
      });
      this._columnChooserList.on('contentReady', e => {
        deferUpdate(() => {
          var scrollable = e.component.getScrollable();
          scrollable.scrollTo({
            y: scrollTop
          });
          that.renderCompleted.fire();
        });
      });
    }
  }
  _prepareDragModeConfig() {
    var columnChooserOptions = this.option('columnChooser');
    return {
      noDataText: columnChooserOptions.emptyPanelText,
      activeStateEnabled: false,
      focusStateEnabled: false,
      hoverStateEnabled: false,
      itemTemplate(data, index, item) {
        $(item).text(data.text).parent().addClass(data.cssClass).addClass(COLUMN_CHOOSER_ITEM_CLASS);
      }
    };
  }
  _prepareSelectModeConfig() {
    var _a;
    var that = this;
    var selectionOptions = (_a = this.option('columnChooser.selection')) !== null && _a !== void 0 ? _a : {};
    var getFlatNodes = nodes => {
      var addNodesToArray = (nodes, flatNodesArray) => nodes.reduce((result, node) => {
        result.push(node);
        if (node.children.length) {
          addNodesToArray(node.children, result);
        }
        return result;
      }, flatNodesArray);
      return addNodesToArray(nodes, []);
    };
    var updateSelection = (e, nodes) => {
      nodes.filter(node => node.itemData.allowHiding === false).forEach(node => e.component.selectItem(node.key));
    };
    var updateColumnVisibility = nodes => {
      nodes.forEach(node => {
        var columnIndex = node.itemData.id;
        var isVisible = node.selected !== false;
        that._columnsController.columnOption(columnIndex, 'visible', isVisible);
      });
    };
    var isUpdatingSelection = false;
    var selectionChangedHandler = e => {
      if (isUpdatingSelection) {
        return;
      }
      var nodes = getFlatNodes(e.component.getNodes());
      e.component.beginUpdate();
      isUpdatingSelection = true;
      updateSelection(e, nodes);
      e.component.endUpdate();
      isUpdatingSelection = false;
      that.component.beginUpdate();
      this._isUpdatingColumnVisibility = true;
      updateColumnVisibility(nodes);
      that.component.endUpdate();
      this._isUpdatingColumnVisibility = false;
    };
    return {
      selectByClick: selectionOptions.selectByClick,
      selectNodesRecursive: selectionOptions.recursive,
      showCheckBoxesMode: selectionOptions.allowSelectAll ? 'selectAll' : 'normal',
      onSelectionChanged: selectionChangedHandler
    };
  }
  _updateItems() {
    var isSelectMode = this.isSelectMode();
    var chooserColumns = this._columnsController.getChooserColumns(isSelectMode);
    var items = processItems(this, chooserColumns);
    this._columnChooserList.option('items', items);
  }
  _updateItemsSelection(columnIndices) {
    var changedColumns = columnIndices === null || columnIndices === void 0 ? void 0 : columnIndices.map(columnIndex => this._columnsController.columnOption(columnIndex));
    this._columnChooserList.beginUpdate();
    changedColumns === null || changedColumns === void 0 ? void 0 : changedColumns.forEach(_ref => {
      var {
        visible,
        index
      } = _ref;
      if (visible) {
        this._columnChooserList.selectItem(index);
      } else {
        this._columnChooserList.unselectItem(index);
      }
    });
    this._columnChooserList.endUpdate();
  }
  _columnOptionChanged(e) {
    super._columnOptionChanged(e);
    var isSelectMode = this.isSelectMode();
    if (isSelectMode && this._columnChooserList && !this._isUpdatingColumnVisibility) {
      var {
        optionNames
      } = e;
      var onlyVisibleChanged = optionNames.visible && optionNames.length === 1;
      var columnIndices = isDefined(e.columnIndex) ? [e.columnIndex] : e.columnIndices;
      var needUpdate = COLUMN_OPTIONS_USED_IN_ITEMS.some(optionName => optionNames[optionName]) || e.changeTypes.columns && optionNames.all;
      if (needUpdate) {
        this._updateItemsSelection(columnIndices);
        if (!onlyVisibleChanged) {
          this._updateItems();
        }
      }
    }
  }
  getColumnElements() {
    var result = [];
    var isSelectMode = this.isSelectMode();
    var chooserColumns = this._columnsController.getChooserColumns(isSelectMode);
    var $content = this._popupContainer && this._popupContainer.$content();
    var $nodes = $content && $content.find('.dx-treeview-node');
    if ($nodes) {
      chooserColumns.forEach(column => {
        var $node = $nodes.filter("[data-item-id = '".concat(column.index, "']"));
        var item = $node.length ? $node.children(".".concat(COLUMN_CHOOSER_ITEM_CLASS)).get(0) : null;
        result.push(item);
      });
    }
    return $(result);
  }
  getName() {
    return 'columnChooser';
  }
  getColumns() {
    return this._columnsController.getChooserColumns();
  }
  allowDragging(column) {
    var isParentColumnVisible = this._columnsController.isParentColumnVisible(column.index);
    var isColumnHidden = !column.visible && column.allowHiding;
    return this.isColumnChooserVisible() && isParentColumnVisible && isColumnHidden;
  }
  allowColumnHeaderDragging(column) {
    var isDragMode = !this.isSelectMode();
    return isDragMode && this.isColumnChooserVisible() && column.allowHiding;
  }
  getBoundingRect() {
    var that = this;
    var container = that._popupContainer && that._popupContainer.$overlayContent();
    if (container && container.is(':visible')) {
      var offset = container.offset();
      return {
        left: offset.left,
        top: offset.top,
        right: offset.left + getOuterWidth(container),
        bottom: offset.top + getOuterHeight(container)
      };
    }
    return null;
  }
  showColumnChooser() {
    if (!this._popupContainer) {
      this._initializePopupContainer();
      this.render();
    }
    this._popupContainer.show();
    if (this._isWinDevice()) {
      $('body').addClass(this.addWidgetPrefix(NOTOUCH_ACTION_CLASS));
    }
  }
  hideColumnChooser() {
    if (this._popupContainer) {
      this._popupContainer.hide();
    }
  }
  isColumnChooserVisible() {
    var popupContainer = this._popupContainer;
    return popupContainer && popupContainer.option('visible');
  }
  isSelectMode() {
    return this.option('columnChooser.mode') === 'select';
  }
  hasHiddenColumns() {
    var isEnabled = this.option('columnChooser.enabled');
    var hiddenColumns = this.getColumns().filter(column => !column.visible);
    return isEnabled && hiddenColumns.length;
  }
}
var headerPanel = Base => class ColumnChooserHeaderPanelExtender extends Base {
  _getToolbarItems() {
    var items = super._getToolbarItems();
    return this._appendColumnChooserItem(items);
  }
  _appendColumnChooserItem(items) {
    var that = this;
    var columnChooserEnabled = that.option('columnChooser.enabled');
    if (columnChooserEnabled) {
      var onClickHandler = function onClickHandler() {
        // TODO getView
        that.component.getView('columnChooserView').showColumnChooser();
      };
      var onInitialized = function onInitialized(e) {
        $(e.element).addClass(that._getToolbarButtonClass(that.addWidgetPrefix(COLUMN_CHOOSER_BUTTON_CLASS)));
      };
      var hintText = that.option('columnChooser.title');
      var toolbarItem = {
        widget: 'dxButton',
        options: {
          icon: COLUMN_CHOOSER_ICON_NAME,
          onClick: onClickHandler,
          hint: hintText,
          text: hintText,
          onInitialized,
          elementAttr: {
            'aria-haspopup': 'dialog'
          }
        },
        showText: 'inMenu',
        location: 'after',
        name: 'columnChooserButton',
        locateInMenu: 'auto',
        sortIndex: 40
      };
      items.push(toolbarItem);
    }
    return items;
  }
  optionChanged(args) {
    switch (args.name) {
      case 'columnChooser':
        this._invalidate();
        args.handled = true;
        break;
      default:
        super.optionChanged(args);
    }
  }
  isVisible() {
    var that = this;
    var columnChooserEnabled = that.option('columnChooser.enabled');
    return super.isVisible() || columnChooserEnabled;
  }
};
var columns = Base => class ColumnsChooserColumnsControllerExtender extends Base {
  allowMoveColumn(fromVisibleIndex, toVisibleIndex, sourceLocation, targetLocation) {
    var isSelectMode = this.option('columnChooser.mode') === 'select';
    var isMoveColumnDisallowed = isSelectMode && targetLocation === 'columnChooser';
    return isMoveColumnDisallowed ? false : super.allowMoveColumn(fromVisibleIndex, toVisibleIndex, sourceLocation, targetLocation);
  }
};
var columnHeadersView = Base => class ColumnChooserColumnHeadersExtender extends Base {
  allowDragging(column) {
    var isDragMode = !this._columnChooserView.isSelectMode();
    var isColumnChooserVisible = this._columnChooserView.isColumnChooserVisible();
    return isDragMode && isColumnChooserVisible && column.allowHiding || super.allowDragging(column);
  }
};
export var columnChooserModule = {
  defaultOptions() {
    return {
      columnChooser: {
        enabled: false,
        search: {
          enabled: false,
          timeout: 500,
          editorOptions: {}
        },
        selection: {
          allowSelectAll: false,
          selectByClick: false,
          recursive: false
        },
        position: undefined,
        mode: 'dragAndDrop',
        width: 250,
        height: 260,
        title: messageLocalization.format('dxDataGrid-columnChooserTitle'),
        emptyPanelText: messageLocalization.format('dxDataGrid-columnChooserEmptyText'),
        // TODO private option
        container: undefined
      }
    };
  },
  controllers: {
    columnChooser: ColumnChooserController
  },
  views: {
    columnChooserView: ColumnChooserView
  },
  extenders: {
    views: {
      headerPanel,
      columnHeadersView
    },
    controllers: {
      columns
    }
  }
};
