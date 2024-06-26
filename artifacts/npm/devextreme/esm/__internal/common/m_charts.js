/**
* DevExtreme (esm/__internal/common/m_charts.js)
* Version: 24.1.1
* Build date: Tue May 07 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import _extends from "@babel/runtime/helpers/esm/extends";
import { getNextDefsSvgId } from '../../viz/core/utils';
var graphicObjects = {};
export var registerPattern = options => {
  var id = getNextDefsSvgId();
  graphicObjects[id] = _extends({
    type: 'pattern'
  }, options);
  return id;
};
export var registerGradient = (type, options) => {
  var id = getNextDefsSvgId();
  graphicObjects[id] = _extends({
    type
  }, options);
  return id;
};
var getGraphicObjects = () => graphicObjects;
export default {
  getGraphicObjects
};
