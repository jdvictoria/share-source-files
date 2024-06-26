"use strict";

exports.default = void 0;
var _devextremeQuill = _interopRequireDefault(require("devextreme-quill"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
let AlignStyle = {};
if (_devextremeQuill.default) {
  AlignStyle = _devextremeQuill.default.import('attributors/style/align');
  AlignStyle.whitelist.push('left');
}
var _default = exports.default = AlignStyle;
module.exports = exports.default;
module.exports.default = exports.default;