/**
* DevExtreme (cjs/ui/shared/grouped_data_converter_mixin.js)
* Version: 24.1.1
* Build date: Tue May 07 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.default = void 0;
var _type = require("../../core/utils/type");
const isCorrectStructure = data => {
  return Array.isArray(data) && data.every(item => {
    const hasTwoFields = Object.keys(item).length === 2;
    const hasCorrectFields = 'key' in item && 'items' in item;
    return hasTwoFields && hasCorrectFields && Array.isArray(item.items);
  });
};
var _default = exports.default = {
  _getSpecificDataSourceOption: function () {
    const groupKey = 'key';
    let dataSource = this.option('dataSource');
    let hasSimpleItems = false;
    let data = {};
    if (this._getGroupedOption() && isCorrectStructure(dataSource)) {
      data = dataSource.reduce((accumulator, item) => {
        const items = item.items.map(innerItem => {
          if (!(0, _type.isObject)(innerItem)) {
            innerItem = {
              text: innerItem
            };
            hasSimpleItems = true;
          }
          if (!(groupKey in innerItem)) {
            innerItem[groupKey] = item.key;
          }
          return innerItem;
        });
        return accumulator.concat(items);
      }, []);
      dataSource = {
        store: {
          type: 'array',
          data
        },
        group: {
          selector: 'key',
          keepInitialKeyOrder: true
        }
      };
      if (hasSimpleItems) {
        dataSource.searchExpr = 'text';
      }
    }
    return dataSource;
  }
};
module.exports = exports.default;
module.exports.default = exports.default;
