/**
* DevExtreme (esm/viz/vector_map/vector_map.utils.js)
* Version: 24.1.1
* Build date: Tue May 07 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
var nextDataKey = 1;
export function generateDataKey() {
  return 'vectormap-data-' + nextDataKey++;
}
