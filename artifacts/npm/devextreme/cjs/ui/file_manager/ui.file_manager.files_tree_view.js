/**
* DevExtreme (cjs/ui/file_manager/ui.file_manager.files_tree_view.js)
* Version: 24.1.1
* Build date: Tue May 07 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.default = void 0;
var _renderer = _interopRequireDefault(require("../../core/renderer"));
var _extend = require("../../core/utils/extend");
var _icon = require("../../core/utils/icon");
var _common = require("../../core/utils/common");
var _ui = _interopRequireDefault(require("../widget/ui.widget"));
var _uiTree_view = _interopRequireDefault(require("../tree_view/ui.tree_view.search"));
var _uiFile_manager = _interopRequireDefault(require("./ui.file_manager.file_actions_button"));
var _deferred = require("../../core/utils/deferred");
var _window = require("../../core/utils/window");
var _type = require("../../core/utils/type");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
const FILE_MANAGER_DIRS_TREE_CLASS = 'dx-filemanager-dirs-tree';
const FILE_MANAGER_DIRS_TREE_FOCUSED_ITEM_CLASS = 'dx-filemanager-focused-item';
const FILE_MANAGER_DIRS_TREE_ITEM_TEXT_CLASS = 'dx-filemanager-dirs-tree-item-text';
const TREE_VIEW_ITEM_CLASS = 'dx-treeview-item';
let FileManagerFilesTreeView = /*#__PURE__*/function (_Widget) {
  _inheritsLoose(FileManagerFilesTreeView, _Widget);
  function FileManagerFilesTreeView() {
    return _Widget.apply(this, arguments) || this;
  }
  var _proto = FileManagerFilesTreeView.prototype;
  _proto._initMarkup = function _initMarkup() {
    this._initActions();
    this._getCurrentDirectory = this.option('getCurrentDirectory');
    this._createFileActionsButton = _common.noop;
    this._storeExpandedState = this.option('storeExpandedState') || false;
    const $treeView = (0, _renderer.default)('<div>').addClass(FILE_MANAGER_DIRS_TREE_CLASS).appendTo(this.$element());
    const treeViewOptions = {
      dataStructure: 'plain',
      rootValue: '',
      createChildren: this._onFilesTreeViewCreateSubDirectories.bind(this),
      itemTemplate: this._createFilesTreeViewItemTemplate.bind(this),
      keyExpr: 'getInternalKey',
      parentIdExpr: 'parentDirectory.getInternalKey',
      displayExpr: itemInfo => itemInfo.getDisplayName(),
      hasItemsExpr: 'fileItem.hasSubDirectories',
      onItemClick: e => this._actions.onDirectoryClick(e),
      onItemExpanded: e => this._onFilesTreeViewItemExpanded(e),
      onItemCollapsed: e => this._onFilesTreeViewItemCollapsed(e),
      onItemRendered: e => this._onFilesTreeViewItemRendered(e),
      onContentReady: () => this._actions.onFilesTreeViewContentReady()
    };
    if (this._contextMenu) {
      this._contextMenu.option('onContextMenuHidden', () => this._onContextMenuHidden());
      treeViewOptions.onItemContextMenu = e => this._onFilesTreeViewItemContextMenu(e);
      this._createFileActionsButton = (element, options) => this._createComponent(element, _uiFile_manager.default, options);
    }
    this._filesTreeView = this._createComponent($treeView, _uiTree_view.default, treeViewOptions);
  };
  _proto._initActions = function _initActions() {
    this._actions = {
      onDirectoryClick: this._createActionByOption('onDirectoryClick'),
      onFilesTreeViewContentReady: this._createActionByOption('onFilesTreeViewContentReady')
    };
  };
  _proto._render = function _render() {
    _Widget.prototype._render.call(this);
    const that = this;
    setTimeout(() => {
      that._updateFocusedElement();
    });
  };
  _proto._onFilesTreeViewCreateSubDirectories = function _onFilesTreeViewCreateSubDirectories(rootItem) {
    const getDirectories = this.option('getDirectories');
    const directoryInfo = rootItem && rootItem.itemData || null;
    return getDirectories && getDirectories(directoryInfo, true);
  };
  _proto._onFilesTreeViewItemRendered = function _onFilesTreeViewItemRendered(_ref) {
    let {
      itemData
    } = _ref;
    const currentDirectory = this._getCurrentDirectory();
    if (currentDirectory && currentDirectory.fileItem.equals(itemData.fileItem)) {
      this._updateFocusedElement();
      this._restoreScrollTopPosition();
    }
  };
  _proto._onFilesTreeViewItemExpanded = function _onFilesTreeViewItemExpanded(_ref2) {
    let {
      itemData
    } = _ref2;
    if (this._storeExpandedState) {
      itemData.expanded = true;
    }
  };
  _proto._onFilesTreeViewItemCollapsed = function _onFilesTreeViewItemCollapsed(_ref3) {
    let {
      itemData
    } = _ref3;
    if (this._storeExpandedState) {
      itemData.expanded = false;
    }
  };
  _proto._createFilesTreeViewItemTemplate = function _createFilesTreeViewItemTemplate(itemData, itemIndex, itemElement) {
    const $itemElement = (0, _renderer.default)(itemElement);
    const $itemWrapper = $itemElement.closest(this._filesTreeViewItemSelector);
    $itemWrapper.data('item', itemData);
    const $image = (0, _icon.getImageContainer)(itemData.icon);
    const $text = (0, _renderer.default)('<span>').text(itemData.getDisplayName()).addClass(FILE_MANAGER_DIRS_TREE_ITEM_TEXT_CLASS);
    const $button = (0, _renderer.default)('<div>');
    $itemElement.append($image, $text, $button);
    this._createFileActionsButton($button, {
      onClick: e => this._onFileItemActionButtonClick(e)
    });
  };
  _proto._onFilesTreeViewItemContextMenu = function _onFilesTreeViewItemContextMenu(_ref4) {
    let {
      itemElement,
      event
    } = _ref4;
    event.preventDefault();
    event.stopPropagation();
    const itemData = (0, _renderer.default)(itemElement).data('item');
    this._contextMenu.showAt([itemData], itemElement, event, {
      itemData,
      itemElement
    });
  };
  _proto._onFileItemActionButtonClick = function _onFileItemActionButtonClick(_ref5) {
    let {
      component,
      element,
      event
    } = _ref5;
    event.stopPropagation();
    const itemElement = component.$element().closest(this._filesTreeViewItemSelector);
    const itemData = itemElement.data('item');
    const target = {
      itemData,
      itemElement,
      isActionButton: true
    };
    this._contextMenu.showAt([itemData], element, event, target);
    this._activeFileActionsButton = component;
    this._activeFileActionsButton.setActive(true);
  };
  _proto._onContextMenuHidden = function _onContextMenuHidden() {
    if (this._activeFileActionsButton) {
      this._activeFileActionsButton.setActive(false);
    }
  };
  _proto.toggleNodeDisabledState = function toggleNodeDisabledState(key, state) {
    const node = this._getNodeByKey(key);
    if (!node) {
      return;
    }
    const items = this._filesTreeView.option('items');
    const itemIndex = items.map(item => item.getInternalKey()).indexOf(node.getInternalKey());
    if (itemIndex !== -1) {
      this._filesTreeView.option("items[".concat(itemIndex, "].disabled"), state);
    }
  };
  _proto._saveScrollTopPosition = function _saveScrollTopPosition() {
    if (!(0, _window.hasWindow)()) {
      return;
    }
    this._scrollTopPosition = this._filesTreeView.getScrollable().scrollTop();
  };
  _proto._restoreScrollTopPosition = function _restoreScrollTopPosition() {
    if (!(0, _window.hasWindow)() || !(0, _type.isNumeric)(this._scrollTopPosition)) {
      return;
    }
    setTimeout(() => this._filesTreeView.getScrollable().scrollTo(this._scrollTopPosition));
  };
  _proto._updateFocusedElement = function _updateFocusedElement() {
    const directoryInfo = this._getCurrentDirectory();
    const $element = this._getItemElementByKey(directoryInfo === null || directoryInfo === void 0 ? void 0 : directoryInfo.getInternalKey());
    if (this._$focusedElement) {
      this._$focusedElement.toggleClass(FILE_MANAGER_DIRS_TREE_FOCUSED_ITEM_CLASS, false);
    }
    this._$focusedElement = $element || (0, _renderer.default)();
    this._$focusedElement.toggleClass(FILE_MANAGER_DIRS_TREE_FOCUSED_ITEM_CLASS, true);
  };
  _proto._getNodeByKey = function _getNodeByKey(key) {
    var _this$_filesTreeView;
    return (_this$_filesTreeView = this._filesTreeView) === null || _this$_filesTreeView === void 0 ? void 0 : _this$_filesTreeView._getNode(key);
  };
  _proto._getPublicNode = function _getPublicNode(key) {
    var _this$_filesTreeView2;
    // eslint-disable-next-line no-unsafe-optional-chaining
    const nodesQueue = [...((_this$_filesTreeView2 = this._filesTreeView) === null || _this$_filesTreeView2 === void 0 ? void 0 : _this$_filesTreeView2.getNodes())];
    while (nodesQueue.length) {
      const node = nodesQueue.shift();
      if (node.itemData.getInternalKey() === key) {
        return node;
      } else if (node.children.length) {
        nodesQueue.push(...node.children);
      }
    }
    return undefined;
  };
  _proto._getItemElementByKey = function _getItemElementByKey(key) {
    const node = this._getNodeByKey(key);
    if (node) {
      const $node = this._filesTreeView._getNodeElement(node);
      if ($node) {
        return $node.children(this._filesTreeViewItemSelector);
      }
    }
    return null;
  };
  _proto._getDefaultOptions = function _getDefaultOptions() {
    return (0, _extend.extend)(_Widget.prototype._getDefaultOptions.call(this), {
      storeExpandedState: false,
      initialFolder: null,
      contextMenu: null,
      getItems: null,
      getCurrentDirectory: null,
      onDirectoryClick: null
    });
  };
  _proto._optionChanged = function _optionChanged(args) {
    const name = args.name;
    switch (name) {
      case 'storeExpandedState':
        this._storeExpandedState = this.option(name);
        break;
      case 'getItems':
      case 'rootFolderDisplayName':
      case 'initialFolder':
      case 'contextMenu':
        this.repaint();
        break;
      case 'getCurrentDirectory':
        this.getCurrentDirectory = this.option(name);
        break;
      case 'onDirectoryClick':
      case 'onFilesTreeViewContentReady':
        this._actions[name] = this._createActionByOption(name);
        break;
      default:
        _Widget.prototype._optionChanged.call(this, args);
    }
  };
  _proto.toggleDirectoryExpandedState = function toggleDirectoryExpandedState(directoryInfo, state) {
    const deferred = new _deferred.Deferred();
    const treeViewNode = this._getPublicNode(directoryInfo === null || directoryInfo === void 0 ? void 0 : directoryInfo.getInternalKey());
    if (!treeViewNode) {
      return deferred.reject().promise();
    }
    if (treeViewNode.expanded === state || treeViewNode.itemsLoaded && !treeViewNode.itemData.fileItem.hasSubDirectories) {
      return deferred.resolve().promise();
    }
    const action = state ? 'expandItem' : 'collapseItem';
    return this._filesTreeView[action](directoryInfo.getInternalKey());
  };
  _proto.refresh = function refresh() {
    this._$focusedElement = null;
    this._saveScrollTopPosition();
    this._filesTreeView.option('dataSource', []);
  };
  _proto.updateCurrentDirectory = function updateCurrentDirectory() {
    if (this._disposed) {
      return;
    }
    this._updateFocusedElement();
    this._storeExpandedState && this._updateExpandedStateToCurrentDirectory();
  };
  _proto._updateExpandedStateToCurrentDirectory = function _updateExpandedStateToCurrentDirectory() {
    return this.toggleDirectoryExpandedStateRecursive(this._getCurrentDirectory().parentDirectory, true);
  };
  _proto.toggleDirectoryExpandedStateRecursive = function toggleDirectoryExpandedStateRecursive(directoryInfo, state) {
    const dirLine = [];
    for (let dirInfo = directoryInfo; dirInfo; dirInfo = dirInfo.parentDirectory) {
      dirLine.unshift(dirInfo);
    }
    return this.toggleDirectoryLineExpandedState(dirLine, state);
  };
  _proto.toggleDirectoryLineExpandedState = function toggleDirectoryLineExpandedState(dirLine, state) {
    if (!dirLine.length) {
      return new _deferred.Deferred().resolve().promise();
    }
    return this.toggleDirectoryExpandedState(dirLine.shift(), state).then(() => this.toggleDirectoryLineExpandedState(dirLine, state));
  };
  _createClass(FileManagerFilesTreeView, [{
    key: "_filesTreeViewItemSelector",
    get: function () {
      return ".".concat(TREE_VIEW_ITEM_CLASS);
    }
  }, {
    key: "_contextMenu",
    get: function () {
      return this.option('contextMenu');
    }
  }]);
  return FileManagerFilesTreeView;
}(_ui.default);
var _default = exports.default = FileManagerFilesTreeView;
module.exports = exports.default;
module.exports.default = exports.default;
