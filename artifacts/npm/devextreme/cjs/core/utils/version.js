/**
* DevExtreme (cjs/core/utils/version.js)
* Version: 24.1.1
* Build date: Tue May 07 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.compare = compare;
function compare(x, y, maxLevel) {
  function normalizeArg(value) {
    if (typeof value === 'string') {
      return value.split('.');
    }
    if (typeof value === 'number') {
      return [value];
    }
    return value;
  }
  x = normalizeArg(x);
  y = normalizeArg(y);
  let length = Math.max(x.length, y.length);
  if (isFinite(maxLevel)) {
    length = Math.min(length, maxLevel);
  }
  for (let i = 0; i < length; i++) {
    const xItem = parseInt(x[i] || 0, 10);
    const yItem = parseInt(y[i] || 0, 10);
    if (xItem < yItem) {
      return -1;
    }
    if (xItem > yItem) {
      return 1;
    }
  }
  return 0;
}
