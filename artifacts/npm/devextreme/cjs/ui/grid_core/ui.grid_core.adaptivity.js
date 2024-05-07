/**
* DevExtreme (cjs/ui/grid_core/ui.grid_core.adaptivity.js)
* Version: 24.1.1
* Build date: Tue May 07 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

var _m_adaptivity = require("../../__internal/grids/grid_core/adaptivity/m_adaptivity");
Object.keys(_m_adaptivity).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _m_adaptivity[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _m_adaptivity[key];
    }
  });
});