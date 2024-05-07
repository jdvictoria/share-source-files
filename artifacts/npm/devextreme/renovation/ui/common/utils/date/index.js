/**
* DevExtreme (renovation/ui/common/utils/date/index.js)
* Version: 24.1.1
* Build date: Tue May 07 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

var _toMilliseconds = require("./toMilliseconds");
Object.keys(_toMilliseconds).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _toMilliseconds[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _toMilliseconds[key];
    }
  });
});
