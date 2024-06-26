/**
* DevExtreme (esm/__internal/core/utils/math.js)
* Version: 24.1.1
* Build date: Tue May 07 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
export var shiftIntegerByModule = (integerValue, moduleValue) => {
  if (!Number.isInteger(integerValue)) {
    throw Error("Passed integer value ".concat(integerValue, " is not an integer."));
  }
  if (!Number.isInteger(moduleValue)) {
    throw Error("Passed module value ".concat(moduleValue, " is not an integer."));
  }
  if (moduleValue <= 0) {
    throw Error("Passed module value ".concat(moduleValue, " must be > 0."));
  }
  var normalizedInteger = integerValue % moduleValue;
  switch (true) {
    // NOTE: In some cases we can have -0 or +0 values.
    // So this is why we handle zero as separate case here.
    case normalizedInteger === 0:
      return 0;
    case normalizedInteger > 0:
      return normalizedInteger;
    case normalizedInteger < 0:
      return moduleValue + normalizedInteger;
    default:
      throw Error("Unexpected division (".concat(integerValue, " % ").concat(moduleValue, ") occurred."));
  }
};
