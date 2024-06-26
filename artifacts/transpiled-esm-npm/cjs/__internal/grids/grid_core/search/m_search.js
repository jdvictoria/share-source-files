"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.searchModule = void 0;
var _dom_adapter = _interopRequireDefault(require("../../../../core/dom_adapter"));
var _renderer = _interopRequireDefault(require("../../../../core/renderer"));
var _data = require("../../../../core/utils/data");
var _query = _interopRequireDefault(require("../../../../data/query"));
var _message = _interopRequireDefault(require("../../../../localization/message"));
var _m_utils = _interopRequireDefault(require("../m_utils"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); } /* eslint-disable max-classes-per-file */ /* eslint-disable @typescript-eslint/method-signature-style */ // @ts-expect-error
const SEARCH_PANEL_CLASS = 'search-panel';
const SEARCH_TEXT_CLASS = 'search-text';
const HEADER_PANEL_CLASS = 'header-panel';
const FILTERING_TIMEOUT = 700;
function allowSearch(column) {
  var _a;
  return !!((_a = column.allowSearch) !== null && _a !== void 0 ? _a : column.allowFiltering);
}
function parseValue(column, text) {
  const {
    lookup
  } = column;
  if (!column.parseValue) {
    return text;
  }
  if (lookup) {
    return column.parseValue.call(lookup, text);
  }
  return column.parseValue(text);
}
const dataController = base => /*#__PURE__*/function (_base) {
  _inheritsLoose(SearchDataControllerExtender, _base);
  function SearchDataControllerExtender() {
    return _base.apply(this, arguments) || this;
  }
  var _proto = SearchDataControllerExtender.prototype;
  _proto.optionChanged = function optionChanged(args) {
    switch (args.fullName) {
      case 'searchPanel.text':
      case 'searchPanel':
        this._applyFilter();
        args.handled = true;
        break;
      default:
        _base.prototype.optionChanged.call(this, args);
    }
  };
  _proto.publicMethods = function publicMethods() {
    return _base.prototype.publicMethods.call(this).concat(['searchByText']);
  };
  _proto._calculateAdditionalFilter = function _calculateAdditionalFilter() {
    const filter = _base.prototype._calculateAdditionalFilter.call(this);
    const searchFilter = this.calculateSearchFilter(this.option('searchPanel.text'));
    return _m_utils.default.combineFilters([filter, searchFilter]);
  };
  _proto.searchByText = function searchByText(text) {
    this.option('searchPanel.text', text);
  };
  _proto.calculateSearchFilter = function calculateSearchFilter(text) {
    let i;
    let column;
    const columns = this._columnsController.getColumns();
    const searchVisibleColumnsOnly = this.option('searchPanel.searchVisibleColumnsOnly');
    let lookup;
    const filters = [];
    if (!text) return null;
    function onQueryDone(items) {
      const valueGetter = (0, _data.compileGetter)(lookup.valueExpr);
      // eslint-disable-next-line @typescript-eslint/prefer-for-of
      for (let i = 0; i < items.length; i++) {
        // @ts-expect-error
        const value = valueGetter(items[i]);
        filters.push(column.createFilterExpression(value, null, 'search'));
      }
    }
    for (i = 0; i < columns.length; i++) {
      column = columns[i];
      if (searchVisibleColumnsOnly && !column.visible) continue;
      if (allowSearch(column) && column.calculateFilterExpression) {
        lookup = column.lookup;
        const filterValue = parseValue(column, text);
        if (lookup && lookup.items) {
          // @ts-expect-error
          (0, _query.default)(lookup.items).filter(column.createFilterExpression.call({
            dataField: lookup.displayExpr,
            dataType: lookup.dataType,
            calculateFilterExpression: column.calculateFilterExpression
          }, filterValue, null, 'search')).enumerate().done(onQueryDone);
        } else if (filterValue !== undefined) {
          filters.push(column.createFilterExpression(filterValue, null, 'search'));
        }
      }
    }
    if (filters.length === 0) {
      return ['!'];
    }
    return _m_utils.default.combineFilters(filters, 'or');
  };
  return SearchDataControllerExtender;
}(base);
const headerPanel = Base => /*#__PURE__*/function (_Base) {
  _inheritsLoose(SearchHeaderPanelExtender, _Base);
  function SearchHeaderPanelExtender() {
    return _Base.apply(this, arguments) || this;
  }
  var _proto2 = SearchHeaderPanelExtender.prototype;
  _proto2.optionChanged = function optionChanged(args) {
    if (args.name === 'searchPanel') {
      if (args.fullName === 'searchPanel.text') {
        const editor = this.getSearchTextEditor();
        if (editor) {
          editor.option('value', args.value);
        }
      } else {
        this._invalidate();
      }
      args.handled = true;
    } else {
      _Base.prototype.optionChanged.call(this, args);
    }
  };
  _proto2._getToolbarItems = function _getToolbarItems() {
    const items = _Base.prototype._getToolbarItems.call(this);
    return this._prepareSearchItem(items);
  };
  _proto2._prepareSearchItem = function _prepareSearchItem(items) {
    const that = this;
    const dataController = this._dataController;
    const searchPanelOptions = this.option('searchPanel');
    if (searchPanelOptions && searchPanelOptions.visible) {
      const toolbarItem = {
        template(data, index, container) {
          const $search = (0, _renderer.default)('<div>').addClass(that.addWidgetPrefix(SEARCH_PANEL_CLASS)).appendTo(container);
          that._editorFactoryController.createEditor($search, {
            width: searchPanelOptions.width,
            placeholder: searchPanelOptions.placeholder,
            parentType: 'searchPanel',
            value: that.option('searchPanel.text'),
            updateValueTimeout: FILTERING_TIMEOUT,
            setValue(value) {
              // @ts-expect-error
              dataController.searchByText(value);
            },
            editorOptions: {
              inputAttr: {
                'aria-label': _message.default.format("".concat(that.component.NAME, "-ariaSearchInGrid"))
              }
            }
          });
          that.resize();
        },
        name: 'searchPanel',
        location: 'after',
        locateInMenu: 'never',
        sortIndex: 40
      };
      items.push(toolbarItem);
    }
    return items;
  };
  _proto2.getSearchTextEditor = function getSearchTextEditor() {
    const that = this;
    const $element = that.element();
    const $searchPanel = $element.find(".".concat(that.addWidgetPrefix(SEARCH_PANEL_CLASS))).filter(function () {
      return (0, _renderer.default)(this).closest(".".concat(that.addWidgetPrefix(HEADER_PANEL_CLASS))).is($element);
    });
    if ($searchPanel.length) {
      return $searchPanel.dxTextBox('instance');
    }
    return null;
  };
  _proto2.isVisible = function isVisible() {
    const searchPanelOptions = this.option('searchPanel');
    return _Base.prototype.isVisible.call(this) || !!(searchPanelOptions === null || searchPanelOptions === void 0 ? void 0 : searchPanelOptions.visible);
  };
  return SearchHeaderPanelExtender;
}(Base);
const rowsView = Base => /*#__PURE__*/function (_Base2) {
  _inheritsLoose(SearchRowsViewExtender, _Base2);
  function SearchRowsViewExtender() {
    return _Base2.apply(this, arguments) || this;
  }
  var _proto3 = SearchRowsViewExtender.prototype;
  _proto3.init = function init() {
    _Base2.prototype.init.apply(this, arguments);
    this._searchParams = [];
    this._dataController = this.getController('data');
  };
  _proto3.dispose = function dispose() {
    clearTimeout(this._highlightTimer);
    _Base2.prototype.dispose.call(this);
  };
  _proto3._getFormattedSearchText = function _getFormattedSearchText(column, searchText) {
    const value = parseValue(column, searchText);
    const formatOptions = _m_utils.default.getFormatOptionsByColumn(column, 'search');
    return _m_utils.default.formatValue(value, formatOptions);
  };
  _proto3._getStringNormalizer = function _getStringNormalizer() {
    var _a, _b, _c, _d;
    const isCaseSensitive = this.option('searchPanel.highlightCaseSensitive');
    const dataSource = (_b = (_a = this._dataController) === null || _a === void 0 ? void 0 : _a.getDataSource) === null || _b === void 0 ? void 0 : _b.call(_a);
    const langParams = (_d = (_c = dataSource === null || dataSource === void 0 ? void 0 : dataSource.loadOptions) === null || _c === void 0 ? void 0 : _c.call(dataSource)) === null || _d === void 0 ? void 0 : _d.langParams;
    return str => (0, _data.toComparable)(str, isCaseSensitive, langParams);
  };
  _proto3._findHighlightingTextNodes = function _findHighlightingTextNodes(column, cellElement, searchText) {
    const that = this;
    let $parent = cellElement.parent();
    let $items;
    const stringNormalizer = this._getStringNormalizer();
    const normalizedSearchText = stringNormalizer(searchText);
    const resultTextNodes = [];
    if (!$parent.length) {
      $parent = (0, _renderer.default)('<div>').append(cellElement);
    } else if (column) {
      if (column.groupIndex >= 0 && !column.showWhenGrouped) {
        $items = cellElement;
      } else {
        const columnIndex = that._columnsController.getVisibleIndex(column.index);
        $items = $parent.children('td').eq(columnIndex).find('*');
      }
    }
    $items = ($items === null || $items === void 0 ? void 0 : $items.length) ? $items : $parent.find('*');
    $items.each((_, element) => {
      var _a, _b;
      const $contents = (0, _renderer.default)(element).contents();
      for (let i = 0; i < $contents.length; i++) {
        const node = $contents.get(i);
        if (node.nodeType === 3) {
          // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          const normalizedText = stringNormalizer((_b = (_a = node.textContent) !== null && _a !== void 0 ? _a : node.nodeValue) !== null && _b !== void 0 ? _b : '');
          if (normalizedText.includes(normalizedSearchText)) {
            resultTextNodes.push(node);
          }
        }
      }
    });
    return resultTextNodes;
  };
  _proto3._highlightSearchTextCore = function _highlightSearchTextCore($textNode, searchText) {
    const that = this;
    const $searchTextSpan = (0, _renderer.default)('<span>').addClass(that.addWidgetPrefix(SEARCH_TEXT_CLASS));
    const text = $textNode.text();
    const firstContentElement = $textNode[0];
    const stringNormalizer = this._getStringNormalizer();
    const index = stringNormalizer(text).indexOf(stringNormalizer(searchText));
    if (index >= 0) {
      if (firstContentElement.textContent) {
        firstContentElement.textContent = text.substr(0, index);
      } else {
        firstContentElement.nodeValue = text.substr(0, index);
      }
      $textNode.after($searchTextSpan.text(text.substr(index, searchText.length)));
      // @ts-expect-error
      $textNode = (0, _renderer.default)(_dom_adapter.default.createTextNode(text.substr(index + searchText.length))).insertAfter($searchTextSpan);
      return that._highlightSearchTextCore($textNode, searchText);
    }
  };
  _proto3._highlightSearchText = function _highlightSearchText(cellElement, isEquals, column) {
    const that = this;
    const stringNormalizer = this._getStringNormalizer();
    let searchText = that.option('searchPanel.text');
    if (isEquals && column) {
      searchText = searchText && that._getFormattedSearchText(column, searchText);
    }
    if (searchText && that.option('searchPanel.highlightSearchText')) {
      const textNodes = that._findHighlightingTextNodes(column, cellElement, searchText);
      textNodes.forEach(textNode => {
        if (isEquals) {
          if (stringNormalizer((0, _renderer.default)(textNode).text()) === stringNormalizer(searchText !== null && searchText !== void 0 ? searchText : '')) {
            (0, _renderer.default)(textNode).replaceWith((0, _renderer.default)('<span>').addClass(that.addWidgetPrefix(SEARCH_TEXT_CLASS)).text((0, _renderer.default)(textNode).text()));
          }
        } else {
          that._highlightSearchTextCore((0, _renderer.default)(textNode), searchText);
        }
      });
    }
  };
  _proto3._renderCore = function _renderCore() {
    const deferred = _Base2.prototype._renderCore.apply(this, arguments);
    // T103538
    if (this.option().rowTemplate || this.option('dataRowTemplate')) {
      if (this.option('templatesRenderAsynchronously')) {
        clearTimeout(this._highlightTimer);
        this._highlightTimer = setTimeout(() => {
          this._highlightSearchText(this.getTableElement());
        });
      } else {
        this._highlightSearchText(this.getTableElement());
      }
    }
    return deferred;
  };
  _proto3._updateCell = function _updateCell($cell, parameters) {
    const {
      column
    } = parameters;
    const dataType = column.lookup && column.lookup.dataType || column.dataType;
    const isEquals = dataType !== 'string';
    if (allowSearch(column) && !parameters.isOnForm) {
      if (this.option('templatesRenderAsynchronously')) {
        if (!this._searchParams.length) {
          clearTimeout(this._highlightTimer);
          this._highlightTimer = setTimeout(() => {
            this._searchParams.forEach(params => {
              this._highlightSearchText.apply(this, params);
            });
            this._searchParams = [];
          });
        }
        this._searchParams.push([$cell, isEquals, column]);
      } else {
        this._highlightSearchText($cell, isEquals, column);
      }
    }
    _Base2.prototype._updateCell.call(this, $cell, parameters);
  };
  return SearchRowsViewExtender;
}(Base);
const searchModule = exports.searchModule = {
  defaultOptions() {
    return {
      searchPanel: {
        visible: false,
        width: 160,
        placeholder: _message.default.format('dxDataGrid-searchPanelPlaceholder'),
        highlightSearchText: true,
        highlightCaseSensitive: false,
        text: '',
        searchVisibleColumnsOnly: false
      }
    };
  },
  extenders: {
    controllers: {
      data: dataController
    },
    views: {
      headerPanel,
      rowsView
    }
  }
};