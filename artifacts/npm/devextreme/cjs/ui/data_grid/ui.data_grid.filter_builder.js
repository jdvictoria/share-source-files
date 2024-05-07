/**
* DevExtreme (cjs/ui/data_grid/ui.data_grid.filter_builder.js)
* Version: 24.1.1
* Build date: Tue May 07 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

var _filter_builder = require("../../__internal/grids/data_grid/module_not_extended/filter_builder");
Object.keys(_filter_builder).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _filter_builder[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _filter_builder[key];
    }
  });
});
