/**
* DevExtreme (esm/__internal/core/r1/utils/update_props_immutable.js)
* Version: 24.1.1
* Build date: Tue May 07 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import _extends from "@babel/runtime/helpers/esm/extends";
import { getPathParts } from '../../../../core/utils/data';
import { isPlainObject } from '../../../../core/utils/type';
var cloneObjectValue = value => Array.isArray(value) ? [...value] : _extends({}, value);
var cloneObjectProp = (value, prevValue, fullNameParts) => {
  var result = fullNameParts.length > 0 && prevValue && value !== prevValue ? cloneObjectValue(prevValue) : cloneObjectValue(value);
  var name = fullNameParts[0];
  if (fullNameParts.length > 1) {
    result[name] = cloneObjectProp(value[name], prevValue === null || prevValue === void 0 ? void 0 : prevValue[name], fullNameParts.slice(1));
  } else if (name) {
    if (isPlainObject(value[name])) {
      result[name] = cloneObjectValue(value[name]);
    } else {
      result[name] = value[name];
    }
  }
  return result;
};
export var updatePropsImmutable = (props, option, name, fullName) => {
  var currentPropsValue = option[name];
  var prevPropsValue = props[name];
  var result = props;
  if (isPlainObject(currentPropsValue) || name !== fullName && Array.isArray(currentPropsValue)) {
    result[name] = cloneObjectProp(currentPropsValue, prevPropsValue, getPathParts(fullName).slice(1));
  } else {
    result[name] = currentPropsValue;
  }
};
