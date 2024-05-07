/**
* DevExtreme (cjs/__internal/grids/grid_core/data_source_adapter/m_data_source_adapter.js)
* Version: 24.1.1
* Build date: Tue May 07 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _callbacks = _interopRequireDefault(require("../../../../core/utils/callbacks"));
var _common = require("../../../../core/utils/common");
var _deferred = require("../../../../core/utils/deferred");
var _extend = require("../../../../core/utils/extend");
var _iterator = require("../../../../core/utils/iterator");
var _type = require("../../../../core/utils/type");
var _array_store = _interopRequireDefault(require("../../../../data/array_store"));
var _array_utils = require("../../../../data/array_utils");
var _m_modules = _interopRequireDefault(require("../m_modules"));
var _m_utils = _interopRequireDefault(require("../m_utils"));
var _m_data_source_adapter_utils = require("./m_data_source_adapter_utils");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); } /* eslint-disable @typescript-eslint/no-dynamic-delete */ // @ts-expect-error
let DataSourceAdapter = exports.default = /*#__PURE__*/function (_modules$Controller) {
  _inheritsLoose(DataSourceAdapter, _modules$Controller);
  function DataSourceAdapter() {
    return _modules$Controller.apply(this, arguments) || this;
  }
  var _proto = DataSourceAdapter.prototype;
  _proto.init = function init(dataSource, remoteOperations) {
    const that = this;
    that._dataSource = dataSource;
    that._remoteOperations = remoteOperations || {};
    that._isLastPage = !dataSource.isLastPage();
    that._hasLastPage = false;
    that._currentTotalCount = 0;
    that._cachedData = (0, _m_data_source_adapter_utils.createEmptyCachedData)();
    that._lastOperationTypes = {};
    that._eventsStrategy = dataSource._eventsStrategy;
    that._totalCountCorrection = 0;
    that._isLoadingAll = false;
    that.changed = (0, _callbacks.default)();
    that.loadingChanged = (0, _callbacks.default)();
    that.loadError = (0, _callbacks.default)();
    that.customizeStoreLoadOptions = (0, _callbacks.default)();
    that.changing = (0, _callbacks.default)();
    that.pushed = (0, _callbacks.default)();
    that._dataChangedHandler = that._handleDataChanged.bind(that);
    that._customizeStoreLoadOptionsHandler = that._handleCustomizeStoreLoadOptions.bind(that);
    that._dataLoadedHandler = that._handleDataLoaded.bind(that);
    that._loadingChangedHandler = that._handleLoadingChanged.bind(that);
    that._loadErrorHandler = that._handleLoadError.bind(that);
    that._pushHandler = that._handlePush.bind(that);
    that._changingHandler = that._handleChanging.bind(that);
    dataSource.on('changed', that._dataChangedHandler);
    dataSource.on('customizeStoreLoadOptions', that._customizeStoreLoadOptionsHandler);
    dataSource.on('customizeLoadResult', that._dataLoadedHandler);
    dataSource.on('loadingChanged', that._loadingChangedHandler);
    dataSource.on('loadError', that._loadErrorHandler);
    dataSource.on('changing', that._changingHandler);
    dataSource.store().on('beforePush', that._pushHandler);
    (0, _iterator.each)(dataSource, (memberName, member) => {
      if (!that[memberName] && (0, _type.isFunction)(member)) {
        that[memberName] = function () {
          return this._dataSource[memberName].apply(this._dataSource, arguments);
        };
      }
    });
  };
  _proto.dispose = function dispose(isSharedDataSource) {
    const that = this;
    const dataSource = that._dataSource;
    const store = dataSource.store();
    dataSource.off('changed', that._dataChangedHandler);
    dataSource.off('customizeStoreLoadOptions', that._customizeStoreLoadOptionsHandler);
    dataSource.off('customizeLoadResult', that._dataLoadedHandler);
    dataSource.off('loadingChanged', that._loadingChangedHandler);
    dataSource.off('loadError', that._loadErrorHandler);
    dataSource.off('changing', that._changingHandler);
    store && store.off('beforePush', that._pushHandler);
    if (!isSharedDataSource) {
      dataSource.dispose();
    }
  }
  /**
   * @extended: TreeLists's data_source_adapter
   */;
  _proto.remoteOperations = function remoteOperations() {
    return this._remoteOperations;
  }
  /**
   * @extended: virtual_scrolling
   */;
  _proto.refresh = function refresh(options, operationTypes) {
    const that = this;
    const dataSource = that._dataSource;
    if (operationTypes.reload) {
      that.resetCurrentTotalCount();
      that._isLastPage = !dataSource.paginate();
      that._hasLastPage = that._isLastPage;
    }
  };
  _proto.resetCurrentTotalCount = function resetCurrentTotalCount() {
    this._currentTotalCount = 0;
    this._totalCountCorrection = 0;
  };
  _proto.resetCache = function resetCache() {
    this._cachedStoreData = undefined;
    this._cachedPagingData = undefined;
  }
  /**
   * @extended: virtual_scrolling
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ;
  _proto.resetPagesCache = function resetPagesCache(isLiveUpdate) {
    this._cachedData = (0, _m_data_source_adapter_utils.createEmptyCachedData)();
  };
  _proto._needClearStoreDataCache = function _needClearStoreDataCache() {
    const remoteOperations = this.remoteOperations();
    const operationTypes = (0, _m_data_source_adapter_utils.calculateOperationTypes)(this._lastLoadOptions || {}, {});
    const isLocalOperations = Object.keys(remoteOperations).every(operationName => !operationTypes[operationName] || !remoteOperations[operationName]);
    return !isLocalOperations;
  };
  _proto.push = function push(changes, fromStore) {
    const store = this.store();
    if (this._needClearStoreDataCache()) {
      this._cachedStoreData = undefined;
    }
    this._cachedPagingData = undefined;
    this.resetPagesCache(true);
    if (this._cachedStoreData) {
      // @ts-expect-error
      (0, _array_utils.applyBatch)({
        keyInfo: store,
        data: this._cachedStoreData,
        changes
      });
    }
    if (!fromStore) {
      this._applyBatch(changes);
    }
    this.pushed.fire(changes);
  };
  _proto.getDataIndexGetter = function getDataIndexGetter() {
    if (!this._dataIndexGetter) {
      let indexByKey;
      let storeData;
      const store = this.store();
      this._dataIndexGetter = data => {
        const isCacheUpdated = storeData && storeData !== this._cachedStoreData;
        if (!indexByKey || isCacheUpdated) {
          storeData = this._cachedStoreData || [];
          indexByKey = {};
          for (let i = 0; i < storeData.length; i++) {
            indexByKey[(0, _common.getKeyHash)(store.keyOf(storeData[i]))] = i;
          }
        }
        return indexByKey[(0, _common.getKeyHash)(store.keyOf(data))];
      };
    }
    return this._dataIndexGetter;
  }
  /**
   * @extended: TreeLists's data_source_adapter
   */;
  _proto._getKeyInfo = function _getKeyInfo() {
    return this.store();
  }
  /**
   * @extended: TreeLists's data_source_adapter
   */;
  _proto._needToCopyDataObject = function _needToCopyDataObject() {
    return true;
  }
  /**
   * @extended: TreeLists's data_source_adapter
   */;
  _proto._applyBatch = function _applyBatch(changes, fromStore) {
    const keyInfo = this._getKeyInfo();
    const dataSource = this._dataSource;
    const groupCount = _m_utils.default.normalizeSortingInfo(this.group()).length;
    const isReshapeMode = this.option('editing.refreshMode') === 'reshape';
    const isVirtualMode = this.option('scrolling.mode') === 'virtual';
    changes = changes.filter(change => !dataSource.paginate() || change.type !== 'insert' || change.index !== undefined);
    const getItemCount = () => groupCount ? this.itemsCount() : this.items().length;
    const oldItemCount = getItemCount();
    // @ts-expect-error
    (0, _array_utils.applyBatch)({
      keyInfo,
      data: this._items,
      changes,
      groupCount,
      useInsertIndex: true,
      skipCopying: !this._needToCopyDataObject()
    });
    // @ts-expect-error
    (0, _array_utils.applyBatch)({
      keyInfo,
      data: dataSource.items(),
      changes,
      groupCount,
      useInsertIndex: true,
      skipCopying: !this._needToCopyDataObject()
    });
    const needUpdateTotalCountCorrection = this._currentTotalCount > 0 || (fromStore || !isReshapeMode) && isVirtualMode;
    if (needUpdateTotalCountCorrection) {
      this._totalCountCorrection += getItemCount() - oldItemCount;
    }
    changes.splice(0, changes.length);
  }
  /**
   * @extended: TreeLists's data_source_adapter
   */;
  _proto._handlePush = function _handlePush(_ref) {
    let {
      changes
    } = _ref;
    this.push(changes, true);
  };
  _proto._handleChanging = function _handleChanging(e) {
    this.changing.fire(e);
    this._applyBatch(e.changes, true);
  };
  _proto._needCleanCacheByOperation = function _needCleanCacheByOperation(operationType, remoteOperations) {
    const operationTypesByOrder = ['filtering', 'sorting', 'paging'];
    const operationTypeIndex = operationTypesByOrder.indexOf(operationType);
    const currentOperationTypes = operationTypeIndex >= 0 ? operationTypesByOrder.slice(operationTypeIndex) : [operationType];
    return currentOperationTypes.some(operationType => remoteOperations[operationType]);
  }
  /**
   * @extended: virtual_scrolling, TreeLists's data_source_adapter, DataGrid's m_grouping
   */;
  _proto._customizeRemoteOperations = function _customizeRemoteOperations(options, operationTypes) {
    let cachedStoreData = this._cachedStoreData;
    let cachedPagingData = this._cachedPagingData;
    let cachedData = this._cachedData;
    if (options.storeLoadOptions.filter && !options.remoteOperations.filtering || options.storeLoadOptions.sort && !options.remoteOperations.sorting) {
      options.remoteOperations = {
        filtering: options.remoteOperations.filtering,
        summary: options.remoteOperations.summary
      };
    }
    if (operationTypes.fullReload) {
      cachedStoreData = undefined;
      cachedPagingData = undefined;
      cachedData = (0, _m_data_source_adapter_utils.createEmptyCachedData)();
    } else {
      if (operationTypes.reload) {
        cachedPagingData = undefined;
        cachedData = (0, _m_data_source_adapter_utils.createEmptyCachedData)();
      } else if (operationTypes.groupExpanding) {
        cachedData = (0, _m_data_source_adapter_utils.createEmptyCachedData)();
      }
      (0, _iterator.each)(operationTypes, (operationType, value) => {
        if (value && this._needCleanCacheByOperation(operationType, options.remoteOperations)) {
          cachedStoreData = undefined;
          cachedPagingData = undefined;
        }
      });
    }
    if (cachedPagingData) {
      options.remoteOperations.paging = false;
    }
    options.cachedStoreData = cachedStoreData;
    options.cachedPagingData = cachedPagingData;
    options.cachedData = cachedData;
    if (!options.isCustomLoading) {
      this._cachedStoreData = cachedStoreData;
      this._cachedPagingData = cachedPagingData;
      this._cachedData = cachedData;
    }
  };
  _proto._handleCustomizeStoreLoadOptions = function _handleCustomizeStoreLoadOptions(options) {
    var _a;
    this._handleDataLoading(options);
    if (!(((_a = options.data) === null || _a === void 0 ? void 0 : _a.length) === 0)) {
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      options.data = (0, _m_data_source_adapter_utils.getPageDataFromCache)(options, true) || options.cachedStoreData;
    }
  }
  /**
   * @extended: virtual_scrolling
   */;
  _proto._handleDataLoading = function _handleDataLoading(options) {
    const dataSource = this._dataSource;
    const lastLoadOptions = this._lastLoadOptions;
    this.customizeStoreLoadOptions.fire(options);
    options.delay = this.option('loadingTimeout');
    options.originalStoreLoadOptions = options.storeLoadOptions;
    options.remoteOperations = (0, _extend.extend)({}, this.remoteOperations());
    const isFullReload = !this.isLoaded() && !this._isRefreshing;
    if (this.option('integrationOptions.renderedOnServer') && !this.isLoaded()) {
      options.delay = undefined;
    }
    const loadOptions = (0, _extend.extend)({
      pageIndex: this.pageIndex(),
      pageSize: this.pageSize()
    }, options.storeLoadOptions);
    const operationTypes = (0, _m_data_source_adapter_utils.calculateOperationTypes)(loadOptions, lastLoadOptions, isFullReload);
    this._customizeRemoteOperations(options, operationTypes);
    if (!options.isCustomLoading) {
      const isRefreshing = this._isRefreshing;
      options.pageIndex = dataSource.pageIndex();
      options.lastLoadOptions = loadOptions;
      options.operationTypes = operationTypes;
      this._loadingOperationTypes = operationTypes;
      this._isRefreshing = true;
      (0, _deferred.when)(isRefreshing || this._isRefreshed || this.refresh(options, operationTypes)).done(() => {
        if (this._lastOperationId === options.operationId) {
          this._isRefreshed = true;
          this.load().always(() => {
            this._isRefreshed = false;
          });
        }
      }).fail(() => {
        dataSource.cancel(options.operationId);
      }).always(() => {
        this._isRefreshing = false;
      });
      dataSource.cancel(this._lastOperationId);
      this._lastOperationId = options.operationId;
      if (this._isRefreshing) {
        dataSource.cancel(this._lastOperationId);
      }
    }
    this._handleDataLoadingCore(options);
  };
  _proto._handleDataLoadingCore = function _handleDataLoadingCore(options) {
    const {
      remoteOperations
    } = options;
    options.loadOptions = {};
    const cachedExtra = options.cachedData.extra;
    const localLoadOptionNames = {
      filter: !remoteOperations.filtering,
      sort: !remoteOperations.sorting,
      group: !remoteOperations.grouping,
      summary: !remoteOperations.summary,
      skip: !remoteOperations.paging,
      take: !remoteOperations.paging,
      requireTotalCount: cachedExtra && 'totalCount' in cachedExtra || !remoteOperations.paging,
      langParams: !remoteOperations.filtering || !remoteOperations.sorting
    };
    (0, _iterator.each)(options.storeLoadOptions, (optionName, optionValue) => {
      if (localLoadOptionNames[optionName]) {
        options.loadOptions[optionName] = optionValue;
        delete options.storeLoadOptions[optionName];
      }
    });
    if (cachedExtra) {
      options.extra = cachedExtra;
    }
  }
  /**
   * @extended: TreeLists's data_source_adapter
   */;
  _proto._handleDataLoaded = function _handleDataLoaded(options) {
    var _a, _b;
    const {
      loadOptions
    } = options;
    const localPaging = options.remoteOperations && !options.remoteOperations.paging;
    const {
      cachedData
    } = options;
    const {
      storeLoadOptions
    } = options;
    const needCache = this.option('cacheEnabled') !== false && storeLoadOptions;
    const needPageCache = needCache && !options.isCustomLoading && cachedData && (!localPaging || storeLoadOptions.group);
    const needPagingCache = needCache && localPaging;
    const needStoreCache = needPagingCache && !options.isCustomLoading;
    if (!loadOptions) {
      this._dataSource.cancel(options.operationId);
      return;
    }
    if (localPaging) {
      options.skip = loadOptions.skip;
      options.take = loadOptions.take;
      delete loadOptions.skip;
      delete loadOptions.take;
    }
    if (loadOptions.group) {
      loadOptions.group = options.group || loadOptions.group;
    }
    const groupCount = _m_utils.default.normalizeSortingInfo(options.group || storeLoadOptions.group || loadOptions.group).length;
    if (options.cachedDataPartBegin) {
      options.data = options.cachedDataPartBegin.concat(options.data);
    }
    if (options.cachedDataPartEnd) {
      options.data = options.data.concat(options.cachedDataPartEnd);
    }
    if (!needPageCache || !(0, _m_data_source_adapter_utils.getPageDataFromCache)(options)) {
      if (needPagingCache && options.cachedPagingData) {
        options.data = (0, _m_data_source_adapter_utils.cloneItems)(options.cachedPagingData, groupCount);
      } else {
        if (needStoreCache) {
          if (!this._cachedStoreData) {
            this._cachedStoreData = (0, _m_data_source_adapter_utils.cloneItems)(options.data, _m_utils.default.normalizeSortingInfo(storeLoadOptions.group).length);
          } else if (options.mergeStoreLoadData) {
            options.data = this._cachedStoreData = this._cachedStoreData.concat(options.data);
          }
        }
        // @ts-expect-error
        new _array_store.default(options.data).load(loadOptions).done(data => {
          options.data = data;
          if (needStoreCache) {
            this._cachedPagingData = (0, _m_data_source_adapter_utils.cloneItems)(options.data, groupCount);
          }
        }).fail(error => {
          // @ts-expect-error
          options.data = new _deferred.Deferred().reject(error);
        });
      }
      if (loadOptions.requireTotalCount && localPaging) {
        options.extra = (0, _type.isPlainObject)(options.extra) ? options.extra : {};
        options.extra.totalCount = options.data.length;
      }
      if (options.extra && options.extra.totalCount >= 0 && (storeLoadOptions.requireTotalCount === false || loadOptions.requireTotalCount === false)) {
        options.extra.totalCount = -1;
      }
      if (!loadOptions.data && (storeLoadOptions.requireTotalCount || ((_b = (_a = options.extra) === null || _a === void 0 ? void 0 : _a.totalCount) !== null && _b !== void 0 ? _b : -1) >= 0)) {
        this._totalCountCorrection = 0;
      }
      this._handleDataLoadedCore(options);
      if (needPageCache) {
        cachedData.extra = cachedData.extra || (0, _extend.extend)({}, options.extra);
        (0, _deferred.when)(options.data).done(data => {
          (0, _m_data_source_adapter_utils.setPageDataToCache)(options, data, groupCount);
        });
      }
    }
    (0, _deferred.when)(options.data).done(() => {
      if (options.lastLoadOptions) {
        this._lastLoadOptions = options.lastLoadOptions;
        Object.keys(options.operationTypes).forEach(operationType => {
          this._lastOperationTypes[operationType] = this._lastOperationTypes[operationType] || options.operationTypes[operationType];
        });
      }
    });
    options.storeLoadOptions = options.originalStoreLoadOptions;
  }
  /**
   * @extended: TreeLists's data_source_adapter
   */;
  _proto._handleDataLoadedCore = function _handleDataLoadedCore(options) {
    if (options.remoteOperations && !options.remoteOperations.paging && Array.isArray(options.data)) {
      if (options.skip !== undefined) {
        options.data = options.data.slice(options.skip);
      }
      if (options.take !== undefined) {
        options.data = options.data.slice(0, options.take);
      }
    }
  }
  /**
   * @extended virtual_scrolling
   */;
  _proto._handleLoadingChanged = function _handleLoadingChanged(isLoading) {
    this.loadingChanged.fire(isLoading);
  }
  /**
   * @extended virtual_scrolling
   */;
  _proto._handleLoadError = function _handleLoadError(error) {
    this.loadError.fire(error);
    this.changed.fire({
      changeType: 'loadError',
      error
    });
  }
  /**
   * @extended: virtual_scrolling
   */;
  _proto._loadPageSize = function _loadPageSize() {
    return this.pageSize();
  }
  /**
   * @extended: virtual_scrolling
   */;
  _proto._handleDataChanged = function _handleDataChanged(args) {
    let currentTotalCount;
    const dataSource = this._dataSource;
    let isLoading = false;
    const isDataLoading = !args || (0, _type.isDefined)(args.changeType);
    const itemsCount = this.itemsCount();
    if (isDataLoading) {
      this._isLastPage = !itemsCount || !this._loadPageSize() || itemsCount < this._loadPageSize();
      if (this._isLastPage) {
        this._hasLastPage = true;
      }
    }
    if (dataSource.totalCount() >= 0) {
      if (dataSource.pageIndex() >= this.pageCount()) {
        dataSource.pageIndex(this.pageCount() - 1);
        this.pageIndex(dataSource.pageIndex());
        this.resetPagesCache();
        dataSource.load();
        isLoading = true;
      }
    } else if (isDataLoading) {
      currentTotalCount = dataSource.pageIndex() * this.pageSize() + itemsCount;
      if (currentTotalCount > this._currentTotalCount) {
        this._currentTotalCount = currentTotalCount;
        if (dataSource.pageIndex() === 0 || !this.option('scrolling.legacyMode')) {
          this._totalCountCorrection = 0;
        }
      }
      if (itemsCount === 0 && dataSource.pageIndex() >= this.pageCount()) {
        dataSource.pageIndex(this.pageCount() - 1);
        if (this.option('scrolling.mode') !== 'infinite') {
          dataSource.load();
          isLoading = true;
        }
      }
    }
    if (!isLoading) {
      this._operationTypes = this._lastOperationTypes;
      this._lastOperationTypes = {};
      this.component._optionCache = {};
      this.changed.fire(args);
      this.component._optionCache = undefined;
    }
  };
  _proto._scheduleCustomLoadCallbacks = function _scheduleCustomLoadCallbacks(deferred) {
    const that = this;
    that._isCustomLoading = true;
    deferred.always(() => {
      that._isCustomLoading = false;
    });
  };
  _proto.loadingOperationTypes = function loadingOperationTypes() {
    return this._loadingOperationTypes;
  };
  _proto.operationTypes = function operationTypes() {
    return this._operationTypes;
  };
  _proto.lastLoadOptions = function lastLoadOptions() {
    return this._lastLoadOptions || {};
  };
  _proto.isLastPage = function isLastPage() {
    return this._isLastPage;
  }
  /**
   * @extended: virtual_scrolling
   */;
  _proto._dataSourceTotalCount = function _dataSourceTotalCount() {
    return this._dataSource.totalCount();
  }
  /**
   * @extended: virtual_scrolling, TreeLists's data_source_adapter
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ;
  _proto._changeRowExpandCore = function _changeRowExpandCore(path) {}
  /**
   * @extended: TreeLists's data_source_adapter
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ;
  _proto.changeRowExpand = function changeRowExpand(path) {};
  _proto.totalCount = function totalCount() {
    // eslint-disable-next-line radix
    return parseInt((this._currentTotalCount || this._dataSourceTotalCount()) + this._totalCountCorrection);
  };
  _proto.totalCountCorrection = function totalCountCorrection() {
    return this._totalCountCorrection;
  }
  /**
   * @extended: virtual_scrolling
   * @protected
   */;
  _proto.items = function items() {}
  /**
   * @extended: virtual_scrolling
   */;
  _proto.itemsCount = function itemsCount() {
    return this._dataSource.items().length;
  }
  /**
   * @extended: TreeLists's data_source_adapter
   */;
  _proto.totalItemsCount = function totalItemsCount() {
    return this.totalCount();
  };
  _proto.pageSize = function pageSize() {
    const dataSource = this._dataSource;
    if (!arguments.length && !dataSource.paginate()) {
      return 0;
    }
    return dataSource.pageSize.apply(dataSource, arguments);
  };
  _proto.pageCount = function pageCount() {
    const that = this;
    const count = that.totalItemsCount() - that._totalCountCorrection;
    const pageSize = that.pageSize();
    if (pageSize && count > 0) {
      return Math.max(1, Math.ceil(count / pageSize));
    }
    return 1;
  };
  _proto.hasKnownLastPage = function hasKnownLastPage() {
    return this._hasLastPage || this._dataSource.totalCount() >= 0;
  };
  _proto.loadFromStore = function loadFromStore(loadOptions, store) {
    const dataSource = this._dataSource;
    // @ts-expect-error
    const d = new _deferred.Deferred();
    if (!dataSource) return;
    store = store || dataSource.store();
    store.load(loadOptions).done((data, extra) => {
      if (data && !Array.isArray(data) && Array.isArray(data.data)) {
        extra = data;
        data = data.data;
      }
      d.resolve(data, extra);
    }).fail(d.reject);
    return d;
  };
  _proto.isCustomLoading = function isCustomLoading() {
    return !!this._isCustomLoading;
  }
  /**
   * @extended: virtual_scrolling
   */;
  _proto.load = function load(options) {
    const that = this;
    const dataSource = that._dataSource;
    // @ts-expect-error
    const d = new _deferred.Deferred();
    if (options) {
      const store = dataSource.store();
      const dataSourceLoadOptions = dataSource.loadOptions();
      const loadResult = {
        storeLoadOptions: (0, _extend.extend)({}, options, {
          langParams: dataSourceLoadOptions === null || dataSourceLoadOptions === void 0 ? void 0 : dataSourceLoadOptions.langParams
        }),
        isCustomLoading: true
      };
      (0, _iterator.each)(store._customLoadOptions() || [], (_, optionName) => {
        if (!(optionName in loadResult.storeLoadOptions)) {
          loadResult.storeLoadOptions[optionName] = dataSourceLoadOptions[optionName];
        }
      });
      this._isLoadingAll = options.isLoadingAll;
      that._scheduleCustomLoadCallbacks(d);
      dataSource._scheduleLoadCallbacks(d);
      that._handleCustomizeStoreLoadOptions(loadResult);
      (0, _m_data_source_adapter_utils.executeTask)(() => {
        if (!dataSource.store()) {
          return d.reject('canceled');
        }
        (0, _deferred.when)(loadResult.data || that.loadFromStore(loadResult.storeLoadOptions)).done((data, extra) => {
          loadResult.data = data;
          loadResult.extra = extra || {};
          that._handleDataLoaded(loadResult);
          if (options.requireTotalCount && loadResult.extra.totalCount === undefined) {
            loadResult.extra.totalCount = store.totalCount(loadResult.storeLoadOptions);
          }
          // TODO map function??
          (0, _deferred.when)(loadResult.data, loadResult.extra.totalCount).done((data, totalCount) => {
            loadResult.extra.totalCount = totalCount;
            d.resolve(data, loadResult.extra);
          }).fail(d.reject);
        }).fail(d.reject);
      }, that.option('loadingTimeout'));
      return d.fail(function () {
        that._eventsStrategy.fireEvent('loadError', arguments);
      }).always(() => {
        this._isLoadingAll = false;
      }).promise();
    }
    return dataSource.load();
  }
  /**
   * @extended: virtual_scrolling
   */;
  _proto.reload = function reload(full) {
    return full ? this._dataSource.reload() : this._dataSource.load();
  };
  _proto.getCachedStoreData = function getCachedStoreData() {
    return this._cachedStoreData;
  }
  /**
   * @exended: virtual_scrolling
   */;
  _proto.isLoaded = function isLoaded() {}
  /**
   * @extended: virtual_scrolling
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ;
  _proto.pageIndex = function pageIndex(_pageIndex) {};
  return DataSourceAdapter;
}(_m_modules.default.Controller);
