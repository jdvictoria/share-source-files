"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _component_registrator = _interopRequireDefault(require("../../../core/component_registrator"));
var _devices = _interopRequireDefault(require("../../../core/devices"));
var _renderer = _interopRequireDefault(require("../../../core/renderer"));
var _calendar = _interopRequireDefault(require("../../../ui/calendar"));
var _ui = _interopRequireDefault(require("../../../ui/popover/ui.popover"));
var _ui2 = _interopRequireDefault(require("../../../ui/popup/ui.popup"));
var _ui3 = _interopRequireDefault(require("../../../ui/scroll_view/ui.scrollable"));
var _ui4 = _interopRequireDefault(require("../../../ui/widget/ui.widget"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
const CALENDAR_CLASS = 'dx-scheduler-navigator-calendar';
const CALENDAR_POPOVER_CLASS = 'dx-scheduler-navigator-calendar-popover';
let SchedulerCalendar = exports.default = /*#__PURE__*/function (_Widget) {
  _inheritsLoose(SchedulerCalendar, _Widget);
  function SchedulerCalendar() {
    return _Widget.apply(this, arguments) || this;
  }
  var _proto = SchedulerCalendar.prototype;
  _proto.show = function show(target) {
    if (!this._isMobileLayout()) {
      this._overlay.option('target', target);
    }
    this._overlay.show();
  };
  _proto.hide = function hide() {
    this._overlay.hide();
  };
  _proto._keyboardHandler = function _keyboardHandler(opts) {
    var _a;
    (_a = this._calendar) === null || _a === void 0 ? void 0 : _a._keyboardHandler(opts);
  };
  _proto._init = function _init() {
    // @ts-expect-error
    _Widget.prototype._init.call(this);
    this.$element();
  };
  _proto._render = function _render() {
    // @ts-expect-error
    _Widget.prototype._render.call(this);
    this._renderOverlay();
  };
  _proto._renderOverlay = function _renderOverlay() {
    // @ts-expect-error
    this.$element().addClass(CALENDAR_POPOVER_CLASS);
    const isMobileLayout = this._isMobileLayout();
    const overlayType = isMobileLayout ? _ui2.default : _ui.default;
    // @ts-expect-error
    this._overlay = this._createComponent(this.$element(), overlayType, {
      contentTemplate: () => this._createOverlayContent(),
      onShown: () => this._calendar.focus(),
      defaultOptionsRules: [{
        device: () => isMobileLayout,
        options: {
          fullScreen: true,
          showCloseButton: false,
          toolbarItems: [{
            shortcut: 'cancel'
          }],
          _ignorePreventScrollEventsDeprecation: true,
          preventScrollEvents: false,
          enableBodyScroll: false
        }
      }]
    });
  };
  _proto._createOverlayContent = function _createOverlayContent() {
    const result = (0, _renderer.default)('<div>').addClass(CALENDAR_CLASS);
    // @ts-expect-error
    this._calendar = this._createComponent(result, _calendar.default, this._getCalendarOptions());
    if (this._isMobileLayout()) {
      const scrollable = this._createScrollable(result);
      return scrollable.$element();
    }
    return result;
  };
  _proto._createScrollable = function _createScrollable(content) {
    // @ts-expect-error
    const result = this._createComponent('<div>', _ui3.default, {
      height: 'auto',
      direction: 'both'
    });
    result.$content().append(content);
    return result;
  };
  _proto._optionChanged = function _optionChanged(_ref) {
    let {
      name,
      value
    } = _ref;
    var _a;
    switch (name) {
      case 'value':
        (_a = this._calendar) === null || _a === void 0 ? void 0 : _a.option('value', value);
        break;
      default:
        break;
    }
  };
  _proto._getCalendarOptions = function _getCalendarOptions() {
    return {
      value: this.option('value'),
      min: this.option('min'),
      max: this.option('max'),
      firstDayOfWeek: this.option('firstDayOfWeek'),
      focusStateEnabled: this.option('focusStateEnabled'),
      onValueChanged: this.option('onValueChanged'),
      skipFocusCheck: true,
      tabIndex: this.option('tabIndex')
    };
  };
  _proto._isMobileLayout = function _isMobileLayout() {
    return !_devices.default.current().generic;
  };
  return SchedulerCalendar;
}(_ui4.default); // @ts-expect-error
(0, _component_registrator.default)('dxSchedulerCalendarPopup', SchedulerCalendar);