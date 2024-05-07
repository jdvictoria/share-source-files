/**
* DevExtreme (cjs/renovation/utils/getThemeType.js)
* Version: 24.1.1
* Build date: Tue May 07 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.default = void 0;
var _themes = require("../../ui/themes");
const getThemeType = () => {
  const theme = (0, _themes.current)();
  return {
    isCompact: (0, _themes.isCompact)(theme),
    isMaterial: (0, _themes.isMaterial)(theme),
    isFluent: (0, _themes.isFluent)(theme),
    isMaterialBased: (0, _themes.isMaterialBased)(theme)
  };
};
var _default = exports.default = getThemeType;
module.exports = exports.default;
module.exports.default = exports.default;
