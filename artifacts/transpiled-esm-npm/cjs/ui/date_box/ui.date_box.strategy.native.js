"use strict";

exports.default = void 0;
var _common = require("../../core/utils/common");
var _uiDate_box = _interopRequireDefault(require("./ui.date_box.strategy"));
var _support = require("../../core/utils/support");
var _ui = _interopRequireDefault(require("./ui.date_utils"));
var _date_serialization = _interopRequireDefault(require("../../core/utils/date_serialization"));
var _extend = require("../../core/utils/extend");
var _devices = _interopRequireDefault(require("../../core/devices"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const NativeStrategy = _uiDate_box.default.inherit({
  NAME: 'Native',
  popupConfig: function (popupConfig) {
    return (0, _extend.extend)({}, popupConfig, {
      width: 'auto'
    });
  },
  getParsedText: function (text) {
    if (!text) {
      return null;
    }

    // NOTE: Required for correct date parsing when native picker is used (T418155)
    if (this.dateBox.option('type') === 'datetime') {
      return new Date(text.replace(/-/g, '/').replace('T', ' ').split('.')[0]);
    }
    return _ui.default.fromStandardDateFormat(text);
  },
  renderPopupContent: _common.noop,
  _getWidgetName: _common.noop,
  _getWidgetOptions: _common.noop,
  _getDateBoxType: function () {
    let type = this.dateBox.option('type');
    if (!_ui.default.SUPPORTED_FORMATS.includes(type)) {
      type = 'date';
    } else if (type === 'datetime' && !(0, _support.inputType)(type)) {
      type = 'datetime-local';
    }
    return type;
  },
  customizeButtons: function () {
    const dropDownButton = this.dateBox.getButton('dropDown');
    if (_devices.default.real().android && dropDownButton) {
      dropDownButton.on('click', function () {
        this.dateBox._input().get(0).click();
      }.bind(this));
    }
  },
  getDefaultOptions: function () {
    return {
      mode: this._getDateBoxType()
    };
  },
  getDisplayFormat: function (displayFormat) {
    const type = this._getDateBoxType();
    return displayFormat || _ui.default.FORMATS_MAP[type];
  },
  renderInputMinMax: function ($input) {
    $input.attr({
      min: _date_serialization.default.serializeDate(this.dateBox.dateOption('min'), 'yyyy-MM-dd'),
      max: _date_serialization.default.serializeDate(this.dateBox.dateOption('max'), 'yyyy-MM-dd')
    });
  }
});
var _default = exports.default = NativeStrategy;
module.exports = exports.default;
module.exports.default = exports.default;