/**
* DevExtreme (cjs/ui/text_box/ui.text_editor.mask.strategy.js)
* Version: 24.1.1
* Build date: Tue May 07 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.default = void 0;
var _events_engine = _interopRequireDefault(require("../../events/core/events_engine"));
var _index = require("../../events/utils/index");
var _browser = _interopRequireDefault(require("../../core/utils/browser"));
var _dom = require("../../core/utils/dom");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const MASK_EVENT_NAMESPACE = 'dxMask';
const BLUR_EVENT = 'blur beforedeactivate';
const EMPTY_CHAR = ' ';
const DELETE_INPUT_TYPES = ['deleteContentBackward', 'deleteSoftLineBackward', 'deleteContent', 'deleteHardLineBackward'];
const HISTORY_INPUT_TYPES = ['historyUndo', 'historyRedo'];
const EVENT_NAMES = ['focusIn', 'focusOut', 'input', 'paste', 'cut', 'drop', 'beforeInput'];
function getEmptyString(length) {
  return EMPTY_CHAR.repeat(length);
}
let MaskStrategy = exports.default = /*#__PURE__*/function () {
  function MaskStrategy(editor) {
    this.editor = editor;
  }
  var _proto = MaskStrategy.prototype;
  _proto._editorOption = function _editorOption() {
    return this.editor.option(...arguments);
  };
  _proto._editorInput = function _editorInput() {
    return this.editor._input();
  };
  _proto._editorCaret = function _editorCaret(newCaret) {
    if (!newCaret) {
      return this.editor._caret();
    }
    this.editor._caret(newCaret);
  };
  _proto._attachChangeEventHandler = function _attachChangeEventHandler() {
    if (!this._editorOption('valueChangeEvent').split(' ').includes('change')) {
      return;
    }
    const $input = this._editorInput();
    const namespace = (0, _index.addNamespace)(BLUR_EVENT, MASK_EVENT_NAMESPACE);
    _events_engine.default.on($input, namespace, e => {
      this.editor._changeHandler(e);
    });
  };
  _proto._beforeInputHandler = function _beforeInputHandler() {
    this._previousText = this._editorOption('text');
    this._prevCaret = this._editorCaret();
  };
  _proto._inputHandler = function _inputHandler(event) {
    const {
      originalEvent
    } = event;
    if (!originalEvent) {
      return;
    }
    const {
      inputType
    } = originalEvent;
    if (HISTORY_INPUT_TYPES.includes(inputType)) {
      this._handleHistoryInputEvent();
    } else if (DELETE_INPUT_TYPES.includes(inputType)) {
      this._handleBackwardDeleteInputEvent();
    } else {
      const currentCaret = this._editorCaret();
      if (!currentCaret.end) {
        return;
      }
      this._clearSelectedText();
      this._autoFillHandler(originalEvent);
      this._editorCaret(currentCaret);
      this._handleInsertTextInputEvent(originalEvent.data);
    }
    if (this._editorOption('text') === this._previousText) {
      event.stopImmediatePropagation();
    }
  };
  _proto._handleHistoryInputEvent = function _handleHistoryInputEvent() {
    const caret = this._editorCaret();
    this._updateEditorMask({
      start: caret.start,
      length: caret.end - caret.start,
      text: ''
    });
    this._editorCaret(this._prevCaret);
  };
  _proto._handleBackwardDeleteInputEvent = function _handleBackwardDeleteInputEvent() {
    this._clearSelectedText();
    const caret = this._editorCaret();
    this.editor.setForwardDirection();
    this.editor._adjustCaret();
    const adjustedForwardCaret = this._editorCaret();
    if (adjustedForwardCaret.start !== caret.start) {
      this.editor.setBackwardDirection();
      this.editor._adjustCaret();
    }
  };
  _proto._clearSelectedText = function _clearSelectedText() {
    var _this$_prevCaret, _this$_prevCaret2;
    const length = ((_this$_prevCaret = this._prevCaret) === null || _this$_prevCaret === void 0 ? void 0 : _this$_prevCaret.end) - ((_this$_prevCaret2 = this._prevCaret) === null || _this$_prevCaret2 === void 0 ? void 0 : _this$_prevCaret2.start) || 1;
    const caret = this._editorCaret();
    if (!this._isAutoFill()) {
      this.editor.setBackwardDirection();
      this._updateEditorMask({
        start: caret.start,
        length,
        text: getEmptyString(length)
      });
    }
  };
  _proto._handleInsertTextInputEvent = function _handleInsertTextInputEvent(data) {
    var _this$_prevCaret$star, _this$_prevCaret3;
    // NOTE: data has length > 1 when autosuggestion is applied.
    const text = data !== null && data !== void 0 ? data : '';
    this.editor.setForwardDirection();
    const hasValidChars = this._updateEditorMask({
      start: (_this$_prevCaret$star = (_this$_prevCaret3 = this._prevCaret) === null || _this$_prevCaret3 === void 0 ? void 0 : _this$_prevCaret3.start) !== null && _this$_prevCaret$star !== void 0 ? _this$_prevCaret$star : 0,
      length: text.length || 1,
      text
    });
    if (!hasValidChars) {
      this._editorCaret(this._prevCaret);
    }
  };
  _proto._updateEditorMask = function _updateEditorMask(args) {
    const textLength = args.text.length;
    const processedCharsCount = this.editor._handleChain(args);
    this.editor._displayMask();
    if (this.editor.isForwardDirection()) {
      const {
        start,
        end
      } = this._editorCaret();
      const correction = processedCharsCount - textLength;
      const hasSkippedStub = processedCharsCount > 1;
      if (hasSkippedStub && textLength === 1) {
        this._editorCaret({
          start: start + correction,
          end: end + correction
        });
      }
      this.editor._adjustCaret();
    }
    return !!processedCharsCount;
  };
  _proto._focusInHandler = function _focusInHandler() {
    this.editor._showMaskPlaceholder();
    this.editor.setForwardDirection();
    if (!this.editor._isValueEmpty() && this._editorOption('isValid')) {
      this.editor._adjustCaret();
    } else {
      const caret = this.editor._maskRulesChain.first();
      this._caretTimeout = setTimeout(() => {
        this._editorCaret({
          start: caret,
          end: caret
        });
      }, 0);
    }
  };
  _proto._focusOutHandler = function _focusOutHandler(event) {
    this.editor._changeHandler(event);
    if (this._editorOption('showMaskMode') === 'onFocus' && this.editor._isValueEmpty()) {
      this._editorOption('text', '');
      this.editor._renderDisplayText('');
    }
  };
  _proto._delHandler = function _delHandler(event) {
    const {
      editor
    } = this;
    editor._maskKeyHandler(event, () => {
      if (!editor._hasSelection()) {
        editor._handleKey(EMPTY_CHAR);
      }
    });
  };
  _proto._cutHandler = function _cutHandler(event) {
    const caret = this._editorCaret();
    const selectedText = this._editorInput().val().substring(caret.start, caret.end);
    this.editor._maskKeyHandler(event, () => (0, _dom.clipboardText)(event, selectedText));
  };
  _proto._dropHandler = function _dropHandler() {
    this._clearDragTimer();
    this._dragTimer = setTimeout(() => {
      const value = this.editor._convertToValue(this._editorInput().val());
      this._editorOption('value', value);
    });
  };
  _proto._pasteHandler = function _pasteHandler(event) {
    const {
      editor
    } = this;
    if (this._editorOption('disabled')) {
      return;
    }
    const caret = this._editorCaret();
    editor._maskKeyHandler(event, () => {
      const pastedText = (0, _dom.clipboardText)(event);
      const restText = editor._maskRulesChain.text().substring(caret.end);
      const accepted = editor._handleChain({
        text: pastedText,
        start: caret.start,
        length: pastedText.length
      });
      const newCaret = caret.start + accepted;
      editor._handleChain({
        text: restText,
        start: newCaret,
        length: restText.length
      });
      editor._caret({
        start: newCaret,
        end: newCaret
      });
    });
  };
  _proto._autoFillHandler = function _autoFillHandler(event) {
    const {
      editor
    } = this;
    const inputVal = this._editorInput().val();
    this._inputHandlerTimer = setTimeout(() => {
      if (this._isAutoFill()) {
        editor._maskKeyHandler(event, () => {
          editor._handleChain({
            text: inputVal,
            start: 0,
            length: inputVal.length
          });
        });
        editor._validateMask();
      }
    });
  };
  _proto._isAutoFill = function _isAutoFill() {
    const $input = this._editorInput();
    if (_browser.default.webkit) {
      var _input$matches;
      const input = $input.get(0);
      return (_input$matches = input === null || input === void 0 ? void 0 : input.matches(':-webkit-autofill')) !== null && _input$matches !== void 0 ? _input$matches : false;
    }
    return false;
  };
  _proto._clearDragTimer = function _clearDragTimer() {
    clearTimeout(this._dragTimer);
  };
  _proto._clearTimers = function _clearTimers() {
    this._clearDragTimer();
    clearTimeout(this._caretTimeout);
    clearTimeout(this._inputHandlerTimer);
  };
  _proto.getHandler = function getHandler(handlerName) {
    return args => {
      var _this;
      (_this = this["_".concat(handlerName, "Handler")]) === null || _this === void 0 ? void 0 : _this.call(this, args);
    };
  };
  _proto.attachEvents = function attachEvents() {
    const $input = this._editorInput();
    EVENT_NAMES.forEach(eventName => {
      const namespace = (0, _index.addNamespace)(eventName.toLowerCase(), MASK_EVENT_NAMESPACE);
      _events_engine.default.on($input, namespace, this.getHandler(eventName));
    });
    this._attachChangeEventHandler();
  };
  _proto.detachEvents = function detachEvents() {
    this._clearTimers();
    _events_engine.default.off(this._editorInput(), ".".concat(MASK_EVENT_NAMESPACE));
  };
  _proto.clean = function clean() {
    this._clearTimers();
  };
  return MaskStrategy;
}();
module.exports = exports.default;
module.exports.default = exports.default;
