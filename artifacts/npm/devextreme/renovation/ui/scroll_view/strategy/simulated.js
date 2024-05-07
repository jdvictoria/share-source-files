/**
* DevExtreme (renovation/ui/scroll_view/strategy/simulated.js)
* Version: 24.1.1
* Build date: Tue May 07 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.viewFunction = exports.ScrollableSimulated = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@devextreme/runtime/inferno");
require("../../../../events/gesture/emitter.gesture.scroll");
var _subscribe_to_event = require("../../../utils/subscribe_to_event");
var _animated_scrollbar = require("../scrollbar/animated_scrollbar");
var _widget = require("../../common/widget");
var _combine_classes = require("../../../utils/combine_classes");
var _get_offset_distance = require("../utils/get_offset_distance");
var _get_boundary_props = require("../utils/get_boundary_props");
var _get_permissible_wheel_direction = require("../utils/get_permissible_wheel_direction");
var _index = require("../../../../events/utils/index");
var _type = require("../../../../core/utils/type");
var _simulated_strategy_props = require("../common/simulated_strategy_props");
var _events_engine = _interopRequireDefault(require("../../../../events/core/events_engine"));
var _math = require("../../../../core/utils/math");
var _scroll_direction = require("../utils/scroll_direction");
var _consts = require("../common/consts");
var _get_element_offset = require("../../../utils/get_element_offset");
var _get_element_style = require("../utils/get_element_style");
var _top = require("../internal/pocket/top");
var _bottom = require("../internal/pocket/bottom");
var _get_device_pixel_ratio = require("../utils/get_device_pixel_ratio");
var _is_element_visible = require("../utils/is_element_visible");
var _get_allowed_direction = require("../utils/get_allowed_direction");
var _subscribe_to_resize = require("../utils/subscribe_to_resize");
var _dom_adapter = _interopRequireDefault(require("../../../../core/dom_adapter"));
var _get_scroll_left_max = require("../utils/get_scroll_left_max");
const _excluded = ["addWidgetClass", "aria", "bounceEnabled", "children", "classes", "direction", "disabled", "forceGeneratePockets", "height", "inertiaEnabled", "loadPanelTemplate", "needRenderScrollbars", "needScrollViewContentWrapper", "onBounce", "onEnd", "onPullDown", "onReachBottom", "onScroll", "onStart", "onUpdated", "onVisibilityChange", "pullDownEnabled", "pulledDownText", "pullingDownText", "reachBottomEnabled", "reachBottomText", "refreshStrategy", "refreshingText", "rtlEnabled", "scrollByContent", "scrollByThumb", "scrollLocationChange", "showScrollbar", "useKeyboard", "visible", "width"];
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
    active,
    bottomPocketHeight,
    bottomPocketRef,
    containerClientHeight,
    containerClientWidth,
    containerHasSizes,
    containerRef,
    containerStyles,
    contentHeight,
    contentPaddingBottom,
    contentRef,
    contentStyles,
    contentWidth,
    cssClasses,
    direction,
    hScrollLocation,
    hScrollOffsetMax,
    hScrollbarRef,
    handleKeyDown,
    hovered,
    isLoadPanelVisible,
    lock,
    onBounce,
    onEnd,
    onPullDown,
    onReachBottom,
    onScroll,
    onVisibilityChangeHandler,
    props: {
      aria,
      bounceEnabled,
      children,
      forceGeneratePockets,
      height,
      inertiaEnabled,
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
      scrollByThumb,
      showScrollbar,
      useKeyboard,
      visible,
      width
    },
    pulledDown,
    restAttributes,
    scrollLocationChange,
    scrollViewContentRef,
    scrollableRef,
    scrolling,
    topPocketRef,
    topPocketState,
    unlock,
    vScrollLocation,
    vScrollOffsetMax,
    vScrollOffsetMin,
    vScrollbarRef,
    wrapperRef
  } = viewModel;
  return (0, _inferno.normalizeProps)((0, _inferno.createComponentVNode)(2, _widget.Widget, _extends({
    "rootElementRef": scrollableRef,
    "focusStateEnabled": useKeyboard,
    "aria": aria,
    "addWidgetClass": false,
    "classes": cssClasses,
    "rtlEnabled": rtlEnabled,
    "height": height,
    "width": width,
    "visible": visible,
    "onVisibilityChange": onVisibilityChangeHandler
  }, restAttributes, {
    "onKeyDown": handleKeyDown,
    children: [(0, _inferno.createVNode)(1, "div", _consts.SCROLLABLE_WRAPPER_CLASS, (0, _inferno.createVNode)(1, "div", _consts.SCROLLABLE_CONTAINER_CLASS, [(0, _inferno.createVNode)(1, "div", _consts.SCROLLABLE_CONTENT_CLASS, [forceGeneratePockets && (0, _inferno.createComponentVNode)(2, _top.TopPocket, {
      "topPocketRef": topPocketRef,
      "pullingDownText": pullingDownText,
      "pulledDownText": pulledDownText,
      "refreshingText": refreshingText,
      "refreshStrategy": refreshStrategy,
      "pocketState": topPocketState,
      "visible": !!pullDownEnabled
    }), needScrollViewContentWrapper ? (0, _inferno.createVNode)(1, "div", _consts.SCROLLVIEW_CONTENT_CLASS, children, 0, null, null, scrollViewContentRef) : children, forceGeneratePockets && (0, _inferno.createComponentVNode)(2, _bottom.BottomPocket, {
      "bottomPocketRef": bottomPocketRef,
      "reachBottomText": reachBottomText,
      "visible": !!reachBottomEnabled
    })], 0, {
      "style": (0, _inferno2.normalizeStyles)(contentStyles)
    }, null, contentRef), needRenderScrollbars && direction.isHorizontal && (0, _inferno.createComponentVNode)(2, _animated_scrollbar.AnimatedScrollbar, {
      "direction": "horizontal",
      "contentSize": contentWidth,
      "containerSize": containerClientWidth,
      "visible": hovered || scrolling || active,
      "minOffset": 0,
      "maxOffset": hScrollOffsetMax,
      "scrollLocation": hScrollLocation,
      "scrollLocationChange": scrollLocationChange,
      "scrollByThumb": scrollByThumb,
      "bounceEnabled": bounceEnabled,
      "showScrollbar": showScrollbar,
      "inertiaEnabled": inertiaEnabled,
      "onBounce": onBounce,
      "onScroll": onScroll,
      "onEnd": onEnd,
      "containerHasSizes": containerHasSizes,
      "rtlEnabled": rtlEnabled,
      "onLock": lock,
      "onUnlock": unlock
    }, null, hScrollbarRef), needRenderScrollbars && direction.isVertical && (0, _inferno.createComponentVNode)(2, _animated_scrollbar.AnimatedScrollbar, {
      "direction": "vertical",
      "contentSize": contentHeight,
      "containerSize": containerClientHeight,
      "visible": hovered || scrolling || active,
      "minOffset": vScrollOffsetMin,
      "maxOffset": vScrollOffsetMax,
      "scrollLocation": vScrollLocation,
      "scrollLocationChange": scrollLocationChange,
      "scrollByThumb": scrollByThumb,
      "bounceEnabled": bounceEnabled,
      "showScrollbar": showScrollbar,
      "inertiaEnabled": inertiaEnabled,
      "onBounce": onBounce,
      "onScroll": onScroll,
      "onEnd": onEnd,
      "containerHasSizes": containerHasSizes,
      "forceGeneratePockets": forceGeneratePockets,
      "bottomPocketSize": bottomPocketHeight,
      "contentPaddingBottom": contentPaddingBottom,
      "pulledDown": pulledDown,
      "onPullDown": onPullDown,
      "onReachBottom": onReachBottom,
      "reachBottomEnabled": reachBottomEnabled,
      "onLock": lock,
      "onUnlock": unlock
    }, null, vScrollbarRef)], 0, {
      "style": (0, _inferno2.normalizeStyles)(containerStyles)
    }, null, containerRef), 2, null, null, wrapperRef), viewModel.props.loadPanelTemplate && LoadPanelTemplate({
      targetElement: scrollableRef,
      refreshingText: refreshingText,
      visible: isLoadPanelVisible
    })]
  })));
};
exports.viewFunction = viewFunction;
const getTemplate = TemplateProp => TemplateProp && (TemplateProp.defaultProps ? props => (0, _inferno.normalizeProps)((0, _inferno.createComponentVNode)(2, TemplateProp, _extends({}, props))) : TemplateProp);
let ScrollableSimulated = exports.ScrollableSimulated = /*#__PURE__*/function (_InfernoComponent) {
  _inheritsLoose(ScrollableSimulated, _InfernoComponent);
  function ScrollableSimulated(props) {
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
    _this.prevDirection = 'initial';
    _this.locked = false;
    _this.loadingIndicatorEnabled = true;
    _this.validDirections = {};
    _this.endActionDirections = {
      horizontal: false,
      vertical: false
    };
    _this.savedScrollOffset = {
      scrollTop: 0,
      scrollLeft: 0
    };
    _this.__getterCache = {};
    _this.state = {
      active: false,
      hovered: false,
      scrolling: false,
      containerClientWidth: 0,
      containerClientHeight: 0,
      contentScrollWidth: 0,
      contentScrollHeight: 0,
      contentClientWidth: 0,
      contentClientHeight: 0,
      contentPaddingBottom: 0,
      topPocketHeight: 0,
      bottomPocketHeight: 0,
      topPocketState: _consts.TopPocketState.STATE_RELEASED,
      isLoadPanelVisible: false,
      vScrollLocation: 0,
      hScrollLocation: 0,
      pendingScrollEvent: false
    };
    _this.content = _this.content.bind(_assertThisInitialized(_this));
    _this.container = _this.container.bind(_assertThisInitialized(_this));
    _this.refresh = _this.refresh.bind(_assertThisInitialized(_this));
    _this.release = _this.release.bind(_assertThisInitialized(_this));
    _this.updateHandler = _this.updateHandler.bind(_assertThisInitialized(_this));
    _this.scrollHeight = _this.scrollHeight.bind(_assertThisInitialized(_this));
    _this.scrollWidth = _this.scrollWidth.bind(_assertThisInitialized(_this));
    _this.scrollOffset = _this.scrollOffset.bind(_assertThisInitialized(_this));
    _this.scrollTop = _this.scrollTop.bind(_assertThisInitialized(_this));
    _this.scrollLeft = _this.scrollLeft.bind(_assertThisInitialized(_this));
    _this.clientHeight = _this.clientHeight.bind(_assertThisInitialized(_this));
    _this.clientWidth = _this.clientWidth.bind(_assertThisInitialized(_this));
    _this.disposeWheelTimer = _this.disposeWheelTimer.bind(_assertThisInitialized(_this));
    _this.scrollEffect = _this.scrollEffect.bind(_assertThisInitialized(_this));
    _this.startEffect = _this.startEffect.bind(_assertThisInitialized(_this));
    _this.initEffect = _this.initEffect.bind(_assertThisInitialized(_this));
    _this.moveEffect = _this.moveEffect.bind(_assertThisInitialized(_this));
    _this.endEffect = _this.endEffect.bind(_assertThisInitialized(_this));
    _this.stopEffect = _this.stopEffect.bind(_assertThisInitialized(_this));
    _this.cancelEffect = _this.cancelEffect.bind(_assertThisInitialized(_this));
    _this.pointerDownEffect = _this.pointerDownEffect.bind(_assertThisInitialized(_this));
    _this.pointerUpEffect = _this.pointerUpEffect.bind(_assertThisInitialized(_this));
    _this.mouseEnterEffect = _this.mouseEnterEffect.bind(_assertThisInitialized(_this));
    _this.mouseLeaveEffect = _this.mouseLeaveEffect.bind(_assertThisInitialized(_this));
    _this.validate = _this.validate.bind(_assertThisInitialized(_this));
    _this.moveIsAllowed = _this.moveIsAllowed.bind(_assertThisInitialized(_this));
    _this.effectDisabledState = _this.effectDisabledState.bind(_assertThisInitialized(_this));
    _this.updatePocketState = _this.updatePocketState.bind(_assertThisInitialized(_this));
    _this.subscribeTopPocketToResize = _this.subscribeTopPocketToResize.bind(_assertThisInitialized(_this));
    _this.subscribeBottomPocketToResize = _this.subscribeBottomPocketToResize.bind(_assertThisInitialized(_this));
    _this.subscribeContainerToResize = _this.subscribeContainerToResize.bind(_assertThisInitialized(_this));
    _this.subscribeToResizeContent = _this.subscribeToResizeContent.bind(_assertThisInitialized(_this));
    _this.updateDimensions = _this.updateDimensions.bind(_assertThisInitialized(_this));
    _this.triggerScrollEvent = _this.triggerScrollEvent.bind(_assertThisInitialized(_this));
    _this.resetInactiveOffsetToInitial = _this.resetInactiveOffsetToInitial.bind(_assertThisInitialized(_this));
    _this.scrollByLocation = _this.scrollByLocation.bind(_assertThisInitialized(_this));
    _this.handleScroll = _this.handleScroll.bind(_assertThisInitialized(_this));
    _this.syncScrollbarsWithContent = _this.syncScrollbarsWithContent.bind(_assertThisInitialized(_this));
    _this.startLoading = _this.startLoading.bind(_assertThisInitialized(_this));
    _this.finishLoading = _this.finishLoading.bind(_assertThisInitialized(_this));
    _this.getEventArgs = _this.getEventArgs.bind(_assertThisInitialized(_this));
    _this.getInitEventData = _this.getInitEventData.bind(_assertThisInitialized(_this));
    _this.onStart = _this.onStart.bind(_assertThisInitialized(_this));
    _this.onEnd = _this.onEnd.bind(_assertThisInitialized(_this));
    _this.restoreEndActionDirections = _this.restoreEndActionDirections.bind(_assertThisInitialized(_this));
    _this.onUpdated = _this.onUpdated.bind(_assertThisInitialized(_this));
    _this.onBounce = _this.onBounce.bind(_assertThisInitialized(_this));
    _this.onPullDown = _this.onPullDown.bind(_assertThisInitialized(_this));
    _this.onRelease = _this.onRelease.bind(_assertThisInitialized(_this));
    _this.onReachBottom = _this.onReachBottom.bind(_assertThisInitialized(_this));
    _this.scrollLocationChange = _this.scrollLocationChange.bind(_assertThisInitialized(_this));
    _this.onScroll = _this.onScroll.bind(_assertThisInitialized(_this));
    _this.handleInit = _this.handleInit.bind(_assertThisInitialized(_this));
    _this.handleStart = _this.handleStart.bind(_assertThisInitialized(_this));
    _this.handleMove = _this.handleMove.bind(_assertThisInitialized(_this));
    _this.handleEnd = _this.handleEnd.bind(_assertThisInitialized(_this));
    _this.handleStop = _this.handleStop.bind(_assertThisInitialized(_this));
    _this.handleCancel = _this.handleCancel.bind(_assertThisInitialized(_this));
    _this.isCrossThumbScrolling = _this.isCrossThumbScrolling.bind(_assertThisInitialized(_this));
    _this.adjustDistance = _this.adjustDistance.bind(_assertThisInitialized(_this));
    _this.suppressDirections = _this.suppressDirections.bind(_assertThisInitialized(_this));
    _this.validateEvent = _this.validateEvent.bind(_assertThisInitialized(_this));
    _this.prepareDirections = _this.prepareDirections.bind(_assertThisInitialized(_this));
    _this.isContent = _this.isContent.bind(_assertThisInitialized(_this));
    _this.tryGetAllowedDirection = _this.tryGetAllowedDirection.bind(_assertThisInitialized(_this));
    _this.isLocked = _this.isLocked.bind(_assertThisInitialized(_this));
    _this.validateWheel = _this.validateWheel.bind(_assertThisInitialized(_this));
    _this.clearWheelValidationTimer = _this.clearWheelValidationTimer.bind(_assertThisInitialized(_this));
    _this.validateMove = _this.validateMove.bind(_assertThisInitialized(_this));
    _this.handleKeyDown = _this.handleKeyDown.bind(_assertThisInitialized(_this));
    _this.scrollByLine = _this.scrollByLine.bind(_assertThisInitialized(_this));
    _this.scrollByPage = _this.scrollByPage.bind(_assertThisInitialized(_this));
    _this.scrollByKey = _this.scrollByKey.bind(_assertThisInitialized(_this));
    _this.lock = _this.lock.bind(_assertThisInitialized(_this));
    _this.unlock = _this.unlock.bind(_assertThisInitialized(_this));
    _this.onVisibilityChangeHandler = _this.onVisibilityChangeHandler.bind(_assertThisInitialized(_this));
    _this.updateElementDimensions = _this.updateElementDimensions.bind(_assertThisInitialized(_this));
    _this.setTopPocketDimensions = _this.setTopPocketDimensions.bind(_assertThisInitialized(_this));
    _this.setBottomPocketDimensions = _this.setBottomPocketDimensions.bind(_assertThisInitialized(_this));
    _this.setContentHeight = _this.setContentHeight.bind(_assertThisInitialized(_this));
    _this.setContentWidth = _this.setContentWidth.bind(_assertThisInitialized(_this));
    _this.setContainerDimensions = _this.setContainerDimensions.bind(_assertThisInitialized(_this));
    return _this;
  }
  var _proto = ScrollableSimulated.prototype;
  _proto.createEffects = function createEffects() {
    return [new _inferno2.InfernoEffect(this.disposeWheelTimer, []), new _inferno2.InfernoEffect(this.scrollEffect, [this.state.scrolling, this.props.rtlEnabled, this.props.onScroll, this.state.contentClientHeight, this.state.contentScrollHeight, this.state.containerClientHeight, this.state.contentClientWidth, this.state.contentScrollWidth, this.state.containerClientWidth, this.props.direction, this.state.topPocketHeight]), new _inferno2.InfernoEffect(this.startEffect, [this.props.onStart, this.state.contentClientHeight, this.state.contentScrollHeight, this.state.containerClientHeight, this.state.contentClientWidth, this.state.contentScrollWidth, this.state.containerClientWidth, this.props.direction, this.state.topPocketHeight]), new _inferno2.InfernoEffect(this.initEffect, [this.props.direction, this.props.scrollByThumb, this.props.scrollByContent, this.props.bounceEnabled, this.state.contentClientHeight, this.state.contentScrollHeight, this.state.containerClientHeight, this.state.contentClientWidth, this.state.contentScrollWidth, this.state.containerClientWidth, this.props.disabled]), new _inferno2.InfernoEffect(this.moveEffect, []), new _inferno2.InfernoEffect(this.endEffect, []), new _inferno2.InfernoEffect(this.stopEffect, []), new _inferno2.InfernoEffect(this.cancelEffect, []), new _inferno2.InfernoEffect(this.pointerDownEffect, []), new _inferno2.InfernoEffect(this.pointerUpEffect, []), new _inferno2.InfernoEffect(this.mouseEnterEffect, [this.props.disabled, this.props.showScrollbar]), new _inferno2.InfernoEffect(this.mouseLeaveEffect, [this.props.disabled, this.props.showScrollbar]), new _inferno2.InfernoEffect(this.effectDisabledState, [this.props.disabled]), new _inferno2.InfernoEffect(this.updatePocketState, [this.props.forceGeneratePockets, this.props.pullDownEnabled, this.props.bounceEnabled, this.state.topPocketHeight, this.state.vScrollLocation]), new _inferno2.InfernoEffect(this.subscribeTopPocketToResize, []), new _inferno2.InfernoEffect(this.subscribeBottomPocketToResize, []), new _inferno2.InfernoEffect(this.subscribeContainerToResize, []), new _inferno2.InfernoEffect(this.subscribeToResizeContent, []), new _inferno2.InfernoEffect(this.updateDimensions, []), new _inferno2.InfernoEffect(this.triggerScrollEvent, [this.state.pendingScrollEvent]), new _inferno2.InfernoEffect(this.resetInactiveOffsetToInitial, [this.props.direction, this.props.rtlEnabled])];
  };
  _proto.updateEffects = function updateEffects() {
    var _this$_effects$, _this$_effects$2, _this$_effects$3, _this$_effects$4, _this$_effects$5, _this$_effects$6, _this$_effects$7, _this$_effects$8, _this$_effects$9, _this$_effects$10, _this$_effects$11, _this$_effects$12, _this$_effects$13;
    (_this$_effects$ = this._effects[1]) === null || _this$_effects$ === void 0 ? void 0 : _this$_effects$.update([this.state.scrolling, this.props.rtlEnabled, this.props.onScroll, this.state.contentClientHeight, this.state.contentScrollHeight, this.state.containerClientHeight, this.state.contentClientWidth, this.state.contentScrollWidth, this.state.containerClientWidth, this.props.direction, this.state.topPocketHeight]);
    (_this$_effects$2 = this._effects[2]) === null || _this$_effects$2 === void 0 ? void 0 : _this$_effects$2.update([this.props.onStart, this.state.contentClientHeight, this.state.contentScrollHeight, this.state.containerClientHeight, this.state.contentClientWidth, this.state.contentScrollWidth, this.state.containerClientWidth, this.props.direction, this.state.topPocketHeight]);
    (_this$_effects$3 = this._effects[3]) === null || _this$_effects$3 === void 0 ? void 0 : _this$_effects$3.update([this.props.direction, this.props.scrollByThumb, this.props.scrollByContent, this.props.bounceEnabled, this.state.contentClientHeight, this.state.contentScrollHeight, this.state.containerClientHeight, this.state.contentClientWidth, this.state.contentScrollWidth, this.state.containerClientWidth, this.props.disabled]);
    (_this$_effects$4 = this._effects[4]) === null || _this$_effects$4 === void 0 ? void 0 : _this$_effects$4.update([]);
    (_this$_effects$5 = this._effects[5]) === null || _this$_effects$5 === void 0 ? void 0 : _this$_effects$5.update([]);
    (_this$_effects$6 = this._effects[6]) === null || _this$_effects$6 === void 0 ? void 0 : _this$_effects$6.update([]);
    (_this$_effects$7 = this._effects[7]) === null || _this$_effects$7 === void 0 ? void 0 : _this$_effects$7.update([]);
    (_this$_effects$8 = this._effects[10]) === null || _this$_effects$8 === void 0 ? void 0 : _this$_effects$8.update([this.props.disabled, this.props.showScrollbar]);
    (_this$_effects$9 = this._effects[11]) === null || _this$_effects$9 === void 0 ? void 0 : _this$_effects$9.update([this.props.disabled, this.props.showScrollbar]);
    (_this$_effects$10 = this._effects[12]) === null || _this$_effects$10 === void 0 ? void 0 : _this$_effects$10.update([this.props.disabled]);
    (_this$_effects$11 = this._effects[13]) === null || _this$_effects$11 === void 0 ? void 0 : _this$_effects$11.update([this.props.forceGeneratePockets, this.props.pullDownEnabled, this.props.bounceEnabled, this.state.topPocketHeight, this.state.vScrollLocation]);
    (_this$_effects$12 = this._effects[19]) === null || _this$_effects$12 === void 0 ? void 0 : _this$_effects$12.update([this.state.pendingScrollEvent]);
    (_this$_effects$13 = this._effects[20]) === null || _this$_effects$13 === void 0 ? void 0 : _this$_effects$13.update([this.props.direction, this.props.rtlEnabled]);
  };
  _proto.disposeWheelTimer = function disposeWheelTimer() {
    return () => this.clearWheelValidationTimer();
  };
  _proto.scrollEffect = function scrollEffect() {
    return (0, _subscribe_to_event.subscribeToScrollEvent)(this.containerRef.current, () => {
      this.handleScroll();
    });
  };
  _proto.startEffect = function startEffect() {
    return (0, _subscribe_to_event.subscribeToDXScrollStartEvent)(this.wrapperRef.current, event => {
      this.handleStart(event);
    });
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
    return (0, _subscribe_to_event.subscribeToDXScrollEndEvent)(this.wrapperRef.current, event => {
      this.handleEnd(event);
    });
  };
  _proto.stopEffect = function stopEffect() {
    return (0, _subscribe_to_event.subscribeToDXScrollStopEvent)(this.wrapperRef.current, () => {
      this.handleStop();
    });
  };
  _proto.cancelEffect = function cancelEffect() {
    return (0, _subscribe_to_event.subscribeToDXScrollCancelEvent)(this.wrapperRef.current, event => {
      this.handleCancel(event);
    });
  };
  _proto.pointerDownEffect = function pointerDownEffect() {
    return (0, _subscribe_to_event.subscribeToDXPointerDownEvent)(this.wrapperRef.current, () => {
      this.setState(__state_argument => ({
        active: true
      }));
    });
  };
  _proto.pointerUpEffect = function pointerUpEffect() {
    return (0, _subscribe_to_event.subscribeToDXPointerUpEvent)(_dom_adapter.default.getDocument(), () => {
      this.setState(__state_argument => ({
        active: false
      }));
    });
  };
  _proto.mouseEnterEffect = function mouseEnterEffect() {
    if (this.isHoverable) {
      return (0, _subscribe_to_event.subscribeToMouseEnterEvent)(this.scrollableRef.current, () => {
        this.setState(__state_argument => ({
          hovered: true
        }));
      });
    }
    return undefined;
  };
  _proto.mouseLeaveEffect = function mouseLeaveEffect() {
    if (this.isHoverable) {
      return (0, _subscribe_to_event.subscribeToMouseLeaveEvent)(this.scrollableRef.current, () => {
        this.setState(__state_argument => ({
          hovered: false
        }));
      });
    }
    return undefined;
  };
  _proto.effectDisabledState = function effectDisabledState() {
    if (this.props.disabled) {
      this.lock();
    } else {
      this.unlock();
    }
  };
  _proto.updatePocketState = function updatePocketState() {
    if (this.props.forceGeneratePockets) {
      this.setState(__state_argument => ({
        topPocketState: this.pulledDown ? _consts.TopPocketState.STATE_READY : _consts.TopPocketState.STATE_RELEASED
      }));
    }
  };
  _proto.subscribeTopPocketToResize = function subscribeTopPocketToResize() {
    var _this$topPocketRef;
    return (0, _subscribe_to_resize.subscribeToResize)((_this$topPocketRef = this.topPocketRef) === null || _this$topPocketRef === void 0 ? void 0 : _this$topPocketRef.current, element => {
      this.setTopPocketDimensions(element);
    });
  };
  _proto.subscribeBottomPocketToResize = function subscribeBottomPocketToResize() {
    var _this$bottomPocketRef;
    return (0, _subscribe_to_resize.subscribeToResize)((_this$bottomPocketRef = this.bottomPocketRef) === null || _this$bottomPocketRef === void 0 ? void 0 : _this$bottomPocketRef.current, element => {
      this.setBottomPocketDimensions(element);
    });
  };
  _proto.subscribeContainerToResize = function subscribeContainerToResize() {
    return (0, _subscribe_to_resize.subscribeToResize)(this.containerRef.current, element => {
      this.setContainerDimensions(element);
    });
  };
  _proto.subscribeToResizeContent = function subscribeToResizeContent() {
    if (this.props.needScrollViewContentWrapper) {
      const unsubscribeHeightResize = (0, _subscribe_to_resize.subscribeToResize)(this.content(), element => {
        this.setContentHeight(element);
      });
      const unsubscribeWidthResize = (0, _subscribe_to_resize.subscribeToResize)(this.contentRef.current, element => {
        this.setContentWidth(element);
      });
      return () => {
        unsubscribeHeightResize === null || unsubscribeHeightResize === void 0 ? void 0 : unsubscribeHeightResize();
        unsubscribeWidthResize === null || unsubscribeWidthResize === void 0 ? void 0 : unsubscribeWidthResize();
      };
    }
    return (0, _subscribe_to_resize.subscribeToResize)(this.contentRef.current, element => {
      this.setContentHeight(element);
      this.setContentWidth(element);
    });
  };
  _proto.updateDimensions = function updateDimensions() {
    this.updateElementDimensions();
  };
  _proto.triggerScrollEvent = function triggerScrollEvent() {
    if (this.state.pendingScrollEvent) {
      this.setState(__state_argument => ({
        pendingScrollEvent: false
      }));
      _events_engine.default.triggerHandler(this.containerRef.current, {
        type: 'scroll'
      });
    }
  };
  _proto.resetInactiveOffsetToInitial = function resetInactiveOffsetToInitial() {
    if (this.direction.isBoth) {
      this.prevDirection = this.props.direction;
      return;
    }
    const maxScrollOffset = (0, _get_scroll_left_max.getScrollLeftMax)(this.containerRef.current);
    const needResetInactiveOffset = this.prevDirection !== this.props.direction && maxScrollOffset;
    if (!needResetInactiveOffset) {
      return;
    }
    this.prevDirection = this.props.direction;
    const inactiveScrollProp = !this.direction.isVertical ? 'scrollTop' : 'scrollLeft';
    const location = this.props.rtlEnabled && inactiveScrollProp === 'scrollLeft' ? maxScrollOffset : 0;
    this.scrollLocationChange({
      fullScrollProp: inactiveScrollProp,
      location
    });
  };
  _proto.handleScroll = function handleScroll() {
    var _this$props$onScroll, _this$props;
    if (!this.state.scrolling) {
      this.syncScrollbarsWithContent();
    }
    (_this$props$onScroll = (_this$props = this.props).onScroll) === null || _this$props$onScroll === void 0 ? void 0 : _this$props$onScroll.call(_this$props, this.getEventArgs());
  };
  _proto.syncScrollbarsWithContent = function syncScrollbarsWithContent() {
    var _this$vScrollbarRef$c;
    const {
      scrollLeft,
      scrollTop
    } = this.containerRef.current;
    (_this$vScrollbarRef$c = this.vScrollbarRef.current) === null || _this$vScrollbarRef$c === void 0 ? void 0 : _this$vScrollbarRef$c.scrollTo(scrollTop, false);
    if (!this.props.rtlEnabled) {
      var _this$hScrollbarRef$c;
      (_this$hScrollbarRef$c = this.hScrollbarRef.current) === null || _this$hScrollbarRef$c === void 0 ? void 0 : _this$hScrollbarRef$c.scrollTo(scrollLeft, false);
    }
  };
  _proto.startLoading = function startLoading() {
    if (this.loadingIndicatorEnabled && (0, _is_element_visible.isElementVisible)(this.containerRef.current)) {
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
  _proto.getEventArgs = function getEventArgs() {
    const scrollOffset = this.scrollOffset();
    return _extends({
      event: this.eventForUserAction,
      scrollOffset
    }, (0, _get_boundary_props.getBoundaryProps)(this.props.direction, scrollOffset, this.containerRef.current, this.state.topPocketHeight));
  };
  _proto.getInitEventData = function getInitEventData() {
    return {
      getDirection: event => this.tryGetAllowedDirection(event),
      validate: event => this.validate(event),
      isNative: false,
      scrollTarget: this.containerRef.current
    };
  };
  _proto.onStart = function onStart() {
    var _this$props$onStart, _this$props2;
    (_this$props$onStart = (_this$props2 = this.props).onStart) === null || _this$props$onStart === void 0 ? void 0 : _this$props$onStart.call(_this$props2, this.getEventArgs());
  };
  _proto.onEnd = function onEnd(direction) {
    if (this.direction.isBoth) {
      this.endActionDirections[direction] = true;
      const {
        horizontal,
        vertical
      } = this.endActionDirections;
      if (horizontal && vertical) {
        var _this$props$onEnd, _this$props3;
        this.restoreEndActionDirections();
        this.setState(__state_argument => ({
          scrolling: false
        }));
        (_this$props$onEnd = (_this$props3 = this.props).onEnd) === null || _this$props$onEnd === void 0 ? void 0 : _this$props$onEnd.call(_this$props3, this.getEventArgs());
      }
    } else {
      var _this$props$onEnd2, _this$props4;
      this.setState(__state_argument => ({
        scrolling: false
      }));
      (_this$props$onEnd2 = (_this$props4 = this.props).onEnd) === null || _this$props$onEnd2 === void 0 ? void 0 : _this$props$onEnd2.call(_this$props4, this.getEventArgs());
    }
  };
  _proto.restoreEndActionDirections = function restoreEndActionDirections() {
    this.endActionDirections[_consts.DIRECTION_HORIZONTAL] = false;
    this.endActionDirections[_consts.DIRECTION_VERTICAL] = false;
  };
  _proto.onUpdated = function onUpdated() {
    var _this$props$onUpdated, _this$props5;
    (_this$props$onUpdated = (_this$props5 = this.props).onUpdated) === null || _this$props$onUpdated === void 0 ? void 0 : _this$props$onUpdated.call(_this$props5, this.getEventArgs());
  };
  _proto.onBounce = function onBounce() {
    var _this$props$onBounce, _this$props6;
    (_this$props$onBounce = (_this$props6 = this.props).onBounce) === null || _this$props$onBounce === void 0 ? void 0 : _this$props$onBounce.call(_this$props6, this.getEventArgs());
  };
  _proto.onPullDown = function onPullDown() {
    var _this$props$onPullDow, _this$props7;
    this.setState(__state_argument => ({
      topPocketState: _consts.TopPocketState.STATE_REFRESHING
    }));
    this.loadingIndicatorEnabled = false;
    this.startLoading();
    (_this$props$onPullDow = (_this$props7 = this.props).onPullDown) === null || _this$props$onPullDow === void 0 ? void 0 : _this$props$onPullDow.call(_this$props7, {});
  };
  _proto.onRelease = function onRelease() {
    this.setState(__state_argument => ({
      topPocketState: _consts.TopPocketState.STATE_RELEASED
    }));
    this.loadingIndicatorEnabled = true;
    this.finishLoading();
    this.updateElementDimensions();
  };
  _proto.onReachBottom = function onReachBottom() {
    var _this$props$onReachBo, _this$props8;
    this.loadingIndicatorEnabled = false;
    this.startLoading();
    (_this$props$onReachBo = (_this$props8 = this.props).onReachBottom) === null || _this$props$onReachBo === void 0 ? void 0 : _this$props$onReachBo.call(_this$props8, {});
  };
  _proto.scrollLocationChange = function scrollLocationChange(eventData) {
    if (!(0, _is_element_visible.isElementVisible)(this.containerRef.current)) {
      return;
    }
    const {
      fullScrollProp,
      location
    } = eventData;
    this.containerRef.current[fullScrollProp] = location;
    if (fullScrollProp === 'scrollLeft') {
      this.setState(__state_argument => ({
        hScrollLocation: -location
      }));
    } else {
      this.setState(__state_argument => ({
        vScrollLocation: -location
      }));
    }
    this.savedScrollOffset[fullScrollProp] = location;
  };
  _proto.onScroll = function onScroll() {
    this.setState(__state_argument => ({
      pendingScrollEvent: true
    }));
  };
  _proto.handleInit = function handleInit(event) {
    var _this$hScrollbarRef$c2, _this$vScrollbarRef$c2;
    this.suppressDirections(event);
    this.restoreEndActionDirections();
    this.eventForUserAction = event;
    const crossThumbScrolling = this.isCrossThumbScrolling(event);
    const {
      left,
      top
    } = (0, _get_element_offset.getElementOffset)(this.scrollableRef.current);
    (_this$hScrollbarRef$c2 = this.hScrollbarRef.current) === null || _this$hScrollbarRef$c2 === void 0 ? void 0 : _this$hScrollbarRef$c2.initHandler(event, crossThumbScrolling, left);
    (_this$vScrollbarRef$c2 = this.vScrollbarRef.current) === null || _this$vScrollbarRef$c2 === void 0 ? void 0 : _this$vScrollbarRef$c2.initHandler(event, crossThumbScrolling, top);
  };
  _proto.handleStart = function handleStart(event) {
    this.setState(__state_argument => ({
      scrolling: true
    }));
    this.eventForUserAction = event;
    this.onStart();
  };
  _proto.handleMove = function handleMove(e) {
    var _e$preventDefault, _this$hScrollbarRef$c3, _this$vScrollbarRef$c3;
    if (this.isLocked()) {
      e.cancel = true;
      return;
    }
    (_e$preventDefault = e.preventDefault) === null || _e$preventDefault === void 0 ? void 0 : _e$preventDefault.call(e);
    this.adjustDistance(e, 'delta');
    this.eventForUserAction = e;
    const isDxMouseWheel = (0, _index.isDxMouseWheelEvent)(e.originalEvent);
    (_this$hScrollbarRef$c3 = this.hScrollbarRef.current) === null || _this$hScrollbarRef$c3 === void 0 ? void 0 : _this$hScrollbarRef$c3.moveHandler(e.delta.x, isDxMouseWheel);
    (_this$vScrollbarRef$c3 = this.vScrollbarRef.current) === null || _this$vScrollbarRef$c3 === void 0 ? void 0 : _this$vScrollbarRef$c3.moveHandler(e.delta.y, isDxMouseWheel);
  };
  _proto.handleEnd = function handleEnd(event) {
    var _this$hScrollbarRef$c4, _this$vScrollbarRef$c4;
    this.adjustDistance(event, 'velocity');
    this.eventForUserAction = event;
    (_this$hScrollbarRef$c4 = this.hScrollbarRef.current) === null || _this$hScrollbarRef$c4 === void 0 ? void 0 : _this$hScrollbarRef$c4.endHandler(event.velocity.x, true);
    (_this$vScrollbarRef$c4 = this.vScrollbarRef.current) === null || _this$vScrollbarRef$c4 === void 0 ? void 0 : _this$vScrollbarRef$c4.endHandler(event.velocity.y, true);
  };
  _proto.handleStop = function handleStop() {
    var _this$hScrollbarRef$c5, _this$vScrollbarRef$c5;
    (_this$hScrollbarRef$c5 = this.hScrollbarRef.current) === null || _this$hScrollbarRef$c5 === void 0 ? void 0 : _this$hScrollbarRef$c5.stopHandler();
    (_this$vScrollbarRef$c5 = this.vScrollbarRef.current) === null || _this$vScrollbarRef$c5 === void 0 ? void 0 : _this$vScrollbarRef$c5.stopHandler();
  };
  _proto.handleCancel = function handleCancel(event) {
    var _this$hScrollbarRef$c6, _this$vScrollbarRef$c6;
    this.eventForUserAction = event;
    (_this$hScrollbarRef$c6 = this.hScrollbarRef.current) === null || _this$hScrollbarRef$c6 === void 0 ? void 0 : _this$hScrollbarRef$c6.endHandler(0, false);
    (_this$vScrollbarRef$c6 = this.vScrollbarRef.current) === null || _this$vScrollbarRef$c6 === void 0 ? void 0 : _this$vScrollbarRef$c6.endHandler(0, false);
  };
  _proto.isCrossThumbScrolling = function isCrossThumbScrolling(event) {
    const {
      target
    } = event.originalEvent;
    let verticalScrolling = false;
    let horizontalScrolling = false;
    if (this.direction.isVertical) {
      verticalScrolling = this.props.scrollByThumb && this.vScrollbarRef.current.isThumb(target);
    }
    if (this.direction.isHorizontal) {
      horizontalScrolling = this.props.scrollByThumb && this.hScrollbarRef.current.isThumb(target);
    }
    return verticalScrolling || horizontalScrolling;
  };
  _proto.adjustDistance = function adjustDistance(event, property) {
    const distance = event[property];
    distance.x *= this.validDirections[_consts.DIRECTION_HORIZONTAL] ? 1 : 0;
    distance.y *= this.validDirections[_consts.DIRECTION_VERTICAL] ? 1 : 0;
    if ((0, _index.isDxMouseWheelEvent)(event.originalEvent)) {
      const devicePixelRatio = (0, _get_device_pixel_ratio.getDevicePixelRatio)();
      distance.x = Math.round(distance.x / devicePixelRatio * 100) / 100;
      distance.y = Math.round(distance.y / devicePixelRatio * 100) / 100;
    }
  };
  _proto.suppressDirections = function suppressDirections(event) {
    if ((0, _index.isDxMouseWheelEvent)(event.originalEvent)) {
      this.prepareDirections(true);
      return;
    }
    this.prepareDirections(false);
    const {
      target
    } = event.originalEvent;
    if (this.direction.isVertical) {
      const scrollbar = this.vScrollbarRef.current;
      this.validDirections[_consts.DIRECTION_VERTICAL] = this.validateEvent(this.isContent(target), scrollbar.isScrollbar(target), scrollbar.isThumb(target));
    }
    if (this.direction.isHorizontal) {
      const scrollbar = this.hScrollbarRef.current;
      this.validDirections[_consts.DIRECTION_HORIZONTAL] = this.validateEvent(this.isContent(target), scrollbar.isScrollbar(target), scrollbar.isThumb(target));
    }
  };
  _proto.validateEvent = function validateEvent(isContent, isScrollbar, isThumb) {
    return this.props.scrollByThumb && (isScrollbar || isThumb) || this.props.scrollByContent && isContent;
  };
  _proto.prepareDirections = function prepareDirections(value) {
    this.validDirections[_consts.DIRECTION_HORIZONTAL] = value;
    this.validDirections[_consts.DIRECTION_VERTICAL] = value;
  };
  _proto.isContent = function isContent(element) {
    const closest = element.closest(".".concat(_consts.SCROLLABLE_SIMULATED_CLASS));
    if ((0, _type.isDefined)(closest)) {
      return closest === this.scrollableRef.current;
    }
    return false;
  };
  _proto.tryGetAllowedDirection = function tryGetAllowedDirection(event) {
    return (0, _index.isDxMouseWheelEvent)(event) ? (0, _get_permissible_wheel_direction.permissibleWheelDirection)(this.props.direction, event.shiftKey) : this.permissibleDirection;
  };
  _proto.isLocked = function isLocked() {
    return this.locked;
  };
  _proto.validateWheel = function validateWheel(event) {
    const scrollbar = (0, _get_permissible_wheel_direction.permissibleWheelDirection)(this.props.direction, event.shiftKey) === _consts.DIRECTION_HORIZONTAL ? this.hScrollbarRef.current : this.vScrollbarRef.current;
    const reachedMin = scrollbar.reachedMin();
    const reachedMax = scrollbar.reachedMax();
    const contentGreaterThanContainer = !reachedMin || !reachedMax;
    const locatedNotAtBound = !reachedMin && !reachedMax;
    const scrollFromMin = reachedMin && event.delta > 0;
    const scrollFromMax = reachedMax && event.delta < 0;
    let validated = contentGreaterThanContainer && (locatedNotAtBound || scrollFromMin || scrollFromMax);
    validated = validated || this.validateWheelTimer !== undefined;
    if (validated) {
      this.clearWheelValidationTimer();
      this.validateWheelTimer = setTimeout(this.clearWheelValidationTimer, _consts.VALIDATE_WHEEL_TIMEOUT);
    }
    return validated;
  };
  _proto.clearWheelValidationTimer = function clearWheelValidationTimer() {
    clearTimeout(this.validateWheelTimer);
    this.validateWheelTimer = undefined;
  };
  _proto.validateMove = function validateMove(event) {
    if (!this.props.scrollByContent && !(0, _type.isDefined)(event.target.closest(".".concat(_consts.SCROLLABLE_SCROLLBAR_CLASS)))) {
      return false;
    }
    return (0, _type.isDefined)(this.permissibleDirection);
  };
  _proto.handleKeyDown = function handleKeyDown(event) {
    if (this.state.scrolling) {
      event.originalEvent.stopPropagation();
      event.originalEvent.preventDefault();
      return;
    }
    const isKeySupported = Object.values(_consts.KEY_CODES).includes((0, _index.normalizeKeyName)(event));
    if (isKeySupported) {
      event.originalEvent.stopPropagation();
      event.originalEvent.preventDefault();
    }
    switch ((0, _index.normalizeKeyName)(event)) {
      case _consts.KEY_CODES.DOWN:
        this.scrollByLine({
          top: 1,
          left: 0
        });
        break;
      case _consts.KEY_CODES.UP:
        this.scrollByLine({
          top: -1,
          left: 0
        });
        break;
      case _consts.KEY_CODES.RIGHT:
        this.scrollByLine({
          top: 0,
          left: 1
        });
        break;
      case _consts.KEY_CODES.LEFT:
        this.scrollByLine({
          top: 0,
          left: -1
        });
        break;
      case _consts.KEY_CODES.PAGE_DOWN:
        this.scrollByPage(1);
        break;
      case _consts.KEY_CODES.PAGE_UP:
        this.scrollByPage(-1);
        break;
      case _consts.KEY_CODES.HOME:
        this.scrollByKey(_consts.KEY_CODES.HOME);
        break;
      case _consts.KEY_CODES.END:
        this.scrollByKey(_consts.KEY_CODES.END);
        break;
      default:
        break;
    }
  };
  _proto.scrollByLine = function scrollByLine(lines) {
    const scrollOffset = Math.abs(_consts.SCROLL_LINE_HEIGHT / (0, _get_device_pixel_ratio.getDevicePixelRatio)() * 100) / 100;
    this.scrollByLocation({
      top: lines.top * scrollOffset,
      left: lines.left * scrollOffset
    });
  };
  _proto.scrollByPage = function scrollByPage(page) {
    const distance = {
      left: 0,
      top: 0
    };
    const {
      clientHeight,
      clientWidth
    } = this.containerRef.current;
    if ((0, _get_permissible_wheel_direction.permissibleWheelDirection)(this.props.direction, false) === _consts.DIRECTION_VERTICAL) {
      distance.top = page * clientHeight;
    } else {
      distance.left = page * clientWidth;
    }
    this.scrollByLocation(distance);
  };
  _proto.scrollByKey = function scrollByKey(key) {
    const {
      scrollLeft,
      scrollTop
    } = this.containerRef.current;
    const vOffsetMin = 0;
    const hOffsetMin = 0;
    const vOffsetMax = -this.vScrollOffsetMax + this.state.bottomPocketHeight + this.state.contentPaddingBottom;
    const hOffsetMax = -this.hScrollOffsetMax;
    const offset = (0, _get_offset_distance.getOffsetDistance)(key === _consts.KEY_CODES.HOME ? {
      top: vOffsetMin,
      left: this.props.rtlEnabled ? hOffsetMax : hOffsetMin
    } : {
      top: vOffsetMax,
      left: this.props.rtlEnabled ? hOffsetMin : hOffsetMax
    }, {
      top: scrollTop,
      left: scrollLeft
    });
    const direction = (0, _get_permissible_wheel_direction.permissibleWheelDirection)(this.props.direction, false);
    this.scrollByLocation(direction === _consts.DIRECTION_VERTICAL ? {
      top: offset.top,
      left: 0
    } : {
      top: 0,
      left: offset.left
    });
  };
  _proto.lock = function lock() {
    this.locked = true;
  };
  _proto.unlock = function unlock() {
    if (!this.props.disabled) {
      this.locked = false;
    }
  };
  _proto.onVisibilityChangeHandler = function onVisibilityChangeHandler(visible) {
    var _this$props$onVisibil, _this$props9;
    if (visible) {
      var _this$vScrollbarRef$c7, _this$hScrollbarRef$c7;
      const {
        scrollLeft,
        scrollTop
      } = this.savedScrollOffset;
      (_this$vScrollbarRef$c7 = this.vScrollbarRef.current) === null || _this$vScrollbarRef$c7 === void 0 ? void 0 : _this$vScrollbarRef$c7.scrollTo(scrollTop, false);
      (_this$hScrollbarRef$c7 = this.hScrollbarRef.current) === null || _this$hScrollbarRef$c7 === void 0 ? void 0 : _this$hScrollbarRef$c7.scrollTo(scrollLeft, false);
    }
    (_this$props$onVisibil = (_this$props9 = this.props).onVisibilityChange) === null || _this$props$onVisibil === void 0 ? void 0 : _this$props$onVisibil.call(_this$props9, visible);
  };
  _proto.updateElementDimensions = function updateElementDimensions() {
    if (this.props.forceGeneratePockets) {
      this.setTopPocketDimensions(this.topPocketRef.current);
      this.setBottomPocketDimensions(this.bottomPocketRef.current);
    }
    this.setContentWidth(this.contentRef.current);
    this.setContentHeight(this.content());
    this.setContainerDimensions(this.containerRef.current);
  };
  _proto.setTopPocketDimensions = function setTopPocketDimensions(topPocketEl) {
    this.setState(__state_argument => ({
      topPocketHeight: this.props.forceGeneratePockets && this.props.pullDownEnabled ? topPocketEl.clientHeight : 0
    }));
  };
  _proto.setBottomPocketDimensions = function setBottomPocketDimensions(bottomPocketEl) {
    this.setState(__state_argument => ({
      bottomPocketHeight: this.props.forceGeneratePockets && this.props.reachBottomEnabled ? bottomPocketEl.clientHeight : 0
    }));
  };
  _proto.setContentHeight = function setContentHeight(contentEl) {
    if ((0, _is_element_visible.isElementVisible)(contentEl)) {
      this.setState(__state_argument => ({
        contentClientHeight: contentEl.clientHeight
      }));
      this.setState(__state_argument => ({
        contentScrollHeight: contentEl.scrollHeight
      }));
      this.setState(__state_argument => ({
        contentPaddingBottom: (0, _get_element_style.getElementPadding)(this.contentRef.current, 'bottom')
      }));
    }
  };
  _proto.setContentWidth = function setContentWidth(contentEl) {
    if ((0, _is_element_visible.isElementVisible)(contentEl)) {
      this.setState(__state_argument => ({
        contentClientWidth: contentEl.clientWidth
      }));
      this.setState(__state_argument => ({
        contentScrollWidth: contentEl.scrollWidth
      }));
    }
  };
  _proto.setContainerDimensions = function setContainerDimensions(containerEl) {
    if ((0, _is_element_visible.isElementVisible)(containerEl)) {
      this.setState(__state_argument => ({
        containerClientHeight: containerEl.clientHeight
      }));
      this.setState(__state_argument => ({
        containerClientWidth: containerEl.clientWidth
      }));
    }
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
    var _this$props$onPullDow2, _this$props10;
    this.setState(__state_argument => ({
      topPocketState: _consts.TopPocketState.STATE_READY
    }));
    this.startLoading();
    (_this$props$onPullDow2 = (_this$props10 = this.props).onPullDown) === null || _this$props$onPullDow2 === void 0 ? void 0 : _this$props$onPullDow2.call(_this$props10, {});
  };
  _proto.release = function release() {
    var _this$hScrollbarRef$c8, _this$vScrollbarRef$c8;
    this.onRelease();
    (_this$hScrollbarRef$c8 = this.hScrollbarRef.current) === null || _this$hScrollbarRef$c8 === void 0 ? void 0 : _this$hScrollbarRef$c8.releaseHandler();
    (_this$vScrollbarRef$c8 = this.vScrollbarRef.current) === null || _this$vScrollbarRef$c8 === void 0 ? void 0 : _this$vScrollbarRef$c8.releaseHandler();
  };
  _proto.updateHandler = function updateHandler() {
    this.updateElementDimensions();
    this.onUpdated();
  };
  _proto.scrollHeight = function scrollHeight() {
    return this.content().offsetHeight;
  };
  _proto.scrollWidth = function scrollWidth() {
    return this.content().offsetWidth;
  };
  _proto.scrollOffset = function scrollOffset() {
    const {
      scrollLeft,
      scrollTop
    } = this.savedScrollOffset;
    return {
      top: this.vScrollOffsetMax === 0 ? 0 : scrollTop,
      left: this.hScrollOffsetMax === 0 ? 0 : scrollLeft
    };
  };
  _proto.scrollTop = function scrollTop() {
    return this.scrollOffset().top;
  };
  _proto.scrollLeft = function scrollLeft() {
    return this.scrollOffset().left;
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
    if (this.props.disabled || (0, _index.isDxMouseWheelEvent)(event) && (0, _index.isCommandKeyPressed)({
      ctrlKey: event.ctrlKey,
      metaKey: event.metaKey
    })) {
      return false;
    }
    if (this.props.bounceEnabled) {
      return true;
    }
    return (0, _index.isDxMouseWheelEvent)(event) ? this.validateWheel(event) : this.validateMove(event);
  };
  _proto.scrollByLocation = function scrollByLocation(location) {
    var _this$hScrollbarRef$c9, _this$vScrollbarRef$c9;
    this.updateHandler();
    this.setState(__state_argument => ({
      scrolling: true
    }));
    this.prepareDirections(true);
    this.onStart();
    const {
      scrollLeft,
      scrollTop
    } = this.containerRef.current;
    const {
      left,
      top
    } = location;
    (_this$hScrollbarRef$c9 = this.hScrollbarRef.current) === null || _this$hScrollbarRef$c9 === void 0 ? void 0 : _this$hScrollbarRef$c9.scrollTo(scrollLeft + left, true);
    (_this$vScrollbarRef$c9 = this.vScrollbarRef.current) === null || _this$vScrollbarRef$c9 === void 0 ? void 0 : _this$vScrollbarRef$c9.scrollTo(scrollTop + top, true);
    this.setState(__state_argument => ({
      scrolling: false
    }));
  };
  _proto.componentWillUpdate = function componentWillUpdate(nextProps, nextState, context) {
    _InfernoComponent.prototype.componentWillUpdate.call(this);
    if (this.state['hScrollLocation'] !== nextState['hScrollLocation'] || this.props['bounceEnabled'] !== nextProps['bounceEnabled'] || this.state['contentClientWidth'] !== nextState['contentClientWidth'] || this.state['contentScrollWidth'] !== nextState['contentScrollWidth'] || this.state['containerClientWidth'] !== nextState['containerClientWidth'] || this.state['vScrollLocation'] !== nextState['vScrollLocation'] || this.state['contentClientHeight'] !== nextState['contentClientHeight'] || this.state['contentScrollHeight'] !== nextState['contentScrollHeight'] || this.state['containerClientHeight'] !== nextState['containerClientHeight'] || this.state['bottomPocketHeight'] !== nextState['bottomPocketHeight'] || this.state['contentPaddingBottom'] !== nextState['contentPaddingBottom'] || this.state['topPocketHeight'] !== nextState['topPocketHeight']) {
      this.__getterCache['contentStyles'] = undefined;
    }
    if (this.props['bounceEnabled'] !== nextProps['bounceEnabled'] || this.props['direction'] !== nextProps['direction'] || this.state['contentClientHeight'] !== nextState['contentClientHeight'] || this.state['contentScrollHeight'] !== nextState['contentScrollHeight'] || this.state['containerClientHeight'] !== nextState['containerClientHeight'] || this.state['contentClientWidth'] !== nextState['contentClientWidth'] || this.state['contentScrollWidth'] !== nextState['contentScrollWidth'] || this.state['containerClientWidth'] !== nextState['containerClientWidth']) {
      this.__getterCache['containerStyles'] = undefined;
    }
    if (this.props['direction'] !== nextProps['direction']) {
      this.__getterCache['direction'] = undefined;
    }
  };
  _proto.render = function render() {
    const props = this.props;
    return viewFunction({
      props: _extends({}, props, {
        loadPanelTemplate: getTemplate(props.loadPanelTemplate)
      }),
      active: this.state.active,
      hovered: this.state.hovered,
      scrolling: this.state.scrolling,
      containerClientWidth: this.state.containerClientWidth,
      containerClientHeight: this.state.containerClientHeight,
      contentScrollWidth: this.state.contentScrollWidth,
      contentScrollHeight: this.state.contentScrollHeight,
      contentClientWidth: this.state.contentClientWidth,
      contentClientHeight: this.state.contentClientHeight,
      contentPaddingBottom: this.state.contentPaddingBottom,
      topPocketHeight: this.state.topPocketHeight,
      bottomPocketHeight: this.state.bottomPocketHeight,
      topPocketState: this.state.topPocketState,
      isLoadPanelVisible: this.state.isLoadPanelVisible,
      vScrollLocation: this.state.vScrollLocation,
      hScrollLocation: this.state.hScrollLocation,
      pendingScrollEvent: this.state.pendingScrollEvent,
      wrapperRef: this.wrapperRef,
      contentRef: this.contentRef,
      scrollViewContentRef: this.scrollViewContentRef,
      containerRef: this.containerRef,
      scrollableRef: this.scrollableRef,
      topPocketRef: this.topPocketRef,
      bottomPocketRef: this.bottomPocketRef,
      vScrollbarRef: this.vScrollbarRef,
      hScrollbarRef: this.hScrollbarRef,
      pulledDown: this.pulledDown,
      handleScroll: this.handleScroll,
      syncScrollbarsWithContent: this.syncScrollbarsWithContent,
      startLoading: this.startLoading,
      finishLoading: this.finishLoading,
      getEventArgs: this.getEventArgs,
      getInitEventData: this.getInitEventData,
      onStart: this.onStart,
      onEnd: this.onEnd,
      restoreEndActionDirections: this.restoreEndActionDirections,
      onUpdated: this.onUpdated,
      onBounce: this.onBounce,
      onPullDown: this.onPullDown,
      onRelease: this.onRelease,
      onReachBottom: this.onReachBottom,
      scrollLocationChange: this.scrollLocationChange,
      hScrollOffsetMax: this.hScrollOffsetMax,
      vScrollOffsetMax: this.vScrollOffsetMax,
      vScrollOffsetMin: this.vScrollOffsetMin,
      onScroll: this.onScroll,
      handleInit: this.handleInit,
      handleStart: this.handleStart,
      handleMove: this.handleMove,
      handleEnd: this.handleEnd,
      handleStop: this.handleStop,
      handleCancel: this.handleCancel,
      isCrossThumbScrolling: this.isCrossThumbScrolling,
      adjustDistance: this.adjustDistance,
      suppressDirections: this.suppressDirections,
      validateEvent: this.validateEvent,
      prepareDirections: this.prepareDirections,
      isContent: this.isContent,
      tryGetAllowedDirection: this.tryGetAllowedDirection,
      isLocked: this.isLocked,
      validateWheel: this.validateWheel,
      clearWheelValidationTimer: this.clearWheelValidationTimer,
      validateMove: this.validateMove,
      handleKeyDown: this.handleKeyDown,
      scrollByLine: this.scrollByLine,
      scrollByPage: this.scrollByPage,
      scrollByKey: this.scrollByKey,
      lock: this.lock,
      unlock: this.unlock,
      onVisibilityChangeHandler: this.onVisibilityChangeHandler,
      updateElementDimensions: this.updateElementDimensions,
      setTopPocketDimensions: this.setTopPocketDimensions,
      setBottomPocketDimensions: this.setBottomPocketDimensions,
      setContentHeight: this.setContentHeight,
      setContentWidth: this.setContentWidth,
      setContainerDimensions: this.setContainerDimensions,
      contentHeight: this.contentHeight,
      contentWidth: this.contentWidth,
      containerHasSizes: this.containerHasSizes,
      contentStyles: this.contentStyles,
      contentTranslateY: this.contentTranslateY,
      contentTranslateX: this.contentTranslateX,
      containerStyles: this.containerStyles,
      cssClasses: this.cssClasses,
      direction: this.direction,
      permissibleDirection: this.permissibleDirection,
      isHoverable: this.isHoverable,
      restAttributes: this.restAttributes
    });
  };
  _createClass(ScrollableSimulated, [{
    key: "pulledDown",
    get: function () {
      return this.props.pullDownEnabled && this.props.bounceEnabled && this.state.topPocketHeight > 0 && this.state.vScrollLocation - this.state.topPocketHeight >= 0;
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
    key: "vScrollOffsetMin",
    get: function () {
      return this.pulledDown && this.state.topPocketState !== _consts.TopPocketState.STATE_RELEASED ? this.state.topPocketHeight : 0;
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
    key: "containerHasSizes",
    get: function () {
      return this.state.containerClientHeight > 0 && this.state.containerClientWidth > 0;
    }
  }, {
    key: "contentStyles",
    get: function () {
      if (this.__getterCache['contentStyles'] !== undefined) {
        return this.__getterCache['contentStyles'];
      }
      return this.__getterCache['contentStyles'] = (() => {
        return {
          transform: "translate(".concat(this.contentTranslateX, "px, ").concat(this.contentTranslateY, "px)")
        };
      })();
    }
  }, {
    key: "contentTranslateY",
    get: function () {
      const location = this.state.vScrollLocation;
      let transformValue = location % 1;
      const maxOffset = this.vScrollOffsetMax - this.state.bottomPocketHeight - this.state.contentPaddingBottom;
      if (maxOffset >= 0) {
        return 0;
      }
      if (!this.props.bounceEnabled || (0, _math.inRange)(this.state.vScrollLocation, maxOffset, 0)) {
        return -this.state.topPocketHeight;
      }
      if (location > 0) {
        transformValue = location;
      }
      if (location < maxOffset) {
        transformValue = location - maxOffset;
      }
      return transformValue - this.state.topPocketHeight;
    }
  }, {
    key: "contentTranslateX",
    get: function () {
      const location = this.state.hScrollLocation;
      let transformValue = location % 1;
      if (!this.props.bounceEnabled || this.hScrollOffsetMax === 0 || (0, _math.inRange)(this.state.hScrollLocation, this.hScrollOffsetMax, 0)) {
        return 0;
      }
      if (location > 0) {
        transformValue = location;
      }
      if (location < this.hScrollOffsetMax) {
        transformValue = location - this.hScrollOffsetMax;
      }
      return transformValue;
    }
  }, {
    key: "containerStyles",
    get: function () {
      if (this.__getterCache['containerStyles'] !== undefined) {
        return this.__getterCache['containerStyles'];
      }
      return this.__getterCache['containerStyles'] = (() => {
        const direction = this.permissibleDirection;
        const vDirectionAllowed = direction === _consts.DIRECTION_VERTICAL || direction === _consts.DIRECTION_BOTH;
        const hDirectionAllowed = direction === _consts.DIRECTION_HORIZONTAL || direction === _consts.DIRECTION_BOTH;
        let touchDirection = vDirectionAllowed ? 'pan-x' : '';
        touchDirection = hDirectionAllowed ? 'pan-y' : touchDirection;
        touchDirection = vDirectionAllowed && hDirectionAllowed ? 'none' : touchDirection;
        return {
          touchAction: touchDirection
        };
      })();
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
        'dx-scrollable': true,
        [_consts.SCROLLABLE_SIMULATED_CLASS]: true,
        ["dx-scrollable-".concat(direction)]: true,
        [_consts.SCROLLABLE_DISABLED_CLASS]: !!disabled,
        [_consts.SCROLLABLE_SCROLLBARS_ALWAYSVISIBLE]: showScrollbar === 'always',
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
    key: "permissibleDirection",
    get: function () {
      const {
        bounceEnabled
      } = this.props;
      return (0, _get_allowed_direction.allowedDirection)(this.props.direction, -this.vScrollOffsetMax, -this.hScrollOffsetMax, bounceEnabled);
    }
  }, {
    key: "isHoverable",
    get: function () {
      return !this.props.disabled && this.props.showScrollbar === 'onHover';
    }
  }, {
    key: "restAttributes",
    get: function () {
      const _this$props11 = this.props,
        restProps = _objectWithoutPropertiesLoose(_this$props11, _excluded);
      return restProps;
    }
  }]);
  return ScrollableSimulated;
}(_inferno2.InfernoComponent);
ScrollableSimulated.defaultProps = _simulated_strategy_props.ScrollableSimulatedProps;
