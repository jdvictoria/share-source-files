/**
* DevExtreme (cjs/renovation/ui/scroll_view/utils/get_scrollbar_size.js)
* Version: 24.1.1
* Build date: Tue May 07 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.getScrollbarSize = getScrollbarSize;
function getScrollbarSize(element, direction) {
  if (direction === 'vertical') {
    return element.offsetWidth - element.clientWidth;
  }
  return element.offsetHeight - element.clientHeight;
}
