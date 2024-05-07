/**
* DevExtreme (cjs/viz/tree_map/plain_data_source.js)
* Version: 24.1.1
* Build date: Tue May 07 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

var _tree_map = _interopRequireDefault(require("./tree_map.base"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const proto = _tree_map.default.prototype;
proto._optionChangesMap.idField = proto._optionChangesMap.parentField = 'NODES_CREATE';
proto._processDataSourceItems = function (items) {
  let i;
  const struct = {};
  let currentItem;
  const idField = this._getOption('idField', true);
  const parentField = this._getOption('parentField', true);
  let parentId;
  const rootNodes = [];
  let tmpItems;
  let item;
  if (!idField || !parentField || items.length === 0) {
    return {
      items: items,
      isPlain: false
    };
  }
  for (i = 0; i < items.length; i++) {
    currentItem = items[i];
    parentId = currentItem[parentField];
    if (parentId) {
      struct[parentId] = struct[parentId] || {
        items: []
      };
      tmpItems = struct[parentId].items;
    } else {
      tmpItems = rootNodes;
    }
    tmpItems.push(currentItem);
  }
  treeFiller({
    struct: struct,
    idField: idField
  }, rootNodes);
  for (item in struct) {
    struct[item] && rootNodes.push(struct[item]);
  }
  return {
    items: rootNodes,
    isPlain: true
  };
};
function treeFiller(context, items) {
  let currentItem;
  let i;
  const struct = context.struct;
  let id;
  for (i = 0; i < items.length; i++) {
    currentItem = items[i];
    id = currentItem[context.idField];
    if (struct[id]) {
      currentItem.items = struct[id].items;
      struct[id] = null;
      treeFiller(context, currentItem.items);
    }
  }
}