/**
* DevExtreme (cjs/ui/hierarchical_collection/ui.data_converter.js)
* Version: 24.1.1
* Build date: Tue May 07 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.default = void 0;
var _class = _interopRequireDefault(require("../../core/class"));
var _extend = require("../../core/utils/extend");
var _ui = _interopRequireDefault(require("../../ui/widget/ui.errors"));
var _iterator = require("../../core/utils/iterator");
var _type = require("../../core/utils/type");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const DataConverter = _class.default.inherit({
  ctor: function () {
    this._dataStructure = [];
    this._itemsCount = 0;
    this._visibleItemsCount = 0;
  },
  _indexByKey: {},
  _convertItemsToNodes: function (items, parentKey) {
    const that = this;
    (0, _iterator.each)(items, function (_, item) {
      const parentId = (0, _type.isDefined)(parentKey) ? parentKey : that._getParentId(item);
      const node = that._convertItemToNode(item, parentId);
      that._dataStructure.push(node);
      that._checkForDuplicateId(node.internalFields.key);
      that._indexByKey[node.internalFields.key] = that._dataStructure.length - 1;
      if (that._itemHasChildren(item)) {
        that._convertItemsToNodes(that._dataAccessors.getters.items(item), node.internalFields.key);
      }
    });
  },
  _checkForDuplicateId: function (key) {
    if ((0, _type.isDefined)(this._indexByKey[key])) {
      throw _ui.default.Error('E1040', key);
    }
  },
  _getParentId: function (item) {
    return this._dataType === 'plain' ? this._dataAccessors.getters.parentKey(item) : undefined;
  },
  _itemHasChildren: function (item) {
    if (this._dataType === 'plain') {
      return;
    }
    const items = this._dataAccessors.getters.items(item);
    return items && items.length;
  },
  _getUniqueKey: function (item) {
    const keyGetter = this._dataAccessors.getters.key;
    const itemKey = keyGetter(item);
    const isCorrectKey = keyGetter && (itemKey || itemKey === 0) && (0, _type.isPrimitive)(itemKey);
    return isCorrectKey ? itemKey : this.getItemsCount();
  },
  _convertItemToNode: function (item, parentKey) {
    this._itemsCount++;
    item.visible !== false && this._visibleItemsCount++;
    const that = this;
    const node = {
      internalFields: {
        disabled: that._dataAccessors.getters.disabled(item, {
          defaultValue: false
        }),
        expanded: that._dataAccessors.getters.expanded(item, {
          defaultValue: false
        }),
        selected: that._dataAccessors.getters.selected(item, {
          defaultValue: false
        }),
        key: that._getUniqueKey(item),
        parentKey: (0, _type.isDefined)(parentKey) ? parentKey : that._rootValue,
        item: that._makeObjectFromPrimitive(item),
        childrenKeys: []
      }
    };
    (0, _extend.extend)(node, item);
    delete node.items;
    return node;
  },
  setChildrenKeys: function () {
    const that = this;
    (0, _iterator.each)(this._dataStructure, function (_, node) {
      if (node.internalFields.parentKey === that._rootValue) return;
      const parent = that.getParentNode(node);
      parent && parent.internalFields.childrenKeys.push(node.internalFields.key);
    });
  },
  _makeObjectFromPrimitive: function (item) {
    if ((0, _type.isPrimitive)(item)) {
      const key = item;
      item = {};
      this._dataAccessors.setters.key(item, key);
    }
    return item;
  },
  _convertToPublicNode: function (node, parent) {
    if (!node) {
      return null;
    }
    const publicNode = {
      text: this._dataAccessors.getters.display(node),
      key: node.internalFields.key,
      selected: node.internalFields.selected,
      expanded: node.internalFields.expanded,
      disabled: node.internalFields.disabled,
      parent: parent || null,
      itemData: node.internalFields.item,
      children: [],
      items: []
    };
    if (publicNode.parent) {
      publicNode.parent.children.push(publicNode);
      publicNode.parent.items.push(publicNode);
    }
    return publicNode;
  },
  convertToPublicNodes: function (data, parent) {
    if (!data.length) return [];
    const that = this;
    const publicNodes = [];
    (0, _iterator.each)(data, function (_, node) {
      node = (0, _type.isPrimitive)(node) ? that._getByKey(node) : node;
      const publicNode = that._convertToPublicNode(node, parent);
      publicNode.children = that.convertToPublicNodes(node.internalFields.childrenKeys, publicNode);
      publicNodes.push(publicNode);
      node.internalFields.publicNode = publicNode;
    });
    return publicNodes;
  },
  setDataAccessors: function (accessors) {
    this._dataAccessors = accessors;
  },
  _getByKey: function (key) {
    return this._dataStructure[this.getIndexByKey(key)] || null;
  },
  getParentNode: function (node) {
    return this._getByKey(node.internalFields.parentKey);
  },
  getByKey: function (data, key) {
    if (key === null || key === undefined) {
      return null;
    }
    let result = null;
    const that = this;
    const getByKey = function (data, key) {
      (0, _iterator.each)(data, function (_, element) {
        const currentElementKey = element.internalFields && element.internalFields.key || that._dataAccessors.getters.key(element);
        if (currentElementKey.toString() === key.toString()) {
          result = element;
          return false;
        }
      });
      return result;
    };
    return getByKey(data, key);
  },
  getItemsCount: function () {
    return this._itemsCount;
  },
  getVisibleItemsCount: function () {
    return this._visibleItemsCount;
  },
  updateIndexByKey: function () {
    const that = this;
    this._indexByKey = {};
    (0, _iterator.each)(this._dataStructure, function (index, node) {
      that._checkForDuplicateId(node.internalFields.key);
      that._indexByKey[node.internalFields.key] = index;
    });
  },
  updateChildrenKeys: function () {
    this._indexByKey = {};
    this.removeChildrenKeys();
    this.updateIndexByKey();
    this.setChildrenKeys();
  },
  removeChildrenKeys: function () {
    this._indexByKey = {};
    (0, _iterator.each)(this._dataStructure, function (index, node) {
      node.internalFields.childrenKeys = [];
    });
  },
  getIndexByKey: function (key) {
    return this._indexByKey[key];
  },
  createPlainStructure: function (items, rootValue, dataType) {
    this._itemsCount = 0;
    this._visibleItemsCount = 0;
    this._rootValue = rootValue;
    this._dataType = dataType;
    this._indexByKey = {};
    this._convertItemsToNodes(items);
    this.setChildrenKeys();
    return this._dataStructure;
  }
});
var _default = exports.default = DataConverter;
module.exports = exports.default;
module.exports.default = exports.default;
