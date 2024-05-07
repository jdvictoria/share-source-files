/**
* DevExtreme (cjs/core/utils/extend.js)
* Version: 24.1.1
* Build date: Tue May 07 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.extendFromObject = exports.extend = void 0;
var _type = require("./type");
const extendFromObject = function (target, source, overrideExistingValues) {
  target = target || {};
  for (const prop in source) {
    if (Object.prototype.hasOwnProperty.call(source, prop)) {
      const value = source[prop];
      if (!(prop in target) || overrideExistingValues) {
        target[prop] = value;
      }
    }
  }
  return target;
};
exports.extendFromObject = extendFromObject;
const extend = function (target) {
  target = target || {};
  let i = 1;
  let deep = false;
  if (typeof target === 'boolean') {
    deep = target;
    target = arguments[1] || {};
    i++;
  }
  for (; i < arguments.length; i++) {
    const source = arguments[i];
    if (source == null) {
      continue;
    }
    for (const key in source) {
      const targetValue = target[key];
      const sourceValue = source[key];
      let sourceValueIsArray = false;
      let clone;
      if (key === '__proto__' || key === 'constructor' || target === sourceValue) {
        continue;
      }
      if (deep && sourceValue && ((0, _type.isPlainObject)(sourceValue) || (sourceValueIsArray = Array.isArray(sourceValue)))) {
        if (sourceValueIsArray) {
          clone = targetValue && Array.isArray(targetValue) ? targetValue : [];
        } else {
          clone = targetValue && (0, _type.isPlainObject)(targetValue) ? targetValue : {};
        }
        target[key] = extend(deep, clone, sourceValue);
      } else if (sourceValue !== undefined) {
        target[key] = sourceValue;
      }
    }
  }
  return target;
};
exports.extend = extend;