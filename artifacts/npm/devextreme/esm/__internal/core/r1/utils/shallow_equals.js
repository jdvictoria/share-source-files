/**
* DevExtreme (esm/__internal/core/r1/utils/shallow_equals.js)
* Version: 24.1.1
* Build date: Tue May 07 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
export var shallowEquals = (firstObject, secondObject) => {
  if (Object.keys(firstObject).length !== Object.keys(secondObject).length) {
    return false;
  }
  return Object.keys(firstObject).every(key => firstObject[key] === secondObject[key]);
};
