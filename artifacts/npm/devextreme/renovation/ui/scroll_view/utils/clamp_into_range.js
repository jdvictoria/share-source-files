/**
* DevExtreme (renovation/ui/scroll_view/utils/clamp_into_range.js)
* Version: 24.1.1
* Build date: Tue May 07 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.clampIntoRange = clampIntoRange;
function clampIntoRange(value, max, min) {
  return Math.max(Math.min(value, max), min);
}
