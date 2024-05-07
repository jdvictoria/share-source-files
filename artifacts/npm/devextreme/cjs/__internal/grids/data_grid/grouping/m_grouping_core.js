/**
* DevExtreme (cjs/__internal/grids/data_grid/grouping/m_grouping_core.js)
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
exports.GroupingHelper = void 0;
exports.createOffsetFilter = createOffsetFilter;
var _renderer = _interopRequireDefault(require("../../../../core/renderer"));
var _deferred = require("../../../../core/utils/deferred");
var _utils = require("../../../../data/utils");
var _m_core = _interopRequireDefault(require("../m_core"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// @ts-expect-error

function createOffsetFilter(path, storeLoadOptions, lastLevelOnly) {
  const groups = (0, _utils.normalizeSortingInfo)(storeLoadOptions.group);
  let filter = [];
  for (let i = lastLevelOnly ? path.length - 1 : 0; i < path.length; i++) {
    const filterElement = [];
    for (let j = 0; j <= i; j++) {
      const {
        selector
      } = groups[j];
      if (i === j && (path[j] === null || path[j] === false || path[j] === true)) {
        if (path[j] === false) {
          filterElement.push([selector, '=', groups[j].desc ? true : null]);
        } else if (path[j] ? !groups[j].desc : groups[j].desc) {
          filterElement.push([selector, '<>', path[j]]);
        } else {
          filterElement.push([selector, '<>', null]);
          filterElement.push([selector, '=', null]);
        }
      } else {
        const currentFilter = [selector, i === j ? groups[j].desc ? '>' : '<' : '=', path[j]];
        if (currentFilter[1] === '<') {
          filterElement.push([currentFilter, 'or', [selector, '=', null]]);
        } else {
          filterElement.push(currentFilter);
        }
      }
    }
    filter.push(_m_core.default.combineFilters(filterElement));
  }
  filter = _m_core.default.combineFilters(filter, 'or');
  return _m_core.default.combineFilters([filter, storeLoadOptions.filter]);
}
const findGroupInfoByKey = function (groupsInfo, key) {
  const {
    hash
  } = groupsInfo;
  return hash && hash[JSON.stringify(key)];
};
const getGroupInfoIndexByOffset = function (groupsInfo, offset) {
  let leftIndex = 0;
  let rightIndex = groupsInfo.length - 1;
  if (!groupsInfo.length) {
    return 0;
  }
  do {
    const middleIndex = rightIndex + leftIndex >> 1;
    if (groupsInfo[middleIndex].offset > offset) {
      rightIndex = middleIndex;
    } else {
      leftIndex = middleIndex;
    }
  } while (rightIndex - leftIndex > 1);
  let index;
  for (index = leftIndex; index <= rightIndex; index++) {
    if (groupsInfo[index].offset > offset) {
      break;
    }
  }
  return index;
};
const cleanGroupsInfo = function (groupsInfo, groupIndex, groupsCount) {
  for (let i = 0; i < groupsInfo.length; i++) {
    if (groupIndex + 1 >= groupsCount) {
      groupsInfo[i].children = [];
    } else {
      cleanGroupsInfo(groupsInfo[i].children, groupIndex + 1, groupsCount);
    }
  }
};
const calculateItemsCount = function (that, items, groupsCount) {
  let result = 0;
  if (items) {
    if (!groupsCount) {
      result = items.length;
    } else {
      for (let i = 0; i < items.length; i++) {
        if (that.isGroupItemCountable(items[i])) {
          result++;
        }
        result += calculateItemsCount(that, items[i].items, groupsCount - 1);
      }
    }
  }
  return result;
};
let GroupingHelper = exports.GroupingHelper = /*#__PURE__*/function () {
  function GroupingHelper(dataSourceAdapter) {
    this._dataSource = dataSourceAdapter;
    this.reset();
  }
  var _proto = GroupingHelper.prototype;
  _proto.reset = function reset() {
    this._groupsInfo = [];
    this._totalCountCorrection = 0;
  };
  _proto.totalCountCorrection = function totalCountCorrection() {
    return this._totalCountCorrection;
  };
  _proto.updateTotalItemsCount = function updateTotalItemsCount(totalCountCorrection) {
    this._totalCountCorrection = totalCountCorrection || 0;
  };
  _proto.isGroupItemCountable = function isGroupItemCountable(item) {
    return !this._isVirtualPaging() || !item.isContinuation;
  };
  _proto._isVirtualPaging = function _isVirtualPaging() {
    const scrollingMode = this._dataSource.option('scrolling.mode');
    return scrollingMode === 'virtual' || scrollingMode === 'infinite';
  };
  _proto.itemsCount = function itemsCount() {
    const dataSourceAdapter = this._dataSource;
    const dataSource = dataSourceAdapter._dataSource;
    const groupCount = _m_core.default.normalizeSortingInfo(dataSource.group() || []).length;
    const itemsCount = calculateItemsCount(this, dataSource.items(), groupCount);
    return itemsCount;
  };
  _proto.foreachGroups = function foreachGroups(callback, childrenAtFirst, foreachCollapsedGroups, updateOffsets, updateParentOffsets) {
    const that = this;
    function foreachGroupsCore(groupsInfo, callback, childrenAtFirst, parents) {
      const callbackResults = [];
      function executeCallback(callback, data, parents, callbackResults) {
        const callbackResult = data && callback(data, parents);
        callbackResult && callbackResults.push(callbackResult);
        return callbackResult;
      }
      for (let i = 0; i < groupsInfo.length; i++) {
        parents.push(groupsInfo[i].data);
        if (!childrenAtFirst && executeCallback(callback, groupsInfo[i].data, parents, callbackResults) === false) {
          return false;
        }
        if (!groupsInfo[i].data || groupsInfo[i].data.isExpanded || foreachCollapsedGroups) {
          const {
            children
          } = groupsInfo[i];
          const callbackResult = children.length && foreachGroupsCore(children, callback, childrenAtFirst, parents);
          callbackResult && callbackResults.push(callbackResult);
          if (callbackResult === false) {
            return false;
          }
        }
        if (childrenAtFirst && executeCallback(callback, groupsInfo[i].data, parents, callbackResults) === false) {
          return false;
        }
        if (!groupsInfo[i].data || groupsInfo[i].data.offset !== groupsInfo[i].offset) {
          updateOffsets = true;
        }
        parents.pop();
      }
      const currentParents = updateParentOffsets && parents.slice(0);
      return updateOffsets && _deferred.when.apply(_renderer.default, callbackResults).always(() => {
        that._updateGroupInfoOffsets(groupsInfo, currentParents);
      });
    }
    return foreachGroupsCore(that._groupsInfo, callback, childrenAtFirst, []);
  };
  _proto._updateGroupInfoOffsets = function _updateGroupInfoOffsets(groupsInfo, parents) {
    parents = parents || [];
    for (let index = 0; index < groupsInfo.length; index++) {
      const groupInfo = groupsInfo[index];
      if (groupInfo.data && groupInfo.data.offset !== groupInfo.offset) {
        groupInfo.offset = groupInfo.data.offset;
        for (let parentIndex = 0; parentIndex < parents.length; parentIndex++) {
          parents[parentIndex].offset = groupInfo.offset;
        }
      }
    }
    groupsInfo.sort((a, b) => a.offset - b.offset);
  };
  _proto.findGroupInfo = function findGroupInfo(path) {
    const that = this;
    let groupInfo;
    let groupsInfo = that._groupsInfo;
    for (let pathIndex = 0; groupsInfo && pathIndex < path.length; pathIndex++) {
      groupInfo = findGroupInfoByKey(groupsInfo, path[pathIndex]);
      groupsInfo = groupInfo && groupInfo.children;
    }
    return groupInfo && groupInfo.data;
  };
  _proto.addGroupInfo = function addGroupInfo(groupInfoData) {
    const that = this;
    let groupInfo;
    const {
      path
    } = groupInfoData;
    let groupsInfo = that._groupsInfo;
    for (let pathIndex = 0; pathIndex < path.length; pathIndex++) {
      groupInfo = findGroupInfoByKey(groupsInfo, path[pathIndex]);
      if (!groupInfo) {
        groupInfo = {
          key: path[pathIndex],
          offset: groupInfoData.offset,
          data: {
            offset: groupInfoData.offset,
            isExpanded: true,
            path: path.slice(0, pathIndex + 1)
          },
          children: []
        };
        const index = getGroupInfoIndexByOffset(groupsInfo, groupInfoData.offset);
        groupsInfo.splice(index, 0, groupInfo);
        groupsInfo.hash = groupsInfo.hash || {};
        groupsInfo.hash[JSON.stringify(groupInfo.key)] = groupInfo;
      }
      if (pathIndex === path.length - 1) {
        groupInfo.data = groupInfoData;
        if (groupInfo.offset !== groupInfoData.offset) {
          that._updateGroupInfoOffsets(groupsInfo);
        }
      }
      groupsInfo = groupInfo.children;
    }
  };
  _proto.allowCollapseAll = function allowCollapseAll() {
    return true;
  };
  _proto.refresh = function refresh(options) {
    const that = this;
    const {
      storeLoadOptions
    } = options;
    const groups = (0, _utils.normalizeSortingInfo)(storeLoadOptions.group || []);
    const oldGroups = '_group' in that ? (0, _utils.normalizeSortingInfo)(that._group || []) : groups;
    let groupsCount = Math.min(oldGroups.length, groups.length);
    that._group = storeLoadOptions.group;
    for (let groupIndex = 0; groupIndex < groupsCount; groupIndex++) {
      if (oldGroups[groupIndex].selector !== groups[groupIndex].selector) {
        groupsCount = groupIndex;
        break;
      }
    }
    if (!groupsCount) {
      that.reset();
    } else {
      cleanGroupsInfo(that._groupsInfo, 0, groupsCount);
    }
  };
  _proto.handleDataLoading = function handleDataLoading() {};
  _proto.handleDataLoaded = function handleDataLoaded(options, callBase) {
    callBase(options);
  };
  _proto.handleDataLoadedCore = function handleDataLoadedCore(options, callBase) {
    callBase(options);
  };
  return GroupingHelper;
}();
