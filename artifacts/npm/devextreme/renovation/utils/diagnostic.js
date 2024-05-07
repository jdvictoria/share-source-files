/**
* DevExtreme (renovation/utils/diagnostic.js)
* Version: 24.1.1
* Build date: Tue May 07 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.DiagnosticUtils = void 0;
var _window = require("../../core/utils/window");
const DiagnosticUtils = exports.DiagnosticUtils = {
  resolveMap: () => {
    const diagnosticWindow = (0, _window.getWindow)();
    if (!diagnosticWindow.dxDiagnostic) {
      diagnosticWindow.dxDiagnostic = {};
    }
    return diagnosticWindow.dxDiagnostic;
  },
  getDiagnostic: key => {
    const diagnosticMap = DiagnosticUtils.resolveMap();
    if (!diagnosticMap[key]) {
      diagnosticMap[key] = {
        renderCount: 0
      };
    }
    return diagnosticMap[key];
  },
  incrementRenderCount: key => {
    const diagnostic = DiagnosticUtils.getDiagnostic(key);
    diagnostic.renderCount += 1;
  }
};
