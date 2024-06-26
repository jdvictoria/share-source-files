"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VirtualScrollingRenderer = exports.VirtualScrollingDispatcher = void 0;
var _dom_adapter = _interopRequireDefault(require("../../../core/dom_adapter"));
var _type = require("../../../core/utils/type");
var _window = require("../../../core/utils/window");
var _events_engine = _interopRequireDefault(require("../../../events/core/events_engine"));
var _index = require("../../../events/utils/index");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /* eslint-disable max-classes-per-file */
const DEFAULT_CELL_HEIGHT = 50;
const MIN_CELL_WIDTH = 1;
const MIN_SCROLL_OFFSET = 10;
const VIRTUAL_APPOINTMENTS_RENDER_TIMEOUT = 15;
const DOCUMENT_SCROLL_EVENT_NAMESPACE = (0, _index.addNamespace)('scroll', 'dxSchedulerVirtualScrolling');
const MAX_CELLS_PER_VIRTUAL_CELL_COUNT = 1000;
const scrollingOrientations = {
  vertical: 'vertical',
  horizontal: 'horizontal',
  both: 'both',
  none: 'none'
};
const DefaultScrollingOrientation = scrollingOrientations.both;
let VirtualScrollingDispatcher = exports.VirtualScrollingDispatcher = /*#__PURE__*/function () {
  function VirtualScrollingDispatcher(options) {
    this.options = options;
    if (options) {
      this._rowHeight = this.getCellHeight();
      this._cellWidth = this.getCellWidth();
      this._createVirtualScrollingBase();
    }
  }
  var _proto = VirtualScrollingDispatcher.prototype;
  _proto.setViewOptions = function setViewOptions(options) {
    this.options = options;
    if (this.verticalVirtualScrolling) {
      this.verticalVirtualScrolling.options = options;
      this.verticalVirtualScrolling.itemSize = this.rowHeight;
      this.verticalVirtualScrolling.viewportSize = this.viewportHeight;
    }
    if (this.horizontalVirtualScrolling) {
      this.horizontalVirtualScrolling.options = options;
      this.verticalVirtualScrolling.itemSize = this.cellWidth;
      this.verticalVirtualScrolling.viewportSize = this.viewportWidth;
    }
  };
  _proto.getRenderState = function getRenderState() {
    var _a, _b;
    const verticalRenderState = ((_a = this.verticalVirtualScrolling) === null || _a === void 0 ? void 0 : _a.getRenderState()) || {};
    const horizontalRenderState = ((_b = this.horizontalVirtualScrolling) === null || _b === void 0 ? void 0 : _b.getRenderState()) || {};
    return _extends(_extends({}, verticalRenderState), horizontalRenderState);
  };
  _proto.getCellHeight = function getCellHeight() {
    const cellHeight = this.options.getCellHeight();
    const result = cellHeight > 0 ? cellHeight : DEFAULT_CELL_HEIGHT;
    return Math.floor(result);
  };
  _proto.getCellWidth = function getCellWidth() {
    let cellWidth = this.options.getCellWidth();
    const minCellWidth = this.options.getCellMinWidth();
    // TODO: Remove this after CSS refactoring
    if (!cellWidth || cellWidth < minCellWidth) {
      cellWidth = minCellWidth;
    }
    const result = cellWidth > 0 ? cellWidth : MIN_CELL_WIDTH;
    return Math.floor(result);
  };
  _proto.calculateCoordinatesByDataAndPosition = function calculateCoordinatesByDataAndPosition(cellData, position, date, isCalculateTime, isVerticalDirectionView) {
    const {
      rowIndex,
      columnIndex
    } = position;
    const {
      startDate,
      endDate,
      allDay
    } = cellData;
    const timeToScroll = date.getTime();
    const cellStartTime = startDate.getTime();
    const cellEndTime = endDate.getTime();
    const scrollInCell = allDay || !isCalculateTime ? 0 : (timeToScroll - cellStartTime) / (cellEndTime - cellStartTime);
    const cellWidth = this.getCellWidth();
    const rowHeight = this.getCellHeight();
    const top = isVerticalDirectionView ? (rowIndex + scrollInCell) * rowHeight : rowIndex * rowHeight;
    let left = isVerticalDirectionView ? columnIndex * cellWidth : (columnIndex + scrollInCell) * cellWidth;
    if (this.isRTL) {
      left = this.options.getScrollableOuterWidth() - left;
    }
    return {
      top,
      left
    };
  };
  _proto.dispose = function dispose() {
    if (this._onScrollHandler) {
      _events_engine.default.off(this.document, DOCUMENT_SCROLL_EVENT_NAMESPACE, this._onScrollHandler);
    }
  };
  _proto.createVirtualScrolling = function createVirtualScrolling() {
    const isVerticalVirtualScrollingCreated = !!this.verticalVirtualScrolling;
    const isHorizontalVirtualScrollingCreated = !!this.horizontalVirtualScrolling;
    if (this.verticalScrollingAllowed !== isVerticalVirtualScrollingCreated || this.horizontalScrollingAllowed !== isHorizontalVirtualScrollingCreated) {
      this._rowHeight = this.getCellHeight();
      this._cellWidth = this.getCellWidth();
      this._createVirtualScrollingBase();
    }
  };
  _proto._createVirtualScrollingBase = function _createVirtualScrollingBase() {
    if (this.verticalScrollingAllowed) {
      this.verticalVirtualScrolling = new VerticalVirtualScrolling(_extends(_extends({}, this.options), {
        viewportHeight: this.viewportHeight,
        rowHeight: this.rowHeight,
        outlineCount: this.outlineCount
      }));
    }
    if (this.horizontalScrollingAllowed) {
      this.horizontalVirtualScrolling = new HorizontalVirtualScrolling(_extends(_extends({}, this.options), {
        viewportWidth: this.viewportWidth,
        cellWidth: this.cellWidth,
        outlineCount: this.outlineCount
      }));
    }
  };
  _proto.isAttachWindowScrollEvent = function isAttachWindowScrollEvent() {
    return (this.horizontalScrollingAllowed || this.verticalScrollingAllowed) && !this.height;
  };
  _proto.attachScrollableEvents = function attachScrollableEvents() {
    if (this.isAttachWindowScrollEvent()) {
      this._attachWindowScroll();
    }
  };
  _proto._attachWindowScroll = function _attachWindowScroll() {
    const window = (0, _window.getWindow)();
    this._onScrollHandler = this.options.createAction(() => {
      const {
        scrollX,
        scrollY
      } = window;
      if (scrollX >= MIN_SCROLL_OFFSET || scrollY >= MIN_SCROLL_OFFSET) {
        this.handleOnScrollEvent({
          left: scrollX,
          top: scrollY
        });
      }
    });
    _events_engine.default.on(this.document, DOCUMENT_SCROLL_EVENT_NAMESPACE, this._onScrollHandler);
  };
  _proto.handleOnScrollEvent = function handleOnScrollEvent(scrollPosition) {
    var _a, _b, _c, _d;
    if (scrollPosition) {
      const {
        left,
        top
      } = scrollPosition;
      const verticalStateChanged = (0, _type.isDefined)(top) && ((_a = this.verticalVirtualScrolling) === null || _a === void 0 ? void 0 : _a.updateState(top));
      const horizontalStateChanged = (0, _type.isDefined)(left) && ((_b = this.horizontalVirtualScrolling) === null || _b === void 0 ? void 0 : _b.updateState(left));
      if (verticalStateChanged || horizontalStateChanged) {
        (_d = (_c = this.options).updateRender) === null || _d === void 0 ? void 0 : _d.call(_c);
      }
    }
  };
  _proto.updateDimensions = function updateDimensions(isForce) {
    var _a, _b;
    const cellHeight = this.getCellHeight();
    const needUpdateVertical = this.verticalScrollingAllowed && cellHeight !== this.rowHeight;
    if ((needUpdateVertical || isForce) && this.verticalVirtualScrolling) {
      this.rowHeight = cellHeight;
      this.verticalVirtualScrolling.viewportSize = this.viewportHeight;
      this.verticalVirtualScrolling.reinitState(cellHeight, isForce);
    }
    const cellWidth = this.getCellWidth();
    const needUpdateHorizontal = this.horizontalScrollingAllowed && cellWidth !== this.cellWidth;
    if ((needUpdateHorizontal || isForce) && this.horizontalVirtualScrolling) {
      this.cellWidth = cellWidth;
      this.horizontalVirtualScrolling.viewportSize = this.viewportWidth;
      this.horizontalVirtualScrolling.reinitState(cellWidth, isForce);
    }
    if (needUpdateVertical || needUpdateHorizontal) {
      (_b = (_a = this.options).updateGrid) === null || _b === void 0 ? void 0 : _b.call(_a);
    }
  };
  _createClass(VirtualScrollingDispatcher, [{
    key: "isRTL",
    get: function () {
      return this.options.isRTL();
    }
  }, {
    key: "verticalVirtualScrolling",
    get: function () {
      return this._verticalVirtualScrolling;
    },
    set: function (value) {
      this._verticalVirtualScrolling = value;
    }
  }, {
    key: "horizontalVirtualScrolling",
    get: function () {
      return this._horizontalVirtualScrolling;
    },
    set: function (value) {
      this._horizontalVirtualScrolling = value;
    }
  }, {
    key: "document",
    get: function () {
      return _dom_adapter.default.getDocument();
    }
  }, {
    key: "height",
    get: function () {
      return this.options.getSchedulerHeight();
    }
  }, {
    key: "width",
    get: function () {
      return this.options.getSchedulerWidth();
    }
  }, {
    key: "rowHeight",
    get: function () {
      return this._rowHeight;
    },
    set: function (value) {
      this._rowHeight = value;
    }
  }, {
    key: "outlineCount",
    get: function () {
      return this.options.getScrolling().outlineCount;
    }
  }, {
    key: "cellWidth",
    get: function () {
      return this._cellWidth;
    },
    set: function (value) {
      this._cellWidth = value;
    }
  }, {
    key: "viewportWidth",
    get: function () {
      const width = this.width && this.options.getViewWidth();
      return width > 0 ? width : this.options.getWindowWidth();
    }
  }, {
    key: "viewportHeight",
    get: function () {
      const height = this.height && this.options.getViewHeight();
      return height > 0 ? height : this.options.getWindowHeight();
    }
  }, {
    key: "cellCountInsideTopVirtualRow",
    get: function () {
      var _a;
      return ((_a = this.verticalScrollingState) === null || _a === void 0 ? void 0 : _a.virtualItemCountBefore) || 0;
    }
  }, {
    key: "cellCountInsideLeftVirtualCell",
    get: function () {
      var _a;
      return ((_a = this.horizontalScrollingState) === null || _a === void 0 ? void 0 : _a.virtualItemCountBefore) || 0;
    }
  }, {
    key: "cellCountInsideRightVirtualCell",
    get: function () {
      var _a;
      return ((_a = this.horizontalScrollingState) === null || _a === void 0 ? void 0 : _a.virtualItemCountAfter) || 0;
    }
  }, {
    key: "topVirtualRowsCount",
    get: function () {
      return this.cellCountInsideTopVirtualRow > 0 ? 1 : 0;
    }
  }, {
    key: "leftVirtualCellsCount",
    get: function () {
      const virtualItemsCount = !this.isRTL ? this.cellCountInsideLeftVirtualCell : this.cellCountInsideRightVirtualCell;
      return Math.ceil(virtualItemsCount / MAX_CELLS_PER_VIRTUAL_CELL_COUNT);
    }
  }, {
    key: "virtualRowOffset",
    get: function () {
      var _a;
      return ((_a = this.verticalScrollingState) === null || _a === void 0 ? void 0 : _a.virtualItemSizeBefore) || 0;
    }
  }, {
    key: "virtualCellOffset",
    get: function () {
      var _a;
      return ((_a = this.horizontalScrollingState) === null || _a === void 0 ? void 0 : _a.virtualItemSizeBefore) || 0;
    }
  }, {
    key: "scrollingState",
    get: function () {
      var _a, _b;
      return {
        vertical: (_a = this.verticalVirtualScrolling) === null || _a === void 0 ? void 0 : _a.state,
        horizontal: (_b = this.horizontalVirtualScrolling) === null || _b === void 0 ? void 0 : _b.state
      };
    }
  }, {
    key: "verticalScrollingState",
    get: function () {
      return this.scrollingState.vertical;
    }
  }, {
    key: "horizontalScrollingState",
    get: function () {
      return this.scrollingState.horizontal;
    }
  }, {
    key: "scrollingOrientation",
    get: function () {
      const scrolling = this.options.getScrolling();
      if (scrolling.mode === 'standard') {
        return scrollingOrientations.none;
      }
      return scrolling.orientation || DefaultScrollingOrientation;
    }
  }, {
    key: "verticalScrollingAllowed",
    get: function () {
      return this.scrollingOrientation === scrollingOrientations.vertical || this.scrollingOrientation === scrollingOrientations.both;
    }
  }, {
    key: "horizontalScrollingAllowed",
    get: function () {
      return this.scrollingOrientation === scrollingOrientations.horizontal || this.scrollingOrientation === scrollingOrientations.both;
    }
  }]);
  return VirtualScrollingDispatcher;
}();
let VirtualScrollingBase = /*#__PURE__*/function () {
  function VirtualScrollingBase(options) {
    this.options = options;
    this._state = this.defaultState;
    this.viewportSize = this.options.viewportSize;
    this._itemSize = this.options.itemSize;
    this._position = -1;
    this._itemSizeChanged = false;
    this.updateState(0);
  }
  var _proto2 = VirtualScrollingBase.prototype;
  _proto2.needUpdateState = function needUpdateState(position) {
    const {
      prevPosition,
      startIndex
    } = this.state;
    const isFirstInitialization = startIndex < 0;
    if (isFirstInitialization) {
      return true;
    }
    let isStartIndexChanged = false;
    if (this._validateAndSavePosition(position)) {
      if (position === 0 || position === this.maxScrollPosition) {
        return true;
      }
      const currentPosition = prevPosition;
      const currentItemsCount = Math.floor(currentPosition / this.itemSize);
      const itemsCount = Math.floor(position / this.itemSize);
      isStartIndexChanged = Math.abs(currentItemsCount - itemsCount) >= this.outlineCount;
    }
    return isStartIndexChanged;
  };
  _proto2._validateAndSavePosition = function _validateAndSavePosition(position) {
    if (!(0, _type.isDefined)(position)) {
      return false;
    }
    const result = this.position !== position;
    this.position = position;
    return result;
  };
  _proto2._correctPosition = function _correctPosition(position) {
    return position >= 0 ? Math.min(position, this.maxScrollPosition) : -1;
  };
  _proto2.updateState = function updateState(position, isForce) {
    position = this._correctPosition(position);
    if (!this.needUpdateState(position) && !isForce) {
      return false;
    }
    const itemsInfoBefore = this._calcItemInfoBefore(position);
    const itemsDeltaBefore = this._calcItemDeltaBefore(itemsInfoBefore);
    const {
      outlineCountAfter,
      virtualItemCountAfter,
      itemCountWithAfter
    } = this._calcItemInfoAfter(itemsDeltaBefore);
    const {
      virtualItemCountBefore,
      outlineCountBefore
    } = itemsInfoBefore;
    const itemCount = outlineCountBefore + itemCountWithAfter + outlineCountAfter;
    const itemCountBefore = Math.floor(position / this.itemSize);
    this.state.prevPosition = itemCountBefore * this.itemSize;
    this.state.startIndex = itemCountBefore - outlineCountBefore;
    this.state.virtualItemCountBefore = virtualItemCountBefore;
    this.state.outlineCountBefore = outlineCountBefore;
    this.state.itemCount = itemCount;
    this.state.outlineCountAfter = outlineCountAfter;
    this.state.virtualItemCountAfter = virtualItemCountAfter;
    this._updateStateCore();
    return true;
  };
  _proto2.reinitState = function reinitState(itemSize, isForceUpdate) {
    const {
      position
    } = this;
    this.itemSize = itemSize;
    this.updateState(0, isForceUpdate);
    if (position > 0) {
      this.updateState(position, isForceUpdate);
    }
  };
  _proto2._calcItemInfoBefore = function _calcItemInfoBefore(position) {
    let virtualItemCountBefore = Math.floor(position / this.itemSize);
    const outlineCountBefore = Math.min(virtualItemCountBefore, this.outlineCount);
    virtualItemCountBefore -= outlineCountBefore;
    return {
      virtualItemCountBefore,
      outlineCountBefore
    };
  };
  _proto2._calcItemDeltaBefore = function _calcItemDeltaBefore(itemInfoBefore) {
    const {
      virtualItemCountBefore,
      outlineCountBefore
    } = itemInfoBefore;
    const totalItemCount = this.getTotalItemCount();
    return totalItemCount - virtualItemCountBefore - outlineCountBefore;
  };
  _proto2.getTotalItemCount = function getTotalItemCount() {
    // eslint-disable-next-line @typescript-eslint/no-throw-literal
    throw 'getTotalItemCount method should be implemented';
  };
  _proto2.getRenderState = function getRenderState() {
    // eslint-disable-next-line @typescript-eslint/no-throw-literal
    throw 'getRenderState method should be implemented';
  };
  _proto2._calcItemInfoAfter = function _calcItemInfoAfter(itemsDeltaBefore) {
    const itemCountWithAfter = itemsDeltaBefore >= this.pageSize ? this.pageSize : itemsDeltaBefore;
    let virtualItemCountAfter = itemsDeltaBefore - itemCountWithAfter;
    const outlineCountAfter = virtualItemCountAfter > 0 ? Math.min(virtualItemCountAfter, this.outlineCount) : 0;
    if (virtualItemCountAfter > 0) {
      virtualItemCountAfter -= outlineCountAfter;
    }
    return {
      virtualItemCountAfter,
      outlineCountAfter,
      itemCountWithAfter
    };
  };
  _proto2._updateStateCore = function _updateStateCore() {
    const {
      state
    } = this;
    const {
      virtualItemCountBefore
    } = state;
    const {
      virtualItemCountAfter
    } = state;
    const {
      outlineCountBefore
    } = state;
    const {
      outlineCountAfter
    } = state;
    const prevVirtualItemSizeBefore = state.virtualItemSizeBefore;
    const prevVirtualItemSizeAfter = state.virtualItemSizeAfter;
    const prevOutlineSizeBefore = state.outlineSizeBefore;
    const prevOutlineSizeAfter = state.outlineSizeAfter;
    const virtualItemSizeBefore = this.itemSize * virtualItemCountBefore;
    const virtualItemSizeAfter = this.itemSize * virtualItemCountAfter;
    const outlineSizeBefore = this.itemSize * outlineCountBefore;
    const outlineSizeAfter = this.itemSize * outlineCountAfter;
    const prevVirtualSizeBefore = prevVirtualItemSizeBefore + prevOutlineSizeBefore;
    const virtualSizeBefore = virtualItemSizeBefore + outlineSizeBefore;
    const prevVirtualSizeAfter = prevVirtualItemSizeAfter + prevOutlineSizeAfter;
    const virtualSizeAfter = virtualItemSizeAfter + outlineSizeAfter;
    const isAppend = prevVirtualSizeBefore < virtualSizeBefore;
    const isPrepend = prevVirtualSizeAfter < virtualSizeAfter;
    const needAddItems = this._itemSizeChanged || isAppend || isPrepend;
    if (needAddItems) {
      this._updateStateVirtualItems(virtualItemSizeBefore, virtualItemSizeAfter);
    }
  };
  _proto2._updateStateVirtualItems = function _updateStateVirtualItems(virtualItemSizeBefore, virtualItemSizeAfter) {
    const {
      state
    } = this;
    state.virtualItemSizeBefore = virtualItemSizeBefore;
    state.virtualItemSizeAfter = virtualItemSizeAfter;
  };
  _createClass(VirtualScrollingBase, [{
    key: "itemSize",
    get: function () {
      return this._itemSize;
    },
    set: function (value) {
      this._itemSizeChanged = this._itemSize !== value;
      this._itemSize = value;
    }
  }, {
    key: "state",
    get: function () {
      return this._state;
    },
    set: function (value) {
      this._state = value;
    }
  }, {
    key: "startIndex",
    get: function () {
      return this.state.startIndex;
    }
  }, {
    key: "pageSize",
    get: function () {
      return Math.ceil(this.viewportSize / this.itemSize);
    }
  }, {
    key: "outlineCount",
    get: function () {
      return (0, _type.isDefined)(this.options.outlineCount) ? this.options.outlineCount : Math.floor(this.pageSize / 2);
    }
  }, {
    key: "groupCount",
    get: function () {
      return this.options.getGroupCount();
    }
  }, {
    key: "isVerticalGrouping",
    get: function () {
      return this.options.isVerticalGrouping();
    }
  }, {
    key: "defaultState",
    get: function () {
      return {
        prevPosition: 0,
        startIndex: -1,
        itemCount: 0,
        virtualItemCountBefore: 0,
        virtualItemCountAfter: 0,
        outlineCountBefore: 0,
        outlineCountAfter: 0,
        virtualItemSizeBefore: 0,
        virtualItemSizeAfter: 0,
        outlineSizeBefore: 0,
        outlineSizeAfter: 0
      };
    }
  }, {
    key: "maxScrollPosition",
    get: function () {
      return this.getTotalItemCount() * this.itemSize - this.viewportSize;
    }
  }, {
    key: "position",
    get: function () {
      return this._position;
    },
    set: function (value) {
      this._position = value;
    }
  }]);
  return VirtualScrollingBase;
}();
let VerticalVirtualScrolling = /*#__PURE__*/function (_VirtualScrollingBase) {
  _inheritsLoose(VerticalVirtualScrolling, _VirtualScrollingBase);
  function VerticalVirtualScrolling(options) {
    return _VirtualScrollingBase.call(this, _extends(_extends({}, options), {
      itemSize: options.rowHeight,
      viewportSize: options.viewportHeight
    })) || this;
  }
  var _proto3 = VerticalVirtualScrolling.prototype;
  _proto3.getTotalItemCount = function getTotalItemCount() {
    return this.options.getTotalRowCount(this.groupCount, this.isVerticalGrouping);
  };
  _proto3.getRenderState = function getRenderState() {
    return {
      topVirtualRowHeight: this.state.virtualItemSizeBefore,
      bottomVirtualRowHeight: this.state.virtualItemSizeAfter,
      startRowIndex: this.state.startIndex,
      rowCount: this.state.itemCount,
      startIndex: this.state.startIndex
    };
  };
  _createClass(VerticalVirtualScrolling, [{
    key: "prevTopPosition",
    get: function () {
      return this.state.prevPosition;
    }
  }, {
    key: "rowCount",
    get: function () {
      return this.state.itemCount;
    }
  }, {
    key: "topVirtualRowCount",
    get: function () {
      return this.state.virtualItemCountBefore;
    }
  }, {
    key: "bottomVirtualRowCount",
    get: function () {
      return this.state.virtualItemCountAfter;
    }
  }]);
  return VerticalVirtualScrolling;
}(VirtualScrollingBase);
let HorizontalVirtualScrolling = /*#__PURE__*/function (_VirtualScrollingBase2) {
  _inheritsLoose(HorizontalVirtualScrolling, _VirtualScrollingBase2);
  function HorizontalVirtualScrolling(options) {
    return _VirtualScrollingBase2.call(this, _extends(_extends({}, options), {
      itemSize: options.cellWidth,
      viewportSize: options.viewportWidth
    })) || this;
  }
  var _proto4 = HorizontalVirtualScrolling.prototype;
  _proto4.getTotalItemCount = function getTotalItemCount() {
    return this.options.getTotalCellCount(this.groupCount, this.isVerticalGrouping);
  };
  _proto4.getRenderState = function getRenderState() {
    return {
      leftVirtualCellWidth: this.state.virtualItemSizeBefore,
      rightVirtualCellWidth: this.state.virtualItemSizeAfter,
      startCellIndex: this.state.startIndex,
      cellCount: this.state.itemCount,
      cellWidth: this.itemSize
    };
  };
  _proto4._updateStateVirtualItems = function _updateStateVirtualItems(virtualItemSizeBefore, virtualItemSizeAfter) {
    if (!this.isRTL) {
      _VirtualScrollingBase2.prototype._updateStateVirtualItems.call(this, virtualItemSizeBefore, virtualItemSizeAfter);
    } else {
      const {
        state
      } = this;
      state.virtualItemSizeAfter = virtualItemSizeBefore;
      state.virtualItemSizeBefore = virtualItemSizeAfter;
      state.startIndex = this.getTotalItemCount() - this.startIndex - this.state.itemCount;
    }
  };
  _createClass(HorizontalVirtualScrolling, [{
    key: "isRTL",
    get: function () {
      return this.options.isRTL();
    }
  }]);
  return HorizontalVirtualScrolling;
}(VirtualScrollingBase); // We do not need this class in renovation
let VirtualScrollingRenderer = exports.VirtualScrollingRenderer = /*#__PURE__*/function () {
  function VirtualScrollingRenderer(_workspace) {
    this._workspace = _workspace;
    this._renderAppointmentTimeoutID = null;
  }
  var _proto5 = VirtualScrollingRenderer.prototype;
  _proto5.getRenderTimeout = function getRenderTimeout() {
    return VIRTUAL_APPOINTMENTS_RENDER_TIMEOUT;
  };
  _proto5.updateRender = function updateRender() {
    this._renderGrid();
    this._renderAppointments();
  };
  _proto5._renderGrid = function _renderGrid() {
    this.workspace.renderWorkSpace(false);
  };
  _proto5._renderAppointments = function _renderAppointments() {
    const renderTimeout = this.getRenderTimeout();
    if (renderTimeout >= 0) {
      clearTimeout(this._renderAppointmentTimeoutID);
      this._renderAppointmentTimeoutID = setTimeout(() => this.workspace.updateAppointments(), renderTimeout);
    } else {
      this.workspace.updateAppointments();
    }
  };
  _createClass(VirtualScrollingRenderer, [{
    key: "workspace",
    get: function () {
      return this._workspace;
    }
  }]);
  return VirtualScrollingRenderer;
}();