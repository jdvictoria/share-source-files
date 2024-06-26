"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MobileTooltipStrategy = void 0;
var _size = require("../../../core/utils/size");
var _window = require("../../../core/utils/window");
var _ui = _interopRequireDefault(require("../../../ui/overlay/ui.overlay"));
var _m_tooltip_strategy_base = require("./m_tooltip_strategy_base");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
const CLASS = {
  slidePanel: 'dx-scheduler-overlay-panel',
  scrollableContent: '.dx-scrollable-content'
};
const MAX_TABLET_OVERLAY_HEIGHT_FACTOR = 0.9;
const MAX_HEIGHT = {
  PHONE: 250,
  TABLET: '90%',
  DEFAULT: 'auto'
};
const MAX_WIDTH = {
  PHONE: '100%',
  TABLET: '80%'
};
const animationConfig = {
  show: {
    type: 'slide',
    duration: 300,
    from: {
      position: {
        my: 'top',
        at: 'bottom',
        of: (0, _window.getWindow)()
      }
    },
    to: {
      position: {
        my: 'center',
        at: 'center',
        of: (0, _window.getWindow)()
      }
    }
  },
  hide: {
    type: 'slide',
    duration: 300,
    to: {
      position: {
        my: 'top',
        at: 'bottom',
        of: (0, _window.getWindow)()
      }
    },
    from: {
      position: {
        my: 'center',
        at: 'center',
        of: (0, _window.getWindow)()
      }
    }
  }
};
const createPhoneDeviceConfig = listHeight => ({
  shading: false,
  width: MAX_WIDTH.PHONE,
  height: listHeight > MAX_HEIGHT.PHONE ? MAX_HEIGHT.PHONE : MAX_HEIGHT.DEFAULT,
  position: {
    my: 'bottom',
    at: 'bottom',
    of: (0, _window.getWindow)()
  }
});
const createTabletDeviceConfig = listHeight => {
  const currentMaxHeight = (0, _size.getHeight)((0, _window.getWindow)()) * MAX_TABLET_OVERLAY_HEIGHT_FACTOR;
  return {
    shading: true,
    width: MAX_WIDTH.TABLET,
    height: listHeight > currentMaxHeight ? MAX_HEIGHT.TABLET : MAX_HEIGHT.DEFAULT,
    position: {
      my: 'center',
      at: 'center',
      of: (0, _window.getWindow)()
    }
  };
};
let MobileTooltipStrategy = exports.MobileTooltipStrategy = /*#__PURE__*/function (_TooltipStrategyBase) {
  _inheritsLoose(MobileTooltipStrategy, _TooltipStrategyBase);
  function MobileTooltipStrategy() {
    return _TooltipStrategyBase.apply(this, arguments) || this;
  }
  var _proto = MobileTooltipStrategy.prototype;
  _proto._shouldUseTarget = function _shouldUseTarget() {
    return false;
  };
  _proto.setTooltipConfig = function setTooltipConfig() {
    const isTabletWidth = (0, _size.getWidth)((0, _window.getWindow)()) > 700;
    const listHeight = (0, _size.getOuterHeight)(this._list.$element().find(CLASS.scrollableContent));
    this._tooltip.option(isTabletWidth ? createTabletDeviceConfig(listHeight) : createPhoneDeviceConfig(listHeight));
  };
  _proto._onShowing = /*#__PURE__*/function () {
    var _onShowing2 = _asyncToGenerator(function* () {
      this._tooltip.option('height', MAX_HEIGHT.DEFAULT);
      /*
      NOTE: there are two setTooltipConfig calls to reduce blinking of overlay.
      The first one sets initial sizes, the second updates them after rendering async templates
      */
      this.setTooltipConfig();
      yield Promise.all([...this.asyncTemplatePromises]);
      this.setTooltipConfig();
    });
    function _onShowing() {
      return _onShowing2.apply(this, arguments);
    }
    return _onShowing;
  }();
  _proto._createTooltip = function _createTooltip(target, dataList) {
    const element = this._createTooltipElement(CLASS.slidePanel);
    return this._options.createComponent(element, _ui.default, {
      target: (0, _window.getWindow)(),
      hideOnOutsideClick: true,
      animation: animationConfig,
      onShowing: () => this._onShowing(),
      onShown: this._onShown.bind(this),
      contentTemplate: this._getContentTemplate(dataList),
      wrapperAttr: {
        class: CLASS.slidePanel
      }
    });
  };
  return MobileTooltipStrategy;
}(_m_tooltip_strategy_base.TooltipStrategyBase);