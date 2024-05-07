/**
* DevExtreme (cjs/ui/diagram/diagram.items_option.js)
* Version: 24.1.1
* Build date: Tue May 07 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.default = void 0;
var _extend = require("../../core/utils/extend");
var _component = require("../../core/component");
var _data_helper = _interopRequireDefault(require("../../data_helper"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
const ItemsOptionBase = _component.Component.inherit({}).include(_data_helper.default);
let ItemsOption = /*#__PURE__*/function (_ItemsOptionBase) {
  _inheritsLoose(ItemsOption, _ItemsOptionBase);
  function ItemsOption(diagramWidget) {
    var _this;
    _this = _ItemsOptionBase.call(this) || this;
    _this._diagramWidget = diagramWidget;
    _this._resetCache();
    return _this;
  }
  var _proto = ItemsOption.prototype;
  _proto._dataSourceChangedHandler = function _dataSourceChangedHandler(newItems, e) {
    this._resetCache();
    this._items = newItems.map(item => (0, _extend.extend)(true, {}, item));
    this._dataSourceItems = newItems.slice();
    if (e && e.changes) {
      const internalChanges = e.changes.filter(change => change.internalChange);
      const externalChanges = e.changes.filter(change => !change.internalChange);
      if (internalChanges.length) {
        this._reloadContentByChanges(internalChanges, false);
      }
      if (externalChanges.length) {
        this._reloadContentByChanges(externalChanges, true);
      }
    } else {
      this._diagramWidget._onDataSourceChanged();
    }
  };
  _proto._dataSourceLoadingChangedHandler = function _dataSourceLoadingChangedHandler(isLoading) {
    if (isLoading && !this._dataSource.isLoaded()) {
      this._diagramWidget._showLoadingIndicator();
    } else {
      this._diagramWidget._hideLoadingIndicator();
    }
  };
  _proto._prepareData = function _prepareData(dataObj) {
    for (const key in dataObj) {
      if (!Object.prototype.hasOwnProperty.call(dataObj, key)) continue;
      if (dataObj[key] === undefined) {
        dataObj[key] = null;
      }
    }
    return dataObj;
  };
  _proto.insert = function insert(data, callback, errorCallback) {
    this._resetCache();
    const store = this._getStore();
    store.insert(this._prepareData(data)).done((data, key) => {
      store.push([{
        type: 'insert',
        key,
        data,
        internalChange: true
      }]);
      if (callback) {
        callback(data);
      }
      this._resetCache();
    }).fail(error => {
      if (errorCallback) {
        errorCallback(error);
      }
      this._resetCache();
    });
  };
  _proto.update = function update(key, data, callback, errorCallback) {
    const store = this._getStore();
    const storeKey = this._getStoreKey(store, key, data);
    store.update(storeKey, this._prepareData(data)).done((data, key) => {
      store.push([{
        type: 'update',
        key,
        data,
        internalChange: true
      }]);
      if (callback) {
        callback(key, data);
      }
    }).fail(error => {
      if (errorCallback) {
        errorCallback(error);
      }
    });
  };
  _proto.remove = function remove(key, data, callback, errorCallback) {
    this._resetCache();
    const store = this._getStore();
    const storeKey = this._getStoreKey(store, key, data);
    store.remove(storeKey).done(key => {
      store.push([{
        type: 'remove',
        key,
        internalChange: true
      }]);
      if (callback) {
        callback(key);
      }
      this._resetCache();
    }).fail(error => {
      if (errorCallback) {
        errorCallback(error);
      }
      this._resetCache();
    });
  };
  _proto.findItem = function findItem(itemKey) {
    if (!this._items) {
      return null;
    }
    return this._getItemByKey(itemKey);
  };
  _proto.getItems = function getItems() {
    return this._items;
  };
  _proto.hasItems = function hasItems() {
    return !!this._items;
  };
  _proto._reloadContentByChanges = function _reloadContentByChanges(changes, isExternalChanges) {
    changes = changes.map(change => (0, _extend.extend)(change, {
      internalKey: this._getInternalKey(change.key)
    }));
    this._diagramWidget._reloadContentByChanges(changes, isExternalChanges);
  };
  _proto._getItemByKey = function _getItemByKey(key) {
    this._ensureCache();
    const cache = this._cache;
    const index = this._getIndexByKey(key);
    return cache.items[index];
  };
  _proto._getIndexByKey = function _getIndexByKey(key) {
    this._ensureCache();
    const cache = this._cache;
    if (typeof key === 'object') {
      for (let i = 0, length = cache.keys.length; i < length; i++) {
        if (cache.keys[i] === key) return i;
      }
    } else {
      const keySet = cache.keySet || cache.keys.reduce((accumulator, key, index) => {
        accumulator[key] = index;
        return accumulator;
      }, {});
      if (!cache.keySet) {
        cache.keySet = keySet;
      }
      return keySet[key];
    }
    return -1;
  };
  _proto._ensureCache = function _ensureCache() {
    const cache = this._cache;
    if (!cache.keys) {
      cache.keys = [];
      cache.items = [];
      this._fillCache(cache, this._items);
    }
  };
  _proto._fillCache = function _fillCache(cache, items) {
    if (!items || !items.length) return;
    const keyExpr = this._getKeyExpr();
    if (keyExpr) {
      items.forEach(item => {
        cache.keys.push(keyExpr(item));
        cache.items.push(item);
      });
    }
    const itemsExpr = this._getItemsExpr();
    if (itemsExpr) {
      items.forEach(item => this._fillCache(cache, itemsExpr(item)));
    }
    const containerChildrenExpr = this._getContainerChildrenExpr();
    if (containerChildrenExpr) {
      items.forEach(item => this._fillCache(cache, containerChildrenExpr(item)));
    }
  };
  _proto._getKeyExpr = function _getKeyExpr() {
    throw 'Not Implemented';
  };
  _proto._getItemsExpr = function _getItemsExpr() {};
  _proto._getContainerChildrenExpr = function _getContainerChildrenExpr() {};
  _proto._initDataSource = function _initDataSource() {
    _ItemsOptionBase.prototype._initDataSource.call(this);
    this._dataSource && this._dataSource.paginate(false);
  };
  _proto._dataSourceOptions = function _dataSourceOptions() {
    return {
      paginate: false
    };
  };
  _proto._getStore = function _getStore() {
    return this._dataSource && this._dataSource.store();
  };
  _proto._getStoreKey = function _getStoreKey(store, internalKey, data) {
    let storeKey = store.keyOf(data);
    if (storeKey === data) {
      const keyExpr = this._getKeyExpr();
      this._dataSourceItems.forEach(item => {
        if (keyExpr(item) === internalKey) storeKey = item;
      });
    }
    return storeKey;
  };
  _proto._getInternalKey = function _getInternalKey(storeKey) {
    if (typeof storeKey === 'object') {
      const keyExpr = this._getKeyExpr();
      return keyExpr(storeKey);
    }
    return storeKey;
  };
  _proto._resetCache = function _resetCache() {
    this._cache = {};
  };
  return ItemsOption;
}(ItemsOptionBase);
var _default = exports.default = ItemsOption;
module.exports = exports.default;
module.exports.default = exports.default;
