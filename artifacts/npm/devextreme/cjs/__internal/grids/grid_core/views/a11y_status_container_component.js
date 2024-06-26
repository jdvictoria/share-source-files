/**
* DevExtreme (cjs/__internal/grids/grid_core/views/a11y_status_container_component.js)
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
exports.A11yStatusContainerComponent = void 0;
var _renderer = _interopRequireDefault(require("../../../../core/renderer"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const CLASSES = {
  container: 'dx-gridbase-a11y-status-container'
};
const A11yStatusContainerComponent = _ref => {
  let {
    statusText
  } = _ref;
  return (0, _renderer.default)('<div>').text(statusText !== null && statusText !== void 0 ? statusText : '').addClass(CLASSES.container).attr('role', 'status');
};
exports.A11yStatusContainerComponent = A11yStatusContainerComponent;
