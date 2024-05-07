/**
* DevExtreme (cjs/renovation/ui/responsive_box/screen_utils.js)
* Version: 24.1.1
* Build date: Tue May 07 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.convertToScreenSizeQualifier = void 0;
const convertToScreenSizeQualifier = width => {
  if (width < 768) {
    return 'xs';
  }
  if (width < 992) {
    return 'sm';
  }
  if (width < 1200) {
    return 'md';
  }
  return 'lg';
};
exports.convertToScreenSizeQualifier = convertToScreenSizeQualifier;
