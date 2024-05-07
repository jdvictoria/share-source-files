/**
* DevExtreme (esm/__internal/grids/data_grid/m_utils.js)
* Version: 24.1.1
* Build date: Tue May 07 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
// @ts-expect-error
import { normalizeSortingInfo } from '../../../data/utils';
import gridCoreUtils from '../../grids/grid_core/m_utils';
export function createGroupFilter(path, storeLoadOptions) {
  var groups = normalizeSortingInfo(storeLoadOptions.group);
  var filter = [];
  for (var i = 0; i < path.length; i++) {
    filter.push([groups[i].selector, '=', path[i]]);
  }
  if (storeLoadOptions.filter) {
    filter.push(storeLoadOptions.filter);
  }
  return gridCoreUtils.combineFilters(filter);
}
