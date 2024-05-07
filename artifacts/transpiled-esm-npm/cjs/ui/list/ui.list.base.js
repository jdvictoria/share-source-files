"use strict";

exports.ListBase = void 0;
exports.setScrollView = setScrollView;
var _size = require("../../core/utils/size");
var _renderer = _interopRequireDefault(require("../../core/renderer"));
var _events_engine = _interopRequireDefault(require("../../events/core/events_engine"));
var _common = require("../../core/utils/common");
var _type = require("../../core/utils/type");
var _icon = require("../../core/utils/icon");
var _element = require("../../core/element");
var _iterator = require("../../core/utils/iterator");
var _data = require("../../core/utils/data");
var _extend = require("../../core/utils/extend");
var _fx = _interopRequireDefault(require("../../animation/fx"));
var _click = require("../../events/click");
var _swipe = require("../../events/swipe");
var _support = require("../../core/utils/support");
var _message = _interopRequireDefault(require("../../localization/message"));
var _utils = require("../widget/utils.ink_ripple");
var _devices = _interopRequireDefault(require("../../core/devices"));
var _item = _interopRequireDefault(require("./item"));
var _button = _interopRequireDefault(require("../button"));
var _index = require("../../events/utils/index");
var _themes = require("../themes");
var _window = require("../../core/utils/window");
var _scroll_view = _interopRequireDefault(require("../scroll_view"));
var _uiScrollable = require("../scroll_view/ui.scrollable.device");
var _uiCollection_widget = _interopRequireDefault(require("../collection/ui.collection_widget.live_update"));
var _bindable_template = require("../../core/templates/bindable_template");
var _deferred = require("../../core/utils/deferred");
var _grouped_data_converter_mixin = _interopRequireDefault(require("../shared/grouped_data_converter_mixin"));
var _get_element_style = require("../../renovation/ui/scroll_view/utils/get_element_style");
var _guid = _interopRequireDefault(require("../../core/guid"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const LIST_CLASS = 'dx-list';
const LIST_ITEMS_CLASS = 'dx-list-items';
const LIST_ITEM_CLASS = 'dx-list-item';
const LIST_ITEM_SELECTOR = '.' + LIST_ITEM_CLASS;
const LIST_ITEM_ICON_CONTAINER_CLASS = 'dx-list-item-icon-container';
const LIST_ITEM_ICON_CLASS = 'dx-list-item-icon';
const LIST_GROUP_CLASS = 'dx-list-group';
const LIST_GROUP_HEADER_CLASS = 'dx-list-group-header';
const LIST_GROUP_BODY_CLASS = 'dx-list-group-body';
const LIST_COLLAPSIBLE_GROUPS_CLASS = 'dx-list-collapsible-groups';
const LIST_GROUP_COLLAPSED_CLASS = 'dx-list-group-collapsed';
const LIST_GROUP_HEADER_INDICATOR_CLASS = 'dx-list-group-header-indicator';
const LIST_HAS_NEXT_CLASS = 'dx-has-next';
const LIST_NEXT_BUTTON_CLASS = 'dx-list-next-button';
const WRAP_ITEM_TEXT_CLASS = 'dx-wrap-item-text';
const SELECT_ALL_ITEM_SELECTOR = '.dx-list-select-all';
const LIST_ITEM_DATA_KEY = 'dxListItemData';
const LIST_FEEDBACK_SHOW_TIMEOUT = 70;
const groupItemsGetter = (0, _data.compileGetter)('items');
let _scrollView;
const ListBase = exports.ListBase = _uiCollection_widget.default.inherit({
  _activeStateUnit: [LIST_ITEM_SELECTOR, SELECT_ALL_ITEM_SELECTOR].join(','),
  _supportedKeys: function () {
    const that = this;
    const moveFocusPerPage = function (direction) {
      let $item = getEdgeVisibleItem(direction);
      const isFocusedItem = $item.is(that.option('focusedElement'));
      if (isFocusedItem) {
        scrollListTo($item, direction);
        $item = getEdgeVisibleItem(direction);
      }
      that.option('focusedElement', (0, _element.getPublicElement)($item));
      that.scrollToItem($item);
    };
    function getEdgeVisibleItem(direction) {
      const scrollTop = that.scrollTop();
      const containerHeight = (0, _size.getHeight)(that.$element());
      let $item = (0, _renderer.default)(that.option('focusedElement'));
      let isItemVisible = true;
      if (!$item.length) {
        return (0, _renderer.default)();
      }
      while (isItemVisible) {
        const $nextItem = $item[direction]();
        if (!$nextItem.length) {
          break;
        }
        const nextItemLocation = $nextItem.position().top + (0, _size.getOuterHeight)($nextItem) / 2;
        isItemVisible = nextItemLocation < containerHeight + scrollTop && nextItemLocation > scrollTop;
        if (isItemVisible) {
          $item = $nextItem;
        }
      }
      return $item;
    }
    function scrollListTo($item, direction) {
      let resultPosition = $item.position().top;
      if (direction === 'prev') {
        resultPosition = $item.position().top - (0, _size.getHeight)(that.$element()) + (0, _size.getOuterHeight)($item);
      }
      that.scrollTo(resultPosition);
    }
    return (0, _extend.extend)(this.callBase(), {
      leftArrow: _common.noop,
      rightArrow: _common.noop,
      pageUp: function () {
        moveFocusPerPage('prev');
        return false;
      },
      pageDown: function () {
        moveFocusPerPage('next');
        return false;
      }
    });
  },
  _getDefaultOptions: function () {
    return (0, _extend.extend)(this.callBase(), {
      hoverStateEnabled: true,
      pullRefreshEnabled: false,
      scrollingEnabled: true,
      selectByClick: true,
      showScrollbar: 'onScroll',
      useNativeScrolling: true,
      bounceEnabled: true,
      scrollByContent: true,
      scrollByThumb: false,
      pullingDownText: _message.default.format('dxList-pullingDownText'),
      pulledDownText: _message.default.format('dxList-pulledDownText'),
      refreshingText: _message.default.format('dxList-refreshingText'),
      pageLoadingText: _message.default.format('dxList-pageLoadingText'),
      onScroll: null,
      onPullRefresh: null,
      onPageLoading: null,
      pageLoadMode: 'scrollBottom',
      nextButtonText: _message.default.format('dxList-nextButtonText'),
      onItemSwipe: null,
      grouped: false,
      onGroupRendered: null,
      collapsibleGroups: false,
      groupTemplate: 'group',
      indicateLoading: true,
      /**
      * @name dxListOptions.selectedIndex
      * @type number
      * @default -1
      * @hidden
      */

      /**
      * @name dxListOptions.selectedItem
      * @hidden
      */

      activeStateEnabled: true,
      _itemAttributes: {
        'role': 'option'
      },
      useInkRipple: false,
      wrapItemText: false,
      _swipeEnabled: true,
      showChevronExpr: function (data) {
        return data ? data.showChevron : undefined;
      },
      badgeExpr: function (data) {
        return data ? data.badge : undefined;
      }
    });
  },
  _defaultOptionsRules: function () {
    const themeName = (0, _themes.current)();
    return this.callBase().concat((0, _uiScrollable.deviceDependentOptions)(), [{
      device: function () {
        return !_support.nativeScrolling;
      },
      options: {
        useNativeScrolling: false
      }
    }, {
      device: function (device) {
        return !_support.nativeScrolling && !_devices.default.isSimulator() && _devices.default.real().deviceType === 'desktop' && device.platform === 'generic';
      },
      options: {
        showScrollbar: 'onHover',
        pageLoadMode: 'nextButton'
      }
    }, {
      device: function () {
        return _devices.default.real().deviceType === 'desktop' && !_devices.default.isSimulator();
      },
      options: {
        focusStateEnabled: true
      }
    }, {
      device: function () {
        return (0, _themes.isMaterial)(themeName);
      },
      options: {
        useInkRipple: true
      }
    }, {
      device: function () {
        return (0, _themes.isMaterialBased)(themeName);
      },
      options: {
        pullingDownText: '',
        pulledDownText: '',
        refreshingText: '',
        pageLoadingText: ''
      }
    }]);
  },
  _visibilityChanged: function (visible) {
    if (visible) {
      this._updateLoadingState(true);
    }
  },
  _itemClass: function () {
    return LIST_ITEM_CLASS;
  },
  _itemDataKey: function () {
    return LIST_ITEM_DATA_KEY;
  },
  _itemContainer: function () {
    return this._$container;
  },
  _getItemsContainer: function () {
    return this._$listContainer;
  },
  _cleanItemContainer: function () {
    this.callBase();
    const listContainer = this._getItemsContainer();
    (0, _renderer.default)(listContainer).empty();
    listContainer.appendTo(this._$container);
  },
  _saveSelectionChangeEvent: function (e) {
    this._selectionChangeEventInstance = e;
  },
  _getSelectionChangeEvent: function () {
    return this._selectionChangeEventInstance;
  },
  _refreshItemElements: function () {
    if (!this.option('grouped')) {
      this._itemElementsCache = this._getItemsContainer().children(this._itemSelector());
    } else {
      this._itemElementsCache = this._getItemsContainer().children('.' + LIST_GROUP_CLASS).children('.' + LIST_GROUP_BODY_CLASS).children(this._itemSelector());
    }
  },
  _modifyByChanges: function () {
    this.callBase.apply(this, arguments);
    this._refreshItemElements();
    this._updateLoadingState(true);
  },
  reorderItem: function (itemElement, toItemElement) {
    const promise = this.callBase(itemElement, toItemElement);
    return promise.done(function () {
      this._refreshItemElements();
    });
  },
  deleteItem: function (itemElement) {
    const promise = this.callBase(itemElement);
    return promise.done(function () {
      this._refreshItemElements();
    });
  },
  _itemElements: function () {
    return this._itemElementsCache;
  },
  _itemSelectHandler: function (e) {
    if (this.option('selectionMode') === 'single' && this.isItemSelected(e.currentTarget)) {
      return;
    }
    return this.callBase(e);
  },
  _allowDynamicItemsAppend: function () {
    return true;
  },
  _init: function () {
    this.callBase();
    this._dataController.resetDataSourcePageIndex();
    this._$container = this.$element();
    this._$listContainer = (0, _renderer.default)('<div>').addClass(LIST_ITEMS_CLASS);
    this._initScrollView();
    this._feedbackShowTimeout = LIST_FEEDBACK_SHOW_TIMEOUT;
    this._createGroupRenderAction();
  },
  _scrollBottomMode: function () {
    return this.option('pageLoadMode') === 'scrollBottom';
  },
  _nextButtonMode: function () {
    return this.option('pageLoadMode') === 'nextButton';
  },
  _dataSourceOptions: function () {
    const scrollBottom = this._scrollBottomMode();
    const nextButton = this._nextButtonMode();
    return (0, _extend.extend)(this.callBase(), {
      paginate: (0, _common.ensureDefined)(scrollBottom || nextButton, true)
    });
  },
  _getGroupedOption: function () {
    return this.option('grouped');
  },
  _getGroupContainerByIndex: function (groupIndex) {
    return this._getItemsContainer().find(".".concat(LIST_GROUP_CLASS)).eq(groupIndex).find(".".concat(LIST_GROUP_BODY_CLASS));
  },
  _dataSourceFromUrlLoadMode: function () {
    return 'raw';
  },
  _initScrollView: function () {
    const scrollingEnabled = this.option('scrollingEnabled');
    const pullRefreshEnabled = scrollingEnabled && this.option('pullRefreshEnabled');
    const autoPagingEnabled = scrollingEnabled && this._scrollBottomMode() && !!this._dataController.getDataSource();
    this._scrollView = this._createComponent(this.$element(), getScrollView(), {
      height: this.option('height'),
      width: this.option('width'),
      disabled: this.option('disabled') || !scrollingEnabled,
      onScroll: this._scrollHandler.bind(this),
      onPullDown: pullRefreshEnabled ? this._pullDownHandler.bind(this) : null,
      onReachBottom: autoPagingEnabled ? this._scrollBottomHandler.bind(this) : null,
      showScrollbar: this.option('showScrollbar'),
      useNative: this.option('useNativeScrolling'),
      bounceEnabled: this.option('bounceEnabled'),
      scrollByContent: this.option('scrollByContent'),
      scrollByThumb: this.option('scrollByThumb'),
      pullingDownText: this.option('pullingDownText'),
      pulledDownText: this.option('pulledDownText'),
      refreshingText: this.option('refreshingText'),
      reachBottomText: this.option('pageLoadingText'),
      useKeyboard: false
    });
    this._$container = (0, _renderer.default)(this._scrollView.content());
    this._$listContainer.appendTo(this._$container);
    this._toggleWrapItemText(this.option('wrapItemText'));
    this._createScrollViewActions();
  },
  _toggleWrapItemText: function (value) {
    this._$listContainer.toggleClass(WRAP_ITEM_TEXT_CLASS, value);
  },
  _createScrollViewActions: function () {
    this._scrollAction = this._createActionByOption('onScroll');
    this._pullRefreshAction = this._createActionByOption('onPullRefresh');
    this._pageLoadingAction = this._createActionByOption('onPageLoading');
  },
  _scrollHandler: function (e) {
    this._scrollAction && this._scrollAction(e);
  },
  _initTemplates: function () {
    this._templateManager.addDefaultTemplates({
      group: new _bindable_template.BindableTemplate(function ($container, data) {
        if ((0, _type.isPlainObject)(data)) {
          if (data.key) {
            $container.text(data.key);
          }
        } else {
          $container.text(String(data));
        }
      }, ['key'], this.option('integrationOptions.watchMethod'))
    });
    this.callBase();
  },
  _prepareDefaultItemTemplate: function (data, $container) {
    this.callBase(data, $container);
    if (data.icon) {
      const $icon = (0, _icon.getImageContainer)(data.icon).addClass(LIST_ITEM_ICON_CLASS);
      const $iconContainer = (0, _renderer.default)('<div>').addClass(LIST_ITEM_ICON_CONTAINER_CLASS);
      $iconContainer.append($icon);
      $container.prepend($iconContainer);
    }
  },
  _getBindableFields: function () {
    return ['text', 'html', 'icon'];
  },
  _updateLoadingState: function (tryLoadMore) {
    const dataController = this._dataController;
    const shouldLoadNextPage = this._scrollBottomMode() && tryLoadMore && !dataController.isLoading() && !this._isLastPage();
    if (this._shouldContinueLoading(shouldLoadNextPage)) {
      this._infiniteDataLoading();
    } else {
      this._scrollView.release(!shouldLoadNextPage && !dataController.isLoading());
      this._toggleNextButton(this._shouldRenderNextButton() && !this._isLastPage());
      this._loadIndicationSuppressed(false);
    }
  },
  _shouldRenderNextButton: function () {
    return this._nextButtonMode() && this._dataController.isLoaded();
  },
  _isDataSourceFirstLoadCompleted: function (newValue) {
    if ((0, _type.isDefined)(newValue)) {
      this._isFirstLoadCompleted = newValue;
    }
    return this._isFirstLoadCompleted;
  },
  _dataSourceLoadingChangedHandler: function (isLoading) {
    if (this._loadIndicationSuppressed()) {
      return;
    }
    if (isLoading && this.option('indicateLoading')) {
      this._showLoadingIndicatorTimer = setTimeout(function () {
        const isEmpty = !this._itemElements().length;
        const shouldIndicateLoading = !isEmpty || this._isDataSourceFirstLoadCompleted();
        if (shouldIndicateLoading) {
          var _this$_scrollView;
          (_this$_scrollView = this._scrollView) === null || _this$_scrollView === void 0 ? void 0 : _this$_scrollView.startLoading();
        }
      }.bind(this));
    } else {
      clearTimeout(this._showLoadingIndicatorTimer);
      this._scrollView && this._scrollView.finishLoading();
    }
    if (!isLoading) {
      this._isDataSourceFirstLoadCompleted(false);
    }
  },
  _dataSourceChangedHandler: function () {
    if (!this._shouldAppendItems() && (0, _window.hasWindow)()) {
      this._scrollView && this._scrollView.scrollTo(0);
    }
    this.callBase.apply(this, arguments);
    this._isDataSourceFirstLoadCompleted(true);
  },
  _refreshContent: function () {
    this._prepareContent();
    this._fireContentReadyAction();
  },
  _hideLoadingIfLoadIndicationOff: function () {
    if (!this.option('indicateLoading')) {
      this._dataSourceLoadingChangedHandler(false);
    }
  },
  _loadIndicationSuppressed: function (value) {
    if (!arguments.length) {
      return this._isLoadIndicationSuppressed;
    }
    this._isLoadIndicationSuppressed = value;
  },
  _scrollViewIsFull: function () {
    const scrollView = this._scrollView;
    return !scrollView || (0, _size.getHeight)(scrollView.content()) > (0, _size.getHeight)(scrollView.container());
  },
  _pullDownHandler: function (e) {
    this._pullRefreshAction(e);
    const dataController = this._dataController;
    if (dataController.getDataSource() && !dataController.isLoading()) {
      this._clearSelectedItems();
      dataController.pageIndex(0);
      dataController.reload();
    } else {
      this._updateLoadingState();
    }
  },
  _shouldContinueLoading: function (shouldLoadNextPage) {
    var _this$_scrollView$scr, _this$_scrollView$scr2;
    const isBottomReached = (0, _size.getHeight)(this._scrollView.content()) - (0, _size.getHeight)(this._scrollView.container()) < ((_this$_scrollView$scr = (_this$_scrollView$scr2 = this._scrollView.scrollOffset()) === null || _this$_scrollView$scr2 === void 0 ? void 0 : _this$_scrollView$scr2.top) !== null && _this$_scrollView$scr !== void 0 ? _this$_scrollView$scr : 0);
    return shouldLoadNextPage && (!this._scrollViewIsFull() || isBottomReached);
  },
  _infiniteDataLoading: function () {
    const isElementVisible = this.$element().is(':visible');
    if (isElementVisible) {
      clearTimeout(this._loadNextPageTimer);
      this._loadNextPageTimer = setTimeout(() => {
        this._loadNextPage();
      });
    }
  },
  _scrollBottomHandler: function (e) {
    this._pageLoadingAction(e);
    const dataController = this._dataController;
    if (!dataController.isLoading() && !this._isLastPage()) {
      this._loadNextPage();
    } else {
      this._updateLoadingState();
    }
  },
  _renderItems: function (items) {
    if (this.option('grouped')) {
      (0, _iterator.each)(items, this._renderGroup.bind(this));
      this._attachGroupCollapseEvent();
      this._renderEmptyMessage();
      if ((0, _themes.isMaterial)()) {
        this.attachGroupHeaderInkRippleEvents();
      }
    } else {
      this.callBase.apply(this, arguments);
    }
    this._refreshItemElements();
    this._updateLoadingState(true);
  },
  _attachGroupCollapseEvent: function () {
    const eventName = (0, _index.addNamespace)(_click.name, this.NAME);
    const selector = '.' + LIST_GROUP_HEADER_CLASS;
    const $element = this.$element();
    const collapsibleGroups = this.option('collapsibleGroups');
    $element.toggleClass(LIST_COLLAPSIBLE_GROUPS_CLASS, collapsibleGroups);
    _events_engine.default.off($element, eventName, selector);
    if (collapsibleGroups) {
      _events_engine.default.on($element, eventName, selector, function (e) {
        this._createAction(function (e) {
          const $group = (0, _renderer.default)(e.event.currentTarget).parent();
          this._collapseGroupHandler($group);
          if (this.option('focusStateEnabled')) {
            this.option('focusedElement', (0, _element.getPublicElement)($group.find('.' + LIST_ITEM_CLASS).eq(0)));
          }
        }.bind(this), {
          validatingTargetName: 'element'
        })({
          event: e
        });
      }.bind(this));
    }
  },
  _collapseGroupHandler: function ($group, toggle) {
    const deferred = new _deferred.Deferred();
    if ($group.hasClass(LIST_GROUP_COLLAPSED_CLASS) === toggle) {
      return deferred.resolve();
    }
    const $groupBody = $group.children('.' + LIST_GROUP_BODY_CLASS);
    const startHeight = (0, _size.getOuterHeight)($groupBody);
    let endHeight = 0;
    if (startHeight === 0) {
      (0, _size.setHeight)($groupBody, 'auto');
      endHeight = (0, _size.getOuterHeight)($groupBody);
    }
    $group.toggleClass(LIST_GROUP_COLLAPSED_CLASS, toggle);
    _fx.default.animate($groupBody, {
      type: 'custom',
      from: {
        height: startHeight
      },
      to: {
        height: endHeight
      },
      duration: 200,
      complete: function () {
        this.updateDimensions();
        this._updateLoadingState(true);
        deferred.resolve();
      }.bind(this)
    });
    return deferred.promise();
  },
  _dataSourceLoadErrorHandler: function () {
    this._forgetNextPageLoading();
    if (this._initialized) {
      this._renderEmptyMessage();
      this._updateLoadingState();
    }
  },
  _initMarkup: function () {
    this._itemElementsCache = (0, _renderer.default)();
    this.$element().addClass(LIST_CLASS);
    this.callBase();
    this.option('useInkRipple') && this._renderInkRipple();
    const elementAria = {
      'role': 'group',
      'roledescription': 'list'
    };
    this.setAria(elementAria, this.$element());
    this.setAria({
      role: 'application'
    }, this._focusTarget());
    this._setListAria();
  },
  _setListAria() {
    const {
      items,
      allowItemDeleting
    } = this.option();
    const label = allowItemDeleting ? _message.default.format('dxList-listAriaLabel-deletable') : _message.default.format('dxList-listAriaLabel');
    const listArea = items !== null && items !== void 0 && items.length ? {
      role: 'listbox',
      label
    } : {
      role: undefined,
      label: undefined
    };
    this.setAria(listArea, this._$listContainer);
  },
  _focusTarget: function () {
    return this._itemContainer();
  },
  _renderInkRipple: function () {
    this._inkRipple = (0, _utils.render)();
  },
  _toggleActiveState: function ($element, value, e) {
    this.callBase.apply(this, arguments);
    const that = this;
    if (!this._inkRipple) {
      return;
    }
    const config = {
      element: $element,
      event: e
    };
    if (value) {
      if ((0, _themes.isMaterial)()) {
        this._inkRippleTimer = setTimeout(function () {
          that._inkRipple.showWave(config);
        }, LIST_FEEDBACK_SHOW_TIMEOUT / 2);
      } else {
        that._inkRipple.showWave(config);
      }
    } else {
      clearTimeout(this._inkRippleTimer);
      this._inkRipple.hideWave(config);
    }
  },
  _postprocessRenderItem: function (args) {
    this._refreshItemElements();
    this.callBase.apply(this, arguments);
    if (this.option('_swipeEnabled')) {
      this._attachSwipeEvent((0, _renderer.default)(args.itemElement));
    }
  },
  _attachSwipeEvent: function ($itemElement) {
    const endEventName = (0, _index.addNamespace)(_swipe.end, this.NAME);
    _events_engine.default.on($itemElement, endEventName, this._itemSwipeEndHandler.bind(this));
  },
  _itemSwipeEndHandler: function (e) {
    this._itemDXEventHandler(e, 'onItemSwipe', {
      direction: e.offset < 0 ? 'left' : 'right'
    });
  },
  _nextButtonHandler: function (e) {
    this._pageLoadingAction(e);
    const dataController = this._dataController;
    if (dataController.getDataSource() && !dataController.isLoading()) {
      this._scrollView.toggleLoading(true);
      this._$nextButton.detach();
      this._loadIndicationSuppressed(true);
      this._loadNextPage();
    }
  },
  _renderGroup: function (index, group) {
    const $groupElement = (0, _renderer.default)('<div>').addClass(LIST_GROUP_CLASS).appendTo(this._getItemsContainer());
    const id = "dx-".concat(new _guid.default().toString());
    const groupAria = {
      role: 'group',
      'labelledby': id
    };
    this.setAria(groupAria, $groupElement);
    const $groupHeaderElement = (0, _renderer.default)('<div>').addClass(LIST_GROUP_HEADER_CLASS).attr('id', id).appendTo($groupElement);
    const groupTemplateName = this.option('groupTemplate');
    const groupTemplate = this._getTemplate(group.template || groupTemplateName, group, index, $groupHeaderElement);
    const renderArgs = {
      index: index,
      itemData: group,
      container: (0, _element.getPublicElement)($groupHeaderElement)
    };
    this._createItemByTemplate(groupTemplate, renderArgs);
    (0, _renderer.default)('<div>').addClass(LIST_GROUP_HEADER_INDICATOR_CLASS).prependTo($groupHeaderElement);
    this._renderingGroupIndex = index;
    const $groupBody = (0, _renderer.default)('<div>').addClass(LIST_GROUP_BODY_CLASS).appendTo($groupElement);
    (0, _iterator.each)(groupItemsGetter(group) || [], function (itemIndex, item) {
      this._renderItem({
        group: index,
        item: itemIndex
      }, item, $groupBody);
    }.bind(this));
    this._groupRenderAction({
      groupElement: (0, _element.getPublicElement)($groupElement),
      groupIndex: index,
      groupData: group
    });
  },
  downInkRippleHandler: function (e) {
    this._toggleActiveState((0, _renderer.default)(e.currentTarget), true, e);
  },
  upInkRippleHandler: function (e) {
    this._toggleActiveState((0, _renderer.default)(e.currentTarget), false);
  },
  attachGroupHeaderInkRippleEvents: function () {
    const selector = '.' + LIST_GROUP_HEADER_CLASS;
    const $element = this.$element();
    this._downInkRippleHandler = this._downInkRippleHandler || this.downInkRippleHandler.bind(this);
    this._upInkRippleHandler = this._upInkRippleHandler || this.upInkRippleHandler.bind(this);
    const downArguments = [$element, 'dxpointerdown', selector, this._downInkRippleHandler];
    const upArguments = [$element, 'dxpointerup dxpointerout', selector, this._upInkRippleHandler];
    _events_engine.default.off(...downArguments);
    _events_engine.default.on(...downArguments);
    _events_engine.default.off(...upArguments);
    _events_engine.default.on(...upArguments);
  },
  _createGroupRenderAction: function () {
    this._groupRenderAction = this._createActionByOption('onGroupRendered');
  },
  _clean: function () {
    clearTimeout(this._inkRippleTimer);
    if (this._$nextButton) {
      this._$nextButton.remove();
      this._$nextButton = null;
    }
    this.callBase.apply(this, arguments);
  },
  _dispose: function () {
    this._isDataSourceFirstLoadCompleted(false);
    clearTimeout(this._holdTimer);
    clearTimeout(this._loadNextPageTimer);
    clearTimeout(this._showLoadingIndicatorTimer);
    this.callBase();
  },
  _toggleDisabledState: function (value) {
    this.callBase(value);
    this._scrollView.option('disabled', value || !this.option('scrollingEnabled'));
  },
  _toggleNextButton: function (value) {
    const dataController = this._dataController;
    const $nextButton = this._getNextButton();
    this.$element().toggleClass(LIST_HAS_NEXT_CLASS, value);
    if (value && dataController.isLoaded()) {
      $nextButton.appendTo(this._itemContainer());
    }
    if (!value) {
      $nextButton.detach();
    }
  },
  _getNextButton: function () {
    if (!this._$nextButton) {
      this._$nextButton = this._createNextButton();
    }
    return this._$nextButton;
  },
  _createNextButton: function () {
    const $result = (0, _renderer.default)('<div>').addClass(LIST_NEXT_BUTTON_CLASS);
    const $button = (0, _renderer.default)('<div>').appendTo($result);
    this._createComponent($button, _button.default, {
      text: this.option('nextButtonText'),
      onClick: this._nextButtonHandler.bind(this),
      type: (0, _themes.isMaterialBased)() ? 'default' : undefined,
      integrationOptions: {}
    });
    return $result;
  },
  _moveFocus: function () {
    this.callBase.apply(this, arguments);
    this.scrollToItem(this.option('focusedElement'));
  },
  _refresh: function () {
    if (!(0, _window.hasWindow)()) {
      this.callBase();
    } else {
      const scrollTop = this._scrollView.scrollTop();
      this.callBase();
      scrollTop && this._scrollView.scrollTo(scrollTop);
    }
  },
  _optionChanged: function (args) {
    switch (args.name) {
      case 'pageLoadMode':
        this._toggleNextButton(args.value);
        this._initScrollView();
        break;
      case 'dataSource':
        this.callBase(args);
        this._initScrollView();
        this._isDataSourceFirstLoadCompleted(false);
        break;
      case 'items':
        this.callBase(args);
        this._isDataSourceFirstLoadCompleted(false);
        break;
      case 'pullingDownText':
      case 'pulledDownText':
      case 'refreshingText':
      case 'pageLoadingText':
      case 'showScrollbar':
      case 'bounceEnabled':
      case 'scrollByContent':
      case 'scrollByThumb':
      case 'useNativeScrolling':
      case 'scrollingEnabled':
      case 'pullRefreshEnabled':
        this._initScrollView();
        this._updateLoadingState(true);
        break;
      case 'nextButtonText':
      case 'onItemSwipe':
      case 'useInkRipple':
        this._invalidate();
        break;
      case 'onScroll':
      case 'onPullRefresh':
      case 'onPageLoading':
        this._createScrollViewActions();
        break;
      case 'grouped':
      case 'collapsibleGroups':
      case 'groupTemplate':
        this._invalidate();
        break;
      case 'wrapItemText':
        this._toggleWrapItemText(args.value);
        break;
      case 'onGroupRendered':
        this._createGroupRenderAction();
        break;
      case 'width':
      case 'height':
        this.callBase(args);
        this._scrollView.option(args.name, args.value);
        this._scrollView.update();
        break;
      case 'indicateLoading':
        this._hideLoadingIfLoadIndicationOff();
        break;
      case 'visible':
        this.callBase(args);
        this._scrollView.update();
        break;
      case 'rtlEnabled':
        this._initScrollView();
        this.callBase(args);
        break;
      case 'showChevronExpr':
      case 'badgeExpr':
        this._invalidate();
        break;
      case '_swipeEnabled':
        break;
      case 'selectByClick':
        break;
      default:
        this.callBase(args);
    }
  },
  _extendActionArgs: function ($itemElement) {
    if (!this.option('grouped')) {
      return this.callBase($itemElement);
    }
    const $group = $itemElement.closest('.' + LIST_GROUP_CLASS);
    const $item = $group.find('.' + LIST_ITEM_CLASS);
    return (0, _extend.extend)(this.callBase($itemElement), {
      itemIndex: {
        group: $group.index(),
        item: $item.index($itemElement)
      }
    });
  },
  expandGroup: function (groupIndex) {
    const deferred = new _deferred.Deferred();
    const $group = this._getItemsContainer().find(".".concat(LIST_GROUP_CLASS)).eq(groupIndex);
    this._collapseGroupHandler($group, false).done(function () {
      deferred.resolveWith(this);
    }.bind(this));
    return deferred.promise();
  },
  collapseGroup: function (groupIndex) {
    const deferred = new _deferred.Deferred();
    const $group = this._getItemsContainer().find(".".concat(LIST_GROUP_CLASS)).eq(groupIndex);
    this._collapseGroupHandler($group, true).done(function () {
      deferred.resolveWith(this);
    }.bind(this));
    return deferred;
  },
  updateDimensions: function () {
    const that = this;
    const deferred = new _deferred.Deferred();
    if (that._scrollView) {
      that._scrollView.update().done(function () {
        !that._scrollViewIsFull() && that._updateLoadingState(true);
        deferred.resolveWith(that);
      });
    } else {
      deferred.resolveWith(that);
    }
    return deferred.promise();
  },
  reload: function () {
    this.callBase();
    this.scrollTo(0);
    this._pullDownHandler();
  },
  repaint: function () {
    this.scrollTo(0);
    this.callBase();
  },
  scrollTop: function () {
    return this._scrollView.scrollOffset().top;
  },
  clientHeight: function () {
    return this._scrollView.clientHeight();
  },
  scrollHeight: function () {
    return this._scrollView.scrollHeight();
  },
  scrollBy: function (distance) {
    this._scrollView.scrollBy(distance);
  },
  scrollTo: function (location) {
    this._scrollView.scrollTo(location);
  },
  scrollToItem: function (itemElement) {
    const $item = this._editStrategy.getItemElement(itemElement);
    const item = $item === null || $item === void 0 ? void 0 : $item.get(0);
    this._scrollView.scrollToElement(item, {
      bottom: (0, _get_element_style.getElementMargin)(item, 'bottom')
    });
  },
  _dimensionChanged: function () {
    this.updateDimensions();
  }
}).include(_grouped_data_converter_mixin.default);
ListBase.ItemClass = _item.default;
function getScrollView() {
  return _scrollView || _scroll_view.default;
}
function setScrollView(value) {
  _scrollView = value;
}