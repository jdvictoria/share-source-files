/**
* DevExtreme (renovation/ui/scroll_view/strategy/native.js)
* Version: 24.1.1
* Build date: Tue May 07 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.viewFunction = exports.ScrollableNative = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
require("../../../../events/gesture/emitter.gesture.scroll");
var _subscribe_to_event = require("../../../utils/subscribe_to_event");
var _widget = require("../../common/widget");
var _combine_classes = require("../../../utils/combine_classes");
var _get_scroll_left_max = require("../utils/get_scroll_left_max");
var _get_boundary_props = require("../utils/get_boundary_props");
var _normalize_offset_left = require("../utils/normalize_offset_left");
var _get_element_style = require("../utils/get_element_style");
var _devices = _interopRequireDefault(require("../../../../core/devices"));
var _type = require("../../../../core/utils/type");
var _top = require("../internal/pocket/top");
var _bottom = require("../internal/pocket/bottom");
var _index = require("../../../../events/utils/index");
var _scroll_direction = require("../utils/scroll_direction");
var _consts = require("../common/consts");
var _scrollbar = require("../scrollbar/scrollbar");
var _is_element_visible = require("../utils/is_element_visible");
var _native_strategy_props = require("../common/native_strategy_props");
var _get_allowed_direction = require("../utils/get_allowed_direction");
var _get_scroll_top_max = require("../utils/get_scroll_top_max");
var _subscribe_to_resize = require("../utils/subscribe_to_resize");
const _excluded = ["addWidgetClass", "aria", "bounceEnabled", "children", "classes", "direction", "disabled", "forceGeneratePockets", "height", "loadPanelTemplate", "needRenderScrollbars", "needScrollViewContentWrapper", "onPullDown", "onReachBottom", "onScroll", "onUpdated", "pullDownEnabled", "pulledDownText", "pullingDownText", "reachBottomEnabled", "reachBottomText", "refreshStrategy", "refreshingText", "rtlEnabled", "scrollByContent", "showScrollbar", "useSimulatedScrollbar", "visible", "width"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const viewFunction = viewModel => {
  const {
    bottomPocketRef,
    containerClientHeight,
    containerClientWidth,
    containerRef,
    contentHeight,
    contentRef,
    contentStyles,
    contentTranslateTop,
    contentWidth,
    cssClasses,
    direction,
    hScrollLocation,
    hScrollOffsetMax,
    hScrollbarRef,
    isLoadPanelVisible,
    props: {
      aria,
      children,
      disabled,
      forceGeneratePockets,
      height,
      loadPanelTemplate: LoadPanelTemplate,
      needRenderScrollbars,
      needScrollViewContentWrapper,
      pullDownEnabled,
      pulledDownText,
      pullingDownText,
      reachBottomEnabled,
      reachBottomText,
      refreshStrategy,
      refreshingText,
      rtlEnabled,
      showScrollbar,
      useSimulatedScrollbar,
      visible,
      width
    },
    pullDownIconAngle,
    pullDownOpacity,
    pullDownTranslateTop,
    restAttributes,
    scrollViewContentRef,
    scrollableRef,
    scrolling,
    topPocketHeight,
    topPocketRef,
    topPocketState,
    vScrollLocation,
    vScrollOffsetMax,
    vScrollbarRef,
    wrapperRef
  } = viewModel;
  return (0, _inferno.normalizeProps)((0, _inferno.createComponentVNode)(2, _widget.Widget, _extends({
    "rootElementRef": scrollableRef,
    "aria": aria,
    "addWidgetClass": false,
    "classes": cssClasses,
    "disabled": disabled,
    "rtlEnabled": rtlEnabled,
    "height": height,
    "width": width,
    "visible": visible
  }, restAttributes, {
    children: [(0, _inferno.createVNode)(1, "div", _consts.SCROLLABLE_WRAPPER_CLASS, (0, _inferno.createVNode)(1, "div", _consts.SCROLLABLE_CONTAINER_CLASS, (0, _inferno.createVNode)(1, "div", _consts.SCROLLABLE_CONTENT_CLASS, [forceGeneratePockets && (0, _inferno.createComponentVNode)(2, _top.TopPocket, {
      "topPocketRef": topPocketRef,
      "pullingDownText": pullingDownText,
      "pulledDownText": pulledDownText,
      "refreshingText": refreshingText,
      "pocketState": topPocketState,
      "refreshStrategy": refreshStrategy,
      "pullDownTranslateTop": pullDownTranslateTop,
      "pullDownIconAngle": pullDownIconAngle,
      "topPocketTranslateTop": contentTranslateTop,
      "pullDownOpacity": pullDownOpacity,
      "pocketTop": topPocketHeight,
      "visible": !!pullDownEnabled
    }), needScrollViewContentWrapper ? (0, _inferno.createVNode)(1, "div", _consts.SCROLLVIEW_CONTENT_CLASS, children, 0, {
      "style": (0, _inferno2.normalizeStyles)(contentStyles)
    }, null, scrollViewContentRef) : children, forceGeneratePockets && (0, _inferno.createComponentVNode)(2, _bottom.BottomPocket, {
      "bottomPocketRef": bottomPocketRef,
      "reachBottomText": reachBottomText,
      "visible": !!reachBottomEnabled
    })], 0, null, null, contentRef), 2, null, null, containerRef), 2, null, null, wrapperRef), viewModel.props.loadPanelTemplate && LoadPanelTemplate({
      targetElement: scrollableRef,
      refreshingText: refreshingText,
      visible: isLoadPanelVisible
    }), needRenderScrollbars && showScrollbar !== 'never' && useSimulatedScrollbar && direction.isHorizontal && (0, _inferno.createComponentVNode)(2, _scrollbar.Scrollbar, {
      "direction": "horizontal",
      "showScrollbar": "onScroll",
      "contentSize": contentWidth,
      "containerSize": containerClientWidth,
      "maxOffset": hScrollOffsetMax,
      "scrollLocation": hScrollLocation,
      "visible": scrolling
    }, null, hScrollbarRef), needRenderScrollbars && showScrollbar !== 'never' && useSimulatedScrollbar && direction.isVertical && (0, _inferno.createComponentVNode)(2, _scrollbar.Scrollbar, {
      "direction": "vertical",
      "showScrollbar": "onScroll",
      "contentSize": contentHeight,
      "containerSize": containerClientHeight,
      "maxOffset": vScrollOffsetMax,
      "scrollLocation": vScrollLocation,
      "visible": scrolling
    }, null, vScrollbarRef)]
  })));
};
exports.viewFunction = viewFunction;
const getTemplate = TemplateProp => TemplateProp && (TemplateProp.defaultProps ? props => (0, _inferno.normalizeProps)((0, _inferno.createComponentVNode)(2, TemplateProp, _extends({}, props))) : TemplateProp);
let ScrollableNative = exports.ScrollableNative = /*#__PURE__*/function (_InfernoComponent) {
  _inheritsLoose(ScrollableNative, _InfernoComponent);
  function ScrollableNative(props) {
    var _this;
    _this = _InfernoComponent.call(this, props) || this;
    _this.scrollableRef = (0, _inferno.createRef)();
    _this.topPocketRef = (0, _inferno.createRef)();
    _this.bottomPocketRef = (0, _inferno.createRef)();
    _this.wrapperRef = (0, _inferno.createRef)();
    _this.contentRef = (0, _inferno.createRef)();
    _this.scrollViewContentRef = (0, _inferno.createRef)();
    _this.containerRef = (0, _inferno.createRef)();
    _this.vScrollbarRef = (0, _inferno.createRef)();
    _this.hScrollbarRef = (0, _inferno.createRef)();
    _this.locked = false;
    _this.loadingIndicatorEnabled = true;
    _this.initPageY = 0;
    _this.deltaY = 0;
    _this.locationTop = 0;
    _this.__getterCache = {};
    _this.state = {
      containerClientWidth: 0,
      containerClientHeight: 0,
      contentClientWidth: 0,
      contentClientHeight: 0,
      contentScrollWidth: 0,
      contentScrollHeight: 0,
      topPocketHeight: 0,
      bottomPocketHeight: 0,
      scrolling: false,
      topPocketState: _consts.TopPocketState.STATE_RELEASED,
      isLoadPanelVisible: false,
      pullDownTranslateTop: 0,
      pullDownIconAngle: 0,
      pullDownOpacity: 0,
      contentTranslateTop: 0,
      vScrollLocation: 0,
      hScrollLocation: 0
    };
    _this.content = _this.content.bind(_assertThisInitialized(_this));
    _this.container = _this.container.bind(_assertThisInitialized(_this));
    _this.refresh = _this.refresh.bind(_assertThisInitialized(_this));
    _this.release = _this.release.bind(_assertThisInitialized(_this));
    _this.disposeReleaseTimer = _this.disposeReleaseTimer.bind(_assertThisInitialized(_this));
    _this.scrollHeight = _this.scrollHeight.bind(_assertThisInitialized(_this));
    _this.scrollWidth = _this.scrollWidth.bind(_assertThisInitialized(_this));
    _this.scrollOffset = _this.scrollOffset.bind(_assertThisInitialized(_this));
    _this.scrollTop = _this.scrollTop.bind(_assertThisInitialized(_this));
    _this.scrollLeft = _this.scrollLeft.bind(_assertThisInitialized(_this));
    _this.clientHeight = _this.clientHeight.bind(_assertThisInitialized(_this));
    _this.clientWidth = _this.clientWidth.bind(_assertThisInitialized(_this));
    _this.scrollEffect = _this.scrollEffect.bind(_assertThisInitialized(_this));
    _this.effectDisabledState = _this.effectDisabledState.bind(_assertThisInitialized(_this));
    _this.resetInactiveOffsetToInitial = _this.resetInactiveOffsetToInitial.bind(_assertThisInitialized(_this));
    _this.initEffect = _this.initEffect.bind(_assertThisInitialized(_this));
    _this.moveEffect = _this.moveEffect.bind(_assertThisInitialized(_this));
    _this.endEffect = _this.endEffect.bind(_assertThisInitialized(_this));
    _this.stopEffect = _this.stopEffect.bind(_assertThisInitialized(_this));
    _this.disposeRefreshTimer = _this.disposeRefreshTimer.bind(_assertThisInitialized(_this));
    _this.validate = _this.validate.bind(_assertThisInitialized(_this));
    _this.moveIsAllowed = _this.moveIsAllowed.bind(_assertThisInitialized(_this));
    _this.updateHandler = _this.updateHandler.bind(_assertThisInitialized(_this));
    _this.updateDimensions = _this.updateDimensions.bind(_assertThisInitialized(_this));
    _this.subscribeContainerToResize = _this.subscribeContainerToResize.bind(_assertThisInitialized(_this));
    _this.subscribeContentToResize = _this.subscribeContentToResize.bind(_assertThisInitialized(_this));
    _this.scrollByLocation = _this.scrollByLocation.bind(_assertThisInitialized(_this));
    _this.clearReleaseTimer = _this.clearReleaseTimer.bind(_assertThisInitialized(_this));
    _this.onRelease = _this.onRelease.bind(_assertThisInitialized(_this));
    _this.onUpdated = _this.onUpdated.bind(_assertThisInitialized(_this));
    _this.startLoading = _this.startLoading.bind(_assertThisInitialized(_this));
    _this.finishLoading = _this.finishLoading.bind(_assertThisInitialized(_this));
    _this.setPocketState = _this.setPocketState.bind(_assertThisInitialized(_this));
    _this.handleScroll = _this.handleScroll.bind(_assertThisInitialized(_this));
    _this.handlePocketState = _this.handlePocketState.bind(_assertThisInitialized(_this));
    _this.pullDownReady = _this.pullDownReady.bind(_assertThisInitialized(_this));
    _this.onReachBottom = _this.onReachBottom.bind(_assertThisInitialized(_this));
    _this.onPullDown = _this.onPullDown.bind(_assertThisInitialized(_this));
    _this.stateReleased = _this.stateReleased.bind(_assertThisInitialized(_this));
    _this.getEventArgs = _this.getEventArgs.bind(_assertThisInitialized(_this));
    _this.lock = _this.lock.bind(_assertThisInitialized(_this));
    _this.unlock = _this.unlock.bind(_assertThisInitialized(_this));
    _this.updateElementDimensions = _this.updateElementDimensions.bind(_assertThisInitialized(_this));
    _this.setContainerDimensions = _this.setContainerDimensions.bind(_assertThisInitialized(_this));
    _this.setContentHeight = _this.setContentHeight.bind(_assertThisInitialized(_this));
    _this.setContentWidth = _this.setContentWidth.bind(_assertThisInitialized(_this));
    _this.syncScrollbarsWithContent = _this.syncScrollbarsWithContent.bind(_assertThisInitialized(_this));
    _this.getInitEventData = _this.getInitEventData.bind(_assertThisInitialized(_this));
    _this.handleInit = _this.handleInit.bind(_assertThisInitialized(_this));
    _this.handleMove = _this.handleMove.bind(_assertThisInitialized(_this));
    _this.handleEnd = _this.handleEnd.bind(_assertThisInitialized(_this));
    _this.handleStop = _this.handleStop.bind(_assertThisInitialized(_this));
    _this.pullDownComplete = _this.pullDownComplete.bind(_assertThisInitialized(_this));
    _this.clearRefreshTimer = _this.clearRefreshTimer.bind(_assertThisInitialized(_this));
    _this.pullDownRefreshing = _this.pullDownRefreshing.bind(_assertThisInitialized(_this));
    _this.movePullDown = _this.movePullDown.bind(_assertThisInitialized(_this));
    _this.getPullDownHeight = _this.getPullDownHeight.bind(_assertThisInitialized(_this));
    _this.getPullDownStartPosition = _this.getPullDownStartPosition.bind(_assertThisInitialized(_this));
    _this.complete = _this.complete.bind(_assertThisInitialized(_this));
    _this.releaseState = _this.releaseState.bind(_assertThisInitialized(_this));
    _this.isSwipeDown = _this.isSwipeDown.bind(_assertThisInitialized(_this));
    _this.pulledDown = _this.pulledDown.bind(_assertThisInitialized(_this));
    _this.isReachBottom = _this.isReachBottom.bind(_assertThisInitialized(_this));
    _this.tryGetAllowedDirection = _this.tryGetAllowedDirection.bind(_assertThisInitialized(_this));
    _this.isLocked = _this.isLocked.bind(_assertThisInitialized(_this));
    _this.isScrollingOutOfBound = _this.isScrollingOutOfBound.bind(_assertThisInitialized(_this));
    return _this;
  }
  var _proto = ScrollableNative.prototype;
  _proto.createEffects = function createEffects() {
    return [new _inferno2.InfernoEffect(this.disposeReleaseTimer, []), new _inferno2.InfernoEffect(this.scrollEffect, [this.props.useSimulatedScrollbar, this.props.onScroll, this.props.rtlEnabled, this.props.direction, this.props.forceGeneratePockets, this.state.topPocketState, this.props.refreshStrategy, this.props.reachBottomEnabled, this.state.contentClientHeight, this.state.contentScrollHeight, this.state.containerClientHeight, this.props.onReachBottom, this.props.pullDownEnabled, this.state.topPocketHeight]), new _inferno2.InfernoEffect(this.effectDisabledState, [this.props.disabled]), new _inferno2.InfernoEffect(this.resetInactiveOffsetToInitial, [this.props.direction]), new _inferno2.InfernoEffect(this.initEffect, [this.props.forceGeneratePockets, this.props.refreshStrategy, this.state.topPocketState, this.props.direction, this.props.disabled]), new _inferno2.InfernoEffect(this.moveEffect, [this.props.direction, this.props.forceGeneratePockets, this.props.refreshStrategy, this.state.topPocketState, this.props.pullDownEnabled, this.state.topPocketHeight]), new _inferno2.InfernoEffect(this.endEffect, [this.props.forceGeneratePockets, this.props.refreshStrategy, this.props.pullDownEnabled, this.state.topPocketState, this.state.topPocketHeight, this.props.onPullDown]), new _inferno2.InfernoEffect(this.stopEffect, [this.props.forceGeneratePockets, this.props.refreshStrategy, this.state.topPocketState, this.state.topPocketHeight, this.props.onPullDown]), new _inferno2.InfernoEffect(this.disposeRefreshTimer, []), new _inferno2.InfernoEffect(this.updateDimensions, []), new _inferno2.InfernoEffect(this.subscribeContainerToResize, []), new _inferno2.InfernoEffect(this.subscribeContentToResize, [])];
  };
  _proto.updateEffects = function updateEffects() {
    var _this$_effects$, _this$_effects$2, _this$_effects$3, _this$_effects$4, _this$_effects$5, _this$_effects$6, _this$_effects$7;
    (_this$_effects$ = this._effects[1]) === null || _this$_effects$ === void 0 ? void 0 : _this$_effects$.update([this.props.useSimulatedScrollbar, this.props.onScroll, this.props.rtlEnabled, this.props.direction, this.props.forceGeneratePockets, this.state.topPocketState, this.props.refreshStrategy, this.props.reachBottomEnabled, this.state.contentClientHeight, this.state.contentScrollHeight, this.state.containerClientHeight, this.props.onReachBottom, this.props.pullDownEnabled, this.state.topPocketHeight]);
    (_this$_effects$2 = this._effects[2]) === null || _this$_effects$2 === void 0 ? void 0 : _this$_effects$2.update([this.props.disabled]);
    (_this$_effects$3 = this._effects[3]) === null || _this$_effects$3 === void 0 ? void 0 : _this$_effects$3.update([this.props.direction]);
    (_this$_effects$4 = this._effects[4]) === null || _this$_effects$4 === void 0 ? void 0 : _this$_effects$4.update([this.props.forceGeneratePockets, this.props.refreshStrategy, this.state.topPocketState, this.props.direction, this.props.disabled]);
    (_this$_effects$5 = this._effects[5]) === null || _this$_effects$5 === void 0 ? void 0 : _this$_effects$5.update([this.props.direction, this.props.forceGeneratePockets, this.props.refreshStrategy, this.state.topPocketState, this.props.pullDownEnabled, this.state.topPocketHeight]);
    (_this$_effects$6 = this._effects[6]) === null || _this$_effects$6 === void 0 ? void 0 : _this$_effects$6.update([this.props.forceGeneratePockets, this.props.refreshStrategy, this.props.pullDownEnabled, this.state.topPocketState, this.state.topPocketHeight, this.props.onPullDown]);
    (_this$_effects$7 = this._effects[7]) === null || _this$_effects$7 === void 0 ? void 0 : _this$_effects$7.update([this.props.forceGeneratePockets, this.props.refreshStrategy, this.state.topPocketState, this.state.topPocketHeight, this.props.onPullDown]);
  };
  _proto.disposeReleaseTimer = function disposeReleaseTimer() {
    return () => this.clearReleaseTimer();
  };
  _proto.scrollEffect = function scrollEffect() {
    return (0, _subscribe_to_event.subscribeToScrollEvent)(this.containerRef.current, event => {
      this.handleScroll(event);
    });
  };
  _proto.effectDisabledState = function effectDisabledState() {
    if (this.props.disabled) {
      this.lock();
    } else {
      this.unlock();
    }
  };
  _proto.resetInactiveOffsetToInitial = function resetInactiveOffsetToInitial() {
    if (this.props.direction === _consts.DIRECTION_BOTH) {
      return;
    }
    this.containerRef.current[this.fullScrollInactiveProp] = 0;
  };
  _proto.initEffect = function initEffect() {
    return (0, _subscribe_to_event.subscribeToScrollInitEvent)(this.wrapperRef.current, event => {
      this.handleInit(event);
    }, this.getInitEventData());
  };
  _proto.moveEffect = function moveEffect() {
    return (0, _subscribe_to_event.subscribeToDXScrollMoveEvent)(this.wrapperRef.current, event => {
      this.handleMove(event);
    });
  };
  _proto.endEffect = function endEffect() {
    return (0, _subscribe_to_event.subscribeToDXScrollEndEvent)(this.wrapperRef.current, () => {
      this.handleEnd();
    });
  };
  _proto.stopEffect = function stopEffect() {
    return (0, _subscribe_to_event.subscribeToDXScrollStopEvent)(this.wrapperRef.current, () => {
      this.handleStop();
    });
  };
  _proto.disposeRefreshTimer = function disposeRefreshTimer() {
    return () => this.clearRefreshTimer();
  };
  _proto.updateDimensions = function updateDimensions() {
    this.updateElementDimensions();
  };
  _proto.subscribeContainerToResize = function subscribeContainerToResize() {
    return (0, _subscribe_to_resize.subscribeToResize)(this.containerRef.current, element => {
      this.setContainerDimensions(element);
    });
  };
  _proto.subscribeContentToResize = function subscribeContentToResize() {
    return (0, _subscribe_to_resize.subscribeToResize)(this.content(), element => {
      this.setContentHeight(element);
      this.setContentWidth(element);
    });
  };
  _proto.clearReleaseTimer = function clearReleaseTimer() {
    clearTimeout(this.releaseTimer);
    this.releaseTimer = undefined;
  };
  _proto.onRelease = function onRelease() {
    this.loadingIndicatorEnabled = true;
    this.finishLoading();
  };
  _proto.onUpdated = function onUpdated() {
    var _this$props$onUpdated, _this$props;
    (_this$props$onUpdated = (_this$props = this.props).onUpdated) === null || _this$props$onUpdated === void 0 ? void 0 : _this$props$onUpdated.call(_this$props, this.getEventArgs());
  };
  _proto.startLoading = function startLoading() {
    if (this.loadingIndicatorEnabled && (0, _is_element_visible.isElementVisible)(this.scrollableRef.current)) {
      this.setState(__state_argument => ({
        isLoadPanelVisible: true
      }));
    }
    this.lock();
  };
  _proto.finishLoading = function finishLoading() {
    this.setState(__state_argument => ({
      isLoadPanelVisible: false
    }));
    this.unlock();
  };
  _proto.setPocketState = function setPocketState(newState) {
    this.setState(__state_argument => ({
      topPocketState: newState
    }));
  };
  _proto.handleScroll = function handleScroll(event) {
    var _this$props$onScroll, _this$props2;
    this.eventForUserAction = event;
    if (this.props.useSimulatedScrollbar) {
      this.setState(__state_argument => ({
        scrolling: true
      }));
      this.syncScrollbarsWithContent();
      this.setState(__state_argument => ({
        scrolling: false
      }));
    }
    (_this$props$onScroll = (_this$props2 = this.props).onScroll) === null || _this$props$onScroll === void 0 ? void 0 : _this$props$onScroll.call(_this$props2, this.getEventArgs());
    this.handlePocketState();
  };
  _proto.handlePocketState = function handlePocketState() {
    if (this.props.forceGeneratePockets) {
      if (this.state.topPocketState === _consts.TopPocketState.STATE_REFRESHING) {
        return;
      }
      const {
        scrollTop
      } = this.containerRef.current;
      const scrollDelta = this.locationTop + scrollTop;
      this.locationTop = -scrollTop;
      if (this.isSwipeDownStrategy && scrollDelta > 0 && this.isReachBottom()) {
        this.onReachBottom();
        return;
      }
      if (this.isPullDownStrategy) {
        if (this.pulledDown()) {
          this.pullDownReady();
          return;
        }
        if (scrollDelta > 0 && this.isReachBottom()) {
          if (this.state.topPocketState !== _consts.TopPocketState.STATE_LOADING) {
            this.setPocketState(_consts.TopPocketState.STATE_LOADING);
            this.onReachBottom();
          }
          return;
        }
      }
      this.stateReleased();
    }
  };
  _proto.pullDownReady = function pullDownReady() {
    if (this.state.topPocketState === _consts.TopPocketState.STATE_READY) {
      return;
    }
    this.setPocketState(_consts.TopPocketState.STATE_READY);
  };
  _proto.onReachBottom = function onReachBottom() {
    var _this$props$onReachBo, _this$props3;
    (_this$props$onReachBo = (_this$props3 = this.props).onReachBottom) === null || _this$props$onReachBo === void 0 ? void 0 : _this$props$onReachBo.call(_this$props3, {});
  };
  _proto.onPullDown = function onPullDown() {
    var _this$props$onPullDow, _this$props4;
    (_this$props$onPullDow = (_this$props4 = this.props).onPullDown) === null || _this$props$onPullDow === void 0 ? void 0 : _this$props$onPullDow.call(_this$props4, {});
  };
  _proto.stateReleased = function stateReleased() {
    if (this.state.topPocketState === _consts.TopPocketState.STATE_RELEASED) {
      return;
    }
    this.releaseState();
  };
  _proto.getEventArgs = function getEventArgs() {
    const scrollOffset = this.scrollOffset();
    return _extends({
      event: this.eventForUserAction,
      scrollOffset
    }, (0, _get_boundary_props.getBoundaryProps)(this.props.direction, scrollOffset, this.containerRef.current));
  };
  _proto.lock = function lock() {
    this.locked = true;
  };
  _proto.unlock = function unlock() {
    if (!this.props.disabled) {
      this.locked = false;
    }
  };
  _proto.updateElementDimensions = function updateElementDimensions() {
    this.setContentHeight(this.content());
    this.setContentWidth(this.content());
    this.setContainerDimensions(this.containerRef.current);
  };
  _proto.setContainerDimensions = function setContainerDimensions(containerEl) {
    this.setState(__state_argument => ({
      containerClientWidth: containerEl.clientWidth
    }));
    this.setState(__state_argument => ({
      containerClientHeight: containerEl.clientHeight
    }));
  };
  _proto.setContentHeight = function setContentHeight(contentEl) {
    this.setState(__state_argument => ({
      contentClientHeight: contentEl.clientHeight
    }));
    this.setState(__state_argument => ({
      contentScrollHeight: contentEl.scrollHeight
    }));
    if (this.props.forceGeneratePockets) {
      this.setState(__state_argument => {
        var _this$topPocketRef;
        return {
          topPocketHeight: ((_this$topPocketRef = this.topPocketRef) === null || _this$topPocketRef === void 0 ? void 0 : _this$topPocketRef.current.clientHeight) || 0
        };
      });
      this.setState(__state_argument => {
        var _this$bottomPocketRef;
        return {
          bottomPocketHeight: ((_this$bottomPocketRef = this.bottomPocketRef) === null || _this$bottomPocketRef === void 0 ? void 0 : _this$bottomPocketRef.current.clientHeight) || 0
        };
      });
    }
  };
  _proto.setContentWidth = function setContentWidth(contentEl) {
    this.setState(__state_argument => ({
      contentClientWidth: contentEl.clientWidth
    }));
    this.setState(__state_argument => ({
      contentScrollWidth: contentEl.scrollWidth
    }));
  };
  _proto.syncScrollbarsWithContent = function syncScrollbarsWithContent() {
    const {
      left,
      top
    } = this.scrollOffset();
    this.setState(__state_argument => ({
      hScrollLocation: -left
    }));
    this.setState(__state_argument => ({
      vScrollLocation: -top
    }));
  };
  _proto.getInitEventData = function getInitEventData() {
    return {
      getDirection: () => this.tryGetAllowedDirection(),
      validate: event => this.validate(event),
      isNative: true,
      scrollTarget: this.containerRef.current
    };
  };
  _proto.handleInit = function handleInit(event) {
    if (this.props.forceGeneratePockets && this.isSwipeDownStrategy) {
      const {
        scrollTop
      } = this.containerRef.current;
      if (this.state.topPocketState === _consts.TopPocketState.STATE_RELEASED && scrollTop === 0) {
        this.initPageY = event.originalEvent.pageY;
        this.setPocketState(_consts.TopPocketState.STATE_TOUCHED);
      }
    }
  };
  _proto.handleMove = function handleMove(e) {
    if (this.locked) {
      e.cancel = true;
      return;
    }
    if ((0, _type.isDefined)(this.tryGetAllowedDirection())) {
      e.originalEvent.isScrollingEvent = true;
    }
    if (this.props.forceGeneratePockets && this.isSwipeDownStrategy) {
      this.deltaY = e.originalEvent.pageY - this.initPageY;
      if (this.state.topPocketState === _consts.TopPocketState.STATE_TOUCHED) {
        if (this.pullDownEnabled && this.deltaY > 0) {
          this.setPocketState(_consts.TopPocketState.STATE_PULLED);
        } else {
          this.complete();
        }
      }
      if (this.state.topPocketState === _consts.TopPocketState.STATE_PULLED) {
        e.preventDefault();
        this.movePullDown();
      }
    }
  };
  _proto.handleEnd = function handleEnd() {
    if (this.props.forceGeneratePockets) {
      if (this.isSwipeDownStrategy) {
        if (this.isSwipeDown()) {
          this.pullDownRefreshing();
        }
        this.complete();
      }
      if (this.isPullDownStrategy) {
        this.pullDownComplete();
      }
    }
  };
  _proto.handleStop = function handleStop() {
    if (this.props.forceGeneratePockets) {
      if (this.isSwipeDownStrategy) {
        this.complete();
      }
      if (this.isPullDownStrategy) {
        this.pullDownComplete();
      }
    }
  };
  _proto.pullDownComplete = function pullDownComplete() {
    if (this.state.topPocketState === _consts.TopPocketState.STATE_READY) {
      this.setState(__state_argument => ({
        contentTranslateTop: this.state.topPocketHeight
      }));
      this.clearRefreshTimer();
      this.refreshTimer = setTimeout(() => {
        this.pullDownRefreshing();
      }, 400);
    }
  };
  _proto.clearRefreshTimer = function clearRefreshTimer() {
    clearTimeout(this.refreshTimer);
    this.refreshTimer = undefined;
  };
  _proto.pullDownRefreshing = function pullDownRefreshing() {
    if (this.state.topPocketState === _consts.TopPocketState.STATE_REFRESHING) {
      return;
    }
    this.setPocketState(_consts.TopPocketState.STATE_REFRESHING);
    if (this.isSwipeDownStrategy) {
      this.setState(__state_argument => ({
        pullDownTranslateTop: this.getPullDownHeight()
      }));
    }
    this.onPullDown();
  };
  _proto.movePullDown = function movePullDown() {
    const pullDownHeight = this.getPullDownHeight();
    const top = Math.min(pullDownHeight * 3, this.deltaY + this.getPullDownStartPosition());
    const angle = 180 * top / pullDownHeight / 3;
    this.setState(__state_argument => ({
      pullDownOpacity: 1
    }));
    this.setState(__state_argument => ({
      pullDownTranslateTop: top
    }));
    this.setState(__state_argument => ({
      pullDownIconAngle: angle
    }));
  };
  _proto.getPullDownHeight = function getPullDownHeight() {
    return Math.round(this.scrollableRef.current.offsetHeight * 0.05);
  };
  _proto.getPullDownStartPosition = function getPullDownStartPosition() {
    return -Math.round(this.state.topPocketHeight * 1.5);
  };
  _proto.complete = function complete() {
    if (this.state.topPocketState === _consts.TopPocketState.STATE_TOUCHED || this.state.topPocketState === _consts.TopPocketState.STATE_PULLED) {
      this.releaseState();
    }
  };
  _proto.releaseState = function releaseState() {
    this.setPocketState(_consts.TopPocketState.STATE_RELEASED);
    this.setState(__state_argument => ({
      pullDownOpacity: 0
    }));
  };
  _proto.isSwipeDown = function isSwipeDown() {
    return this.pullDownEnabled && this.state.topPocketState === _consts.TopPocketState.STATE_PULLED && this.deltaY >= this.getPullDownHeight() - this.getPullDownStartPosition();
  };
  _proto.pulledDown = function pulledDown() {
    const {
      scrollTop
    } = this.containerRef.current;
    return this.pullDownEnabled && scrollTop <= -this.state.topPocketHeight;
  };
  _proto.isReachBottom = function isReachBottom() {
    const {
      scrollTop
    } = this.containerRef.current;
    return this.props.reachBottomEnabled && Math.round(-scrollTop - this.vScrollOffsetMax) <= 1;
  };
  _proto.tryGetAllowedDirection = function tryGetAllowedDirection() {
    const containerEl = this.containerRef.current;
    return (0, _get_allowed_direction.allowedDirection)(this.props.direction, (0, _get_scroll_top_max.getScrollTopMax)(containerEl), (0, _get_scroll_left_max.getScrollLeftMax)(containerEl), false);
  };
  _proto.isLocked = function isLocked() {
    return this.locked;
  };
  _proto.isScrollingOutOfBound = function isScrollingOutOfBound(event) {
    const {
      delta,
      shiftKey
    } = event;
    const {
      clientHeight,
      clientWidth,
      scrollHeight,
      scrollLeft,
      scrollTop,
      scrollWidth
    } = this.containerRef.current;
    if (delta > 0) {
      return shiftKey ? !scrollLeft : !scrollTop;
    }
    return shiftKey ? clientWidth >= scrollWidth - scrollLeft : clientHeight >= scrollHeight - scrollTop;
  };
  _proto.content = function content() {
    if (this.props.needScrollViewContentWrapper) {
      return this.scrollViewContentRef.current;
    }
    return this.contentRef.current;
  };
  _proto.container = function container() {
    return this.containerRef.current;
  };
  _proto.refresh = function refresh() {
    this.setPocketState(_consts.TopPocketState.STATE_READY);
    this.startLoading();
    this.onPullDown();
  };
  _proto.release = function release() {
    this.clearReleaseTimer();
    if (this.isPullDownStrategy) {
      if (this.state.topPocketState === _consts.TopPocketState.STATE_LOADING) {
        this.setPocketState(_consts.TopPocketState.STATE_RELEASED);
      }
    }
    this.releaseTimer = setTimeout(() => {
      if (this.isPullDownStrategy) {
        this.setState(__state_argument => ({
          contentTranslateTop: 0
        }));
      }
      this.stateReleased();
      this.onRelease();
    }, this.isSwipeDownStrategy ? 800 : 400);
  };
  _proto.scrollHeight = function scrollHeight() {
    return this.content().offsetHeight;
  };
  _proto.scrollWidth = function scrollWidth() {
    return this.content().offsetWidth;
  };
  _proto.scrollOffset = function scrollOffset() {
    return {
      top: this.scrollTop(),
      left: this.scrollLeft()
    };
  };
  _proto.scrollTop = function scrollTop() {
    return this.containerRef.current.scrollTop;
  };
  _proto.scrollLeft = function scrollLeft() {
    const containerEl = this.containerRef.current;
    const scrollLeftMax = (0, _get_scroll_left_max.getScrollLeftMax)(containerEl);
    return (0, _normalize_offset_left.normalizeOffsetLeft)(containerEl.scrollLeft, scrollLeftMax, !!this.props.rtlEnabled);
  };
  _proto.clientHeight = function clientHeight() {
    return this.containerRef.current.clientHeight;
  };
  _proto.clientWidth = function clientWidth() {
    return this.containerRef.current.clientWidth;
  };
  _proto.validate = function validate(event) {
    if (this.isLocked()) {
      return false;
    }
    return this.moveIsAllowed(event);
  };
  _proto.moveIsAllowed = function moveIsAllowed(event) {
    if (this.props.disabled || (0, _index.isDxMouseWheelEvent)(event) && this.isScrollingOutOfBound(event)) {
      return false;
    }
    return (0, _type.isDefined)(this.tryGetAllowedDirection());
  };
  _proto.updateHandler = function updateHandler() {
    this.updateElementDimensions();
    this.onUpdated();
  };
  _proto.scrollByLocation = function scrollByLocation(location) {
    const containerEl = this.containerRef.current;
    if (this.direction.isVertical) {
      containerEl.scrollTop += location.top;
    }
    if (this.direction.isHorizontal) {
      containerEl.scrollLeft += location.left;
    }
  };
  _proto.componentWillUpdate = function componentWillUpdate(nextProps, nextState, context) {
    _InfernoComponent.prototype.componentWillUpdate.call(this);
    if (this.props['direction'] !== nextProps['direction']) {
      this.__getterCache['direction'] = undefined;
    }
    if (this.props['forceGeneratePockets'] !== nextProps['forceGeneratePockets'] || this.props['refreshStrategy'] !== nextProps['refreshStrategy'] || this.state['contentTranslateTop'] !== nextState['contentTranslateTop']) {
      this.__getterCache['contentStyles'] = undefined;
    }
  };
  _proto.render = function render() {
    const props = this.props;
    return viewFunction({
      props: _extends({}, props, {
        loadPanelTemplate: getTemplate(props.loadPanelTemplate)
      }),
      containerClientWidth: this.state.containerClientWidth,
      containerClientHeight: this.state.containerClientHeight,
      contentClientWidth: this.state.contentClientWidth,
      contentClientHeight: this.state.contentClientHeight,
      contentScrollWidth: this.state.contentScrollWidth,
      contentScrollHeight: this.state.contentScrollHeight,
      topPocketHeight: this.state.topPocketHeight,
      bottomPocketHeight: this.state.bottomPocketHeight,
      scrolling: this.state.scrolling,
      topPocketState: this.state.topPocketState,
      isLoadPanelVisible: this.state.isLoadPanelVisible,
      pullDownTranslateTop: this.state.pullDownTranslateTop,
      pullDownIconAngle: this.state.pullDownIconAngle,
      pullDownOpacity: this.state.pullDownOpacity,
      contentTranslateTop: this.state.contentTranslateTop,
      vScrollLocation: this.state.vScrollLocation,
      hScrollLocation: this.state.hScrollLocation,
      wrapperRef: this.wrapperRef,
      contentRef: this.contentRef,
      scrollViewContentRef: this.scrollViewContentRef,
      containerRef: this.containerRef,
      scrollableRef: this.scrollableRef,
      topPocketRef: this.topPocketRef,
      bottomPocketRef: this.bottomPocketRef,
      vScrollbarRef: this.vScrollbarRef,
      hScrollbarRef: this.hScrollbarRef,
      clearReleaseTimer: this.clearReleaseTimer,
      onRelease: this.onRelease,
      onUpdated: this.onUpdated,
      startLoading: this.startLoading,
      finishLoading: this.finishLoading,
      setPocketState: this.setPocketState,
      handleScroll: this.handleScroll,
      handlePocketState: this.handlePocketState,
      pullDownReady: this.pullDownReady,
      onReachBottom: this.onReachBottom,
      onPullDown: this.onPullDown,
      stateReleased: this.stateReleased,
      getEventArgs: this.getEventArgs,
      lock: this.lock,
      unlock: this.unlock,
      fullScrollInactiveProp: this.fullScrollInactiveProp,
      updateElementDimensions: this.updateElementDimensions,
      setContainerDimensions: this.setContainerDimensions,
      setContentHeight: this.setContentHeight,
      setContentWidth: this.setContentWidth,
      syncScrollbarsWithContent: this.syncScrollbarsWithContent,
      getInitEventData: this.getInitEventData,
      handleInit: this.handleInit,
      handleMove: this.handleMove,
      handleEnd: this.handleEnd,
      handleStop: this.handleStop,
      pullDownComplete: this.pullDownComplete,
      clearRefreshTimer: this.clearRefreshTimer,
      pullDownRefreshing: this.pullDownRefreshing,
      movePullDown: this.movePullDown,
      getPullDownHeight: this.getPullDownHeight,
      getPullDownStartPosition: this.getPullDownStartPosition,
      complete: this.complete,
      releaseState: this.releaseState,
      isSwipeDownStrategy: this.isSwipeDownStrategy,
      isPullDownStrategy: this.isPullDownStrategy,
      isSwipeDown: this.isSwipeDown,
      pulledDown: this.pulledDown,
      isReachBottom: this.isReachBottom,
      tryGetAllowedDirection: this.tryGetAllowedDirection,
      isLocked: this.isLocked,
      isScrollingOutOfBound: this.isScrollingOutOfBound,
      cssClasses: this.cssClasses,
      direction: this.direction,
      pullDownEnabled: this.pullDownEnabled,
      contentStyles: this.contentStyles,
      contentHeight: this.contentHeight,
      contentWidth: this.contentWidth,
      hScrollOffsetMax: this.hScrollOffsetMax,
      vScrollOffsetMax: this.vScrollOffsetMax,
      restAttributes: this.restAttributes
    });
  };
  _createClass(ScrollableNative, [{
    key: "fullScrollInactiveProp",
    get: function () {
      return this.props.direction === _consts.DIRECTION_HORIZONTAL ? 'scrollTop' : 'scrollLeft';
    }
  }, {
    key: "isSwipeDownStrategy",
    get: function () {
      return this.props.refreshStrategy === 'swipeDown';
    }
  }, {
    key: "isPullDownStrategy",
    get: function () {
      return this.props.refreshStrategy === 'pullDown';
    }
  }, {
    key: "cssClasses",
    get: function () {
      const {
        classes,
        direction,
        disabled,
        showScrollbar
      } = this.props;
      const classesMap = {
        ["dx-scrollable dx-scrollable-native dx-scrollable-native-".concat(_devices.default.real().platform)]: true,
        ["dx-scrollable-".concat(direction)]: true,
        [_consts.SCROLLABLE_DISABLED_CLASS]: !!disabled,
        [_consts.SCROLLABLE_SCROLLBAR_SIMULATED]: showScrollbar !== 'never' && this.props.useSimulatedScrollbar,
        [_consts.SCROLLABLE_SCROLLBARS_HIDDEN]: showScrollbar === 'never',
        [String(classes)]: !!classes
      };
      return (0, _combine_classes.combineClasses)(classesMap);
    }
  }, {
    key: "direction",
    get: function () {
      if (this.__getterCache['direction'] !== undefined) {
        return this.__getterCache['direction'];
      }
      return this.__getterCache['direction'] = (() => {
        return new _scroll_direction.ScrollDirection(this.props.direction);
      })();
    }
  }, {
    key: "pullDownEnabled",
    get: function () {
      return this.props.pullDownEnabled && _devices.default.real().platform !== 'generic';
    }
  }, {
    key: "contentStyles",
    get: function () {
      if (this.__getterCache['contentStyles'] !== undefined) {
        return this.__getterCache['contentStyles'];
      }
      return this.__getterCache['contentStyles'] = (() => {
        if (this.props.forceGeneratePockets && this.isPullDownStrategy) {
          return {
            transform: "translate(0px, ".concat(this.state.contentTranslateTop, "px)")
          };
        }
        return undefined;
      })();
    }
  }, {
    key: "contentHeight",
    get: function () {
      var _this$contentRef;
      return (0, _get_element_style.getElementOverflowY)((_this$contentRef = this.contentRef) === null || _this$contentRef === void 0 ? void 0 : _this$contentRef.current) === 'hidden' ? this.state.contentClientHeight : Math.max(this.state.contentScrollHeight, this.state.contentClientHeight);
    }
  }, {
    key: "contentWidth",
    get: function () {
      var _this$contentRef2;
      return (0, _get_element_style.getElementOverflowX)((_this$contentRef2 = this.contentRef) === null || _this$contentRef2 === void 0 ? void 0 : _this$contentRef2.current) === 'hidden' ? this.state.contentClientWidth : Math.max(this.state.contentScrollWidth, this.state.contentClientWidth);
    }
  }, {
    key: "hScrollOffsetMax",
    get: function () {
      return -Math.max(this.contentWidth - this.state.containerClientWidth, 0);
    }
  }, {
    key: "vScrollOffsetMax",
    get: function () {
      return -Math.max(this.contentHeight - this.state.containerClientHeight, 0);
    }
  }, {
    key: "restAttributes",
    get: function () {
      const _this$props5 = this.props,
        restProps = _objectWithoutPropertiesLoose(_this$props5, _excluded);
      return restProps;
    }
  }]);
  return ScrollableNative;
}(_inferno2.InfernoComponent);
ScrollableNative.defaultProps = _native_strategy_props.ScrollableNativeProps;
