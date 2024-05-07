/**
* DevExtreme (cjs/renovation/ui/editors/common/text_editor_props.js)
* Version: 24.1.1
* Build date: Tue May 07 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.TextEditorProps = void 0;
var _themes = require("../../../../ui/themes");
const TextEditorProps = exports.TextEditorProps = Object.defineProperties({
  maxLength: null,
  spellCheck: false,
  valueChangeEvent: 'change',
  defaultValue: ''
}, {
  stylingMode: {
    get: function () {
      return (0, _themes.isMaterial)((0, _themes.current)()) ? 'filled' : 'outlined';
    },
    configurable: true,
    enumerable: true
  }
});
