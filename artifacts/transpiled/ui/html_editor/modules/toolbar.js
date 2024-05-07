"use strict";

exports.default = void 0;
var _devextremeQuill = _interopRequireDefault(require("devextreme-quill"));
var _renderer = _interopRequireDefault(require("../../../core/renderer"));
var _base = _interopRequireDefault(require("./base"));
var _toolbar = _interopRequireDefault(require("../../toolbar"));
require("../../select_box");
require("../../color_box/color_view");
require("../../number_box");
var _ui = _interopRequireDefault(require("../../widget/ui.errors"));
var _widget_collector = _interopRequireDefault(require("./widget_collector"));
var _iterator = require("../../../core/utils/iterator");
var _type = require("../../../core/utils/type");
var _extend = require("../../../core/utils/extend");
var _message = _interopRequireDefault(require("../../../localization/message"));
var _inflector = require("../../../core/utils/inflector");
var _events_engine = _interopRequireDefault(require("../../../events/core/events_engine"));
var _index = require("../../../events/utils/index");
var _table_helper = require("../utils/table_helper");
var _toolbar_helper = require("../utils/toolbar_helper");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
let ToolbarModule = _base.default;
if (_devextremeQuill.default) {
  const TOOLBAR_WRAPPER_CLASS = 'dx-htmleditor-toolbar-wrapper';
  const TOOLBAR_CLASS = 'dx-htmleditor-toolbar';
  const TOOLBAR_FORMAT_WIDGET_CLASS = 'dx-htmleditor-toolbar-format';
  const TOOLBAR_SEPARATOR_CLASS = 'dx-htmleditor-toolbar-separator';
  const TOOLBAR_MENU_SEPARATOR_CLASS = 'dx-htmleditor-toolbar-menu-separator';
  const ACTIVE_FORMAT_CLASS = 'dx-format-active';
  const SELECTED_STATE_CLASS = 'dx-state-selected';
  const ICON_CLASS = 'dx-icon';
  const SELECTION_CHANGE_EVENT = 'selection-change';
  const USER_ACTION = 'user';
  const SILENT_ACTION = 'silent';
  const FORMAT_HOTKEYS = {
    66: 'bold',
    73: 'italic',
    85: 'underline'
  };
  const KEY_CODES = {
    b: 66,
    i: 73,
    u: 85
  };
  const localize = name => {
    return _message.default.format("dxHtmlEditor-".concat((0, _inflector.camelize)(name)));
  };
  const localizeValue = (value, name) => {
    if (name === 'header') {
      const isHeaderValue = (0, _type.isDefined)(value) && value !== false;
      return isHeaderValue ? "".concat(localize('heading'), " ").concat(value) : localize('normalText');
    }
    return localize(value) || value;
  };
  ToolbarModule = /*#__PURE__*/function (_BaseModule) {
    _inheritsLoose(ToolbarModule, _BaseModule);
    function ToolbarModule(quill, options) {
      var _this;
      _this = _BaseModule.call(this, quill, options) || this;
      _this._toolbarWidgets = new _widget_collector.default();
      _this._formatHandlers = (0, _toolbar_helper.getFormatHandlers)(_assertThisInitialized(_this));
      _this._tableFormats = (0, _table_helper.getTableFormats)(quill);
      if ((0, _type.isDefined)(options.items)) {
        _this._addCallbacks();
        _this._renderToolbar();

        // NOTE: Fixes the synchronization of the states of items placed in a menu that is rendered postponed.
        // See bug t1117604: menu items' state could be updated after selection change before the menu is rendered.
        // We cannot just modify items' state using a toolbar api because of:
        // - runtime adding in-line styles for color formats' icon;
        // - "dx-format-active" class toggling (using elementAttr will trigger toolbar item rerendering);
        // - changing the value of non-button items.
        // Possible better solutions:
        // - rework or extend a toolbar menu api or life cycle;
        // - support a separate cache for toolbar items' state and apply it on each item's initialization.
        const toolbarMenu = _this.toolbarInstance._layoutStrategy._menu;
        if (toolbarMenu) {
          const _renderPopup = toolbarMenu._renderPopup;
          toolbarMenu._renderPopup = function () {
            for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
              args[_key] = arguments[_key];
            }
            _renderPopup.apply(toolbarMenu, ...args);
            toolbarMenu._popup.on('showing', () => {
              _this._updateToolbar(true);
            });
          };
        }
        _this.quill.on('editor-change', (eventName, newValue, oldValue, eventSource) => {
          const isSilentMode = eventSource === SILENT_ACTION && (0, _type.isEmptyObject)(_this.quill.getFormat());
          if (!isSilentMode) {
            const isSelectionChanged = eventName === SELECTION_CHANGE_EVENT;
            _this._updateToolbar(isSelectionChanged);
          }
        });
      }
      return _this;
    }
    var _proto = ToolbarModule.prototype;
    _proto._addCallbacks = function _addCallbacks() {
      this.addCleanCallback(this.clean.bind(this));
      this.editorInstance.addContentInitializedCallback(this.updateHistoryWidgets.bind(this));
    };
    _proto._updateToolbar = function _updateToolbar(isSelectionChanged) {
      this.updateFormatWidgets(isSelectionChanged);
      this.updateHistoryWidgets();
      this.updateTableWidgets();
    };
    _proto._updateFormatWidget = function _updateFormatWidget(name, isApplied, formats) {
      const widget = this._toolbarWidgets.getByName(name);
      if (!widget) {
        return;
      }
      if (isApplied) {
        this._markActiveFormatWidget(name, widget, formats);
      } else {
        this._resetFormatWidget(name, widget);
        if (Object.prototype.hasOwnProperty.call(name)) {
          delete formats[name];
        }
      }
      this._toggleClearFormatting(isApplied || !(0, _type.isEmptyObject)(formats));
    };
    _proto._renderToolbar = function _renderToolbar() {
      const container = this.options.container || this._getContainer();
      this._$toolbar = (0, _renderer.default)('<div>').addClass(TOOLBAR_CLASS).appendTo(container);
      this._$toolbarContainer = (0, _renderer.default)(container).addClass(TOOLBAR_WRAPPER_CLASS);
      _events_engine.default.on(this._$toolbarContainer, (0, _index.addNamespace)('mousedown', this.editorInstance.NAME), e => {
        e.target.focus();
        e.preventDefault();
      });
      this._subscribeFormatHotKeys();
      this.toolbarInstance = this.editorInstance._createComponent(this._$toolbar, _toolbar.default, this.toolbarConfig);
      this.editorInstance.on('optionChanged', _ref => {
        let {
          name
        } = _ref;
        if (name === 'readOnly' || name === 'disabled') {
          this.toolbarInstance.option('disabled', this.isInteractionDisabled);
        }
      });
    };
    _proto.isMultilineMode = function isMultilineMode() {
      var _this$options$multili;
      return (_this$options$multili = this.options.multiline) !== null && _this$options$multili !== void 0 ? _this$options$multili : true;
    };
    _proto.clean = function clean() {
      this._toolbarWidgets.clear();
      if (this._$toolbarContainer) {
        this._$toolbarContainer.empty().removeClass(TOOLBAR_WRAPPER_CLASS);
      }
    };
    _proto.repaint = function repaint() {
      this.toolbarInstance && this.toolbarInstance.repaint();
    };
    _proto._getContainer = function _getContainer() {
      const $container = (0, _renderer.default)('<div>');
      this.editorInstance.$element().prepend($container);
      return $container;
    };
    _proto._detectRenamedOptions = function _detectRenamedOptions(item) {
      const optionsInfo = [{
        newName: 'name',
        oldName: 'formatName'
      }, {
        newName: 'acceptedValues',
        oldName: 'formatValues'
      }];
      if ((0, _type.isObject)(item)) {
        (0, _iterator.each)(optionsInfo, (index, optionName) => {
          if (Object.prototype.hasOwnProperty.call(item, optionName.oldName)) {
            _ui.default.log('W1016', optionName.oldName, optionName.newName);
          }
        });
      }
    };
    _proto._subscribeFormatHotKeys = function _subscribeFormatHotKeys() {
      this.quill.keyboard.addBinding({
        which: KEY_CODES.b,
        shortKey: true
      }, this._handleFormatHotKey.bind(this));
      this.quill.keyboard.addBinding({
        which: KEY_CODES.i,
        shortKey: true
      }, this._handleFormatHotKey.bind(this));
      this.quill.keyboard.addBinding({
        which: KEY_CODES.u,
        shortKey: true
      }, this._handleFormatHotKey.bind(this));
    };
    _proto._handleFormatHotKey = function _handleFormatHotKey(range, context, _ref2) {
      let {
        which
      } = _ref2;
      const formatName = FORMAT_HOTKEYS[which];
      this._updateButtonState(formatName);
    };
    _proto._updateButtonState = function _updateButtonState(formatName) {
      const formatWidget = this._toolbarWidgets.getByName(formatName);
      const currentFormat = this.quill.getFormat();
      const formatValue = currentFormat[formatName];
      if (formatValue) {
        this._markActiveFormatWidget(formatName, formatWidget, currentFormat);
      } else {
        this._resetFormatWidget(formatName, formatWidget);
      }
    };
    _proto._prepareToolbarItems = function _prepareToolbarItems() {
      const resultItems = [];
      (0, _iterator.each)(this.options.items, (index, item) => {
        let newItem;
        this._detectRenamedOptions(item);
        if ((0, _type.isObject)(item)) {
          newItem = this._handleObjectItem(item);
        } else if ((0, _type.isString)(item)) {
          const buttonItemConfig = this._prepareButtonItemConfig(item);
          newItem = this._getToolbarItem(buttonItemConfig);
        }
        if (newItem) {
          resultItems.push(newItem);
        }
      });
      return resultItems;
    };
    _proto._handleObjectItem = function _handleObjectItem(item) {
      if (item.name && item.acceptedValues && this._isAcceptableItem(item.widget, 'dxSelectBox')) {
        const selectItemConfig = this._prepareSelectItemConfig(item);
        return this._getToolbarItem(selectItemConfig);
      } else if (item.name && this._isAcceptableItem(item.widget, 'dxButton')) {
        const defaultButtonItemConfig = this._prepareButtonItemConfig(item.name);
        const buttonItemConfig = (0, _extend.extend)(true, defaultButtonItemConfig, item);
        return this._getToolbarItem(buttonItemConfig);
      } else {
        return this._getToolbarItem(item);
      }
    };
    _proto._isAcceptableItem = function _isAcceptableItem(widget, acceptableWidgetName) {
      return !widget || widget === acceptableWidgetName;
    };
    _proto._prepareButtonItemConfig = function _prepareButtonItemConfig(name) {
      var _ICON_MAP$name;
      const iconName = (_ICON_MAP$name = _toolbar_helper.ICON_MAP[name]) !== null && _ICON_MAP$name !== void 0 ? _ICON_MAP$name : name;
      const buttonText = (0, _inflector.titleize)(name);
      return {
        widget: 'dxButton',
        name,
        options: {
          hint: localize(buttonText),
          text: localize(buttonText),
          icon: iconName.toLowerCase(),
          onClick: this._formatHandlers[name] || (0, _toolbar_helper.getDefaultClickHandler)(this, name),
          stylingMode: 'text'
        },
        showText: 'inMenu'
      };
    };
    _proto._prepareSelectItemConfig = function _prepareSelectItemConfig(item) {
      const {
        name,
        acceptedValues
      } = item;
      return (0, _extend.extend)(true, {
        widget: 'dxSelectBox',
        name,
        options: {
          stylingMode: 'filled',
          dataSource: acceptedValues,
          displayExpr: value => {
            return localizeValue(value, name);
          },
          placeholder: localize(name),
          onValueChanged: e => {
            if (!this._isReset) {
              this._hideAdaptiveMenu();
              (0, _toolbar_helper.applyFormat)(this, [name, e.value, USER_ACTION], e.event);
              this._setValueSilent(e.component, e.value);
            }
          }
        }
      }, item);
    };
    _proto._hideAdaptiveMenu = function _hideAdaptiveMenu() {
      if (this.toolbarInstance.option('overflowMenuVisible')) {
        this.toolbarInstance.option('overflowMenuVisible', false);
      }
    };
    _proto._getToolbarItem = function _getToolbarItem(item) {
      const baseItem = {
        options: {
          onInitialized: e => {
            if (item.name) {
              e.component.$element().addClass(TOOLBAR_FORMAT_WIDGET_CLASS);
              e.component.$element().toggleClass("dx-".concat(item.name.toLowerCase(), "-format"), !!item.name);
              this._toolbarWidgets.add(item.name, e.component);
            }
          },
          onDisposing: () => {
            this._toolbarWidgets.remove(item.name);
          }
        }
      };
      return (0, _extend.extend)(true, {
        location: 'before',
        locateInMenu: 'auto'
      }, this._getDefaultConfig(item.name), item, baseItem);
    };
    _proto._getDefaultItemsConfig = function _getDefaultItemsConfig() {
      return {
        clear: {
          options: {
            disabled: true
          }
        },
        undo: {
          options: {
            disabled: true
          }
        },
        redo: {
          options: {
            disabled: true
          }
        },
        // ToDo: move it to the table module
        insertRowAbove: {
          options: {
            disabled: true
          }
        },
        insertRowBelow: {
          options: {
            disabled: true
          }
        },
        insertHeaderRow: {
          options: {
            disabled: true
          }
        },
        insertColumnLeft: {
          options: {
            disabled: true
          }
        },
        insertColumnRight: {
          options: {
            disabled: true
          }
        },
        deleteRow: {
          options: {
            disabled: true
          }
        },
        deleteColumn: {
          options: {
            disabled: true
          }
        },
        deleteTable: {
          options: {
            disabled: true
          }
        },
        cellProperties: {
          options: {
            disabled: true
          }
        },
        tableProperties: {
          options: {
            disabled: true
          }
        },
        separator: {
          template: (data, index, element) => {
            (0, _renderer.default)(element).addClass(TOOLBAR_SEPARATOR_CLASS);
          },
          menuItemTemplate: (data, index, element) => {
            (0, _renderer.default)(element).addClass(TOOLBAR_MENU_SEPARATOR_CLASS);
          }
        }
      };
    };
    _proto._getDefaultConfig = function _getDefaultConfig(name) {
      return this._getDefaultItemsConfig()[name];
    };
    _proto.updateHistoryWidgets = function updateHistoryWidgets() {
      const historyModule = this.quill.history;
      if (!historyModule) {
        return;
      }
      const {
        undo: undoOps,
        redo: redoOps
      } = historyModule.stack;
      this._updateManipulationWidget(this._toolbarWidgets.getByName('undo'), Boolean(undoOps.length));
      this._updateManipulationWidget(this._toolbarWidgets.getByName('redo'), Boolean(redoOps.length));
    };
    _proto.updateTableWidgets = function updateTableWidgets() {
      const table = this.quill.getModule('table');
      if (!table) {
        return;
      }
      const selection = this.quill.getSelection();
      const formats = selection && this.quill.getFormat(selection) || {};
      const isTableOperationsEnabled = this._tableFormats.some(format => Boolean(formats[format]));
      _table_helper.TABLE_OPERATIONS.forEach(operationName => {
        const isInsertTable = operationName === 'insertTable';
        const widget = this._toolbarWidgets.getByName(operationName);
        this._updateManipulationWidget(widget, isInsertTable ? !isTableOperationsEnabled : isTableOperationsEnabled);
      });
    };
    _proto._updateManipulationWidget = function _updateManipulationWidget(widget, isOperationEnabled) {
      if (!widget) {
        return;
      }
      widget.option('disabled', !isOperationEnabled);
    };
    _proto.updateFormatWidgets = function updateFormatWidgets(isResetRequired) {
      const selection = this.quill.getSelection();
      if (!selection) {
        return;
      }
      const formats = this.quill.getFormat(selection);
      const hasFormats = !(0, _type.isEmptyObject)(formats);
      if (!hasFormats || isResetRequired) {
        this._resetFormatWidgets();
      }
      for (const formatName in formats) {
        const widgetName = this._getFormatWidgetName(formatName, formats);
        const formatWidget = this._toolbarWidgets.getByName(widgetName) || this._toolbarWidgets.getByName(formatName);
        if (!formatWidget) {
          continue;
        }
        this._markActiveFormatWidget(formatName, formatWidget, formats);
      }
      this._toggleClearFormatting(hasFormats || selection.length > 1);
    };
    _proto._markActiveFormatWidget = function _markActiveFormatWidget(name, widget, formats) {
      if (this._isColorFormat(name)) {
        this._updateColorWidget(name, formats[name]);
      }
      if ('value' in widget.option()) {
        this._setValueSilent(widget, formats[name]);
      } else {
        widget.$element().addClass(ACTIVE_FORMAT_CLASS);
        widget.$element().addClass(SELECTED_STATE_CLASS);
      }
    };
    _proto._toggleClearFormatting = function _toggleClearFormatting(hasFormats) {
      const clearWidget = this._toolbarWidgets.getByName('clear');
      if (clearWidget) {
        clearWidget.option('disabled', !hasFormats);
      }
    };
    _proto._isColorFormat = function _isColorFormat(name) {
      return name === 'color' || name === 'background';
    };
    _proto._updateColorWidget = function _updateColorWidget(name, color) {
      const formatWidget = this._toolbarWidgets.getByName(name);
      if (!formatWidget) {
        return;
      }
      formatWidget.$element().find(".".concat(ICON_CLASS)).css('borderBottomColor', color || 'transparent');
    };
    _proto._getFormatWidgetName = function _getFormatWidgetName(name, formats) {
      let widgetName;
      switch (name) {
        case 'align':
          widgetName = name + (0, _inflector.titleize)(formats[name]);
          break;
        case 'list':
          widgetName = formats[name] + (0, _inflector.titleize)(name);
          break;
        case 'code-block':
          widgetName = 'codeBlock';
          break;
        case 'script':
          widgetName = formats[name] + name;
          break;
        case 'imageSrc':
          widgetName = 'image';
          break;
        default:
          widgetName = name;
      }
      return widgetName;
    };
    _proto._setValueSilent = function _setValueSilent(widget, value) {
      this._isReset = true;
      widget.option('value', value);
      this._isReset = false;
    };
    _proto._resetFormatWidgets = function _resetFormatWidgets() {
      this._toolbarWidgets.each((name, widget) => {
        this._resetFormatWidget(name, widget);
      });
    };
    _proto._resetFormatWidget = function _resetFormatWidget(name, widget) {
      widget.$element().removeClass(ACTIVE_FORMAT_CLASS);
      widget.$element().removeClass(SELECTED_STATE_CLASS);
      if (this._isColorFormat(name)) {
        this._updateColorWidget(name);
      }
      if (name === 'clear') {
        widget.option('disabled', true);
      }
      if (widget.NAME === 'dxSelectBox') {
        this._setValueSilent(widget, null);
      }
    };
    _proto.addClickHandler = function addClickHandler(name, handler) {
      this._formatHandlers[name] = handler;
      const formatWidget = this._toolbarWidgets.getByName(name);
      if (formatWidget && formatWidget.NAME === 'dxButton') {
        formatWidget.option('onClick', handler);
      }
    };
    _createClass(ToolbarModule, [{
      key: "toolbarConfig",
      get: function () {
        return {
          dataSource: this._prepareToolbarItems(),
          disabled: this.isInteractionDisabled,
          menuContainer: this._$toolbarContainer,
          multiline: this.isMultilineMode()
        };
      }
    }, {
      key: "isInteractionDisabled",
      get: function () {
        return this.editorInstance.option('readOnly') || this.editorInstance.option('disabled');
      }
    }]);
    return ToolbarModule;
  }(_base.default);
}
var _default = exports.default = ToolbarModule;
module.exports = exports.default;
module.exports.default = exports.default;