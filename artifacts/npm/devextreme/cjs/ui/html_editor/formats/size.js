/**
* DevExtreme (cjs/ui/html_editor/formats/size.js)
* Version: 24.1.1
* Build date: Tue May 07 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.default = void 0;
var _devextremeQuill = _interopRequireDefault(require("devextreme-quill"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
let SizeStyle = {};
if (_devextremeQuill.default) {
  SizeStyle = _devextremeQuill.default.import('attributors/style/size');
  SizeStyle.whitelist = null;
}
var _default = exports.default = SizeStyle;
module.exports = exports.default;
module.exports.default = exports.default;