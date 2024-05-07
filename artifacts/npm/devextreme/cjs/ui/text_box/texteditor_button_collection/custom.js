/**
* DevExtreme (cjs/ui/text_box/texteditor_button_collection/custom.js)
* Version: 24.1.1
* Build date: Tue May 07 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.default = void 0;
var _renderer = _interopRequireDefault(require("../../../core/renderer"));
var _button = _interopRequireDefault(require("./button"));
var _button2 = _interopRequireDefault(require("../../button"));
var _extend = require("../../../core/utils/extend");
var _events_engine = _interopRequireDefault(require("../../../events/core/events_engine"));
var _hover = require("../../../events/hover");
var _click = require("../../../events/click");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
const CUSTOM_BUTTON_HOVERED_CLASS = 'dx-custom-button-hovered';
let CustomButton = exports.default = /*#__PURE__*/function (_TextEditorButton) {
  _inheritsLoose(CustomButton, _TextEditorButton);
  function CustomButton() {
    return _TextEditorButton.apply(this, arguments) || this;
  }
  var _proto = CustomButton.prototype;
  _proto._attachEvents = function _attachEvents(instance, $element) {
    const {
      editor
    } = this;
    _events_engine.default.on($element, _hover.start, () => {
      editor.$element().addClass(CUSTOM_BUTTON_HOVERED_CLASS);
    });
    _events_engine.default.on($element, _hover.end, () => {
      editor.$element().removeClass(CUSTOM_BUTTON_HOVERED_CLASS);
    });
    _events_engine.default.on($element, _click.name, e => {
      e.stopPropagation();
    });
  };
  _proto._create = function _create() {
    const {
      editor
    } = this;
    const $element = (0, _renderer.default)('<div>');
    this._addToContainer($element);
    const instance = editor._createComponent($element, _button2.default, (0, _extend.extend)({}, this.options, {
      ignoreParentReadOnly: true,
      disabled: this._isDisabled(),
      integrationOptions: this._prepareIntegrationOptions(editor)
    }));
    return {
      $element,
      instance
    };
  };
  _proto._prepareIntegrationOptions = function _prepareIntegrationOptions(editor) {
    return (0, _extend.extend)({}, editor.option('integrationOptions'), {
      skipTemplates: ['content']
    });
  };
  _proto.update = function update() {
    const isUpdated = _TextEditorButton.prototype.update.call(this);
    if (this.instance) {
      this.instance.option('disabled', this._isDisabled());
    }
    return isUpdated;
  };
  _proto._isVisible = function _isVisible() {
    const {
      editor
    } = this;
    return editor.option('visible');
  };
  _proto._isDisabled = function _isDisabled() {
    const isDefinedByUser = this.options.disabled !== undefined;
    if (isDefinedByUser) {
      return this.instance ? this.instance.option('disabled') : this.options.disabled;
    } else {
      return this.editor.option('readOnly');
    }
  };
  return CustomButton;
}(_button.default);
module.exports = exports.default;
module.exports.default = exports.default;
