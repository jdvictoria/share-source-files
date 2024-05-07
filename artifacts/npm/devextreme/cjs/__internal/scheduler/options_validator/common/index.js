/**
* DevExtreme (cjs/__internal/scheduler/options_validator/common/index.js)
* Version: 24.1.1
* Build date: Tue May 07 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _validation_functions = require("./validation_functions");
Object.keys(_validation_functions).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _validation_functions[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _validation_functions[key];
    }
  });
});
var _validator_rules = require("./validator_rules");
Object.keys(_validator_rules).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _validator_rules[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _validator_rules[key];
    }
  });
});
