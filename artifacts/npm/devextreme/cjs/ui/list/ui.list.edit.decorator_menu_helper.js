/**
* DevExtreme (cjs/ui/list/ui.list.edit.decorator_menu_helper.js)
* Version: 24.1.1
* Build date: Tue May 07 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.default = void 0;
const EditDecoratorMenuHelperMixin = {
  _menuEnabled: function () {
    return !!this._menuItems().length;
  },
  _menuItems: function () {
    return this._list.option('menuItems');
  },
  _deleteEnabled: function () {
    return this._list.option('allowItemDeleting');
  },
  _fireMenuAction: function ($itemElement, action) {
    this._list._itemEventHandlerByHandler($itemElement, action, {}, {
      excludeValidators: ['disabled', 'readOnly']
    });
  }
};
var _default = exports.default = EditDecoratorMenuHelperMixin;
module.exports = exports.default;
module.exports.default = exports.default;