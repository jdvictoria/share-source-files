/**
* DevExtreme (cjs/integration/jquery/component_registrator.js)
* Version: 24.1.1
* Build date: Tue May 07 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

var _jquery = _interopRequireDefault(require("jquery"));
var _component_registrator_callbacks = _interopRequireDefault(require("../../core/component_registrator_callbacks"));
var _errors = _interopRequireDefault(require("../../core/errors"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// eslint-disable-next-line no-restricted-imports

if (_jquery.default) {
  const registerJQueryComponent = function (name, componentClass) {
    _jquery.default.fn[name] = function (options) {
      const isMemberInvoke = typeof options === 'string';
      let result;
      if (isMemberInvoke) {
        const memberName = options;
        const memberArgs = [].slice.call(arguments).slice(1);
        this.each(function () {
          const instance = componentClass.getInstance(this);
          if (!instance) {
            throw _errors.default.Error('E0009', name);
          }
          const member = instance[memberName];
          const memberValue = member.apply(instance, memberArgs);
          if (result === undefined) {
            result = memberValue;
          }
        });
      } else {
        this.each(function () {
          const instance = componentClass.getInstance(this);
          if (instance) {
            instance.option(options);
          } else {
            new componentClass(this, options);
          }
        });
        result = this;
      }
      return result;
    };
  };
  _component_registrator_callbacks.default.add(registerJQueryComponent);
}
