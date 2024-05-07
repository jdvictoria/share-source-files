/**
* DevExtreme (cjs/data/query_implementation.js)
* Version: 24.1.1
* Build date: Tue May 07 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.queryImpl = void 0;
var _array_query = _interopRequireDefault(require("./array_query"));
var _remote_query = _interopRequireDefault(require("./remote_query"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const queryImpl = exports.queryImpl = {
  array: _array_query.default,
  remote: _remote_query.default
};
