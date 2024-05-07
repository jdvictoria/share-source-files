/**
* DevExtreme (esm/__internal/scheduler/options_validator/common/validator_rules.js)
* Version: 24.1.1
* Build date: Tue May 07 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import { createValidatorRule } from '../core/index';
import { divisibleBy, greaterThan, inRange, isInteger, lessThan } from './validation_functions';
export var mustBeInteger = createValidatorRule('mustBeInteger', value => isInteger(value) || "".concat(value, " must be an integer."));
export var mustBeGreaterThan = function mustBeGreaterThan(minimalValue) {
  var strict = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  return createValidatorRule('mustBeGreaterThan', value => greaterThan(value, minimalValue, strict) || "".concat(value, " must be ").concat(strict ? '>' : '>=', " than ").concat(minimalValue, "."));
};
export var mustBeLessThan = function mustBeLessThan(maximalValue) {
  var strict = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  return createValidatorRule('mustBeLessThan', value => lessThan(value, maximalValue, strict) || "".concat(value, " must be ").concat(strict ? '<' : '<=', " than ").concat(maximalValue, "."));
};
export var mustBeInRange = range => createValidatorRule('mustBeInRange', value => inRange(value, range) || "".concat(value, " must be in range [").concat(range[0], ", ").concat(range[1], "]."));
export var mustBeDivisibleBy = divider => createValidatorRule('mustBeDivisibleBy', value => divisibleBy(value, divider) || "".concat(value, " must be divisible by ").concat(divider, "."));
