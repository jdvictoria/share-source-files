/**
* DevExtreme (cjs/ui/data_grid/ui.data_grid.adaptivity.js)
* Version: 24.1.1
* Build date: Tue May 07 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

var _adaptivity = require("../../__internal/grids/data_grid/module_not_extended/adaptivity");
Object.keys(_adaptivity).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _adaptivity[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _adaptivity[key];
    }
  });
});
