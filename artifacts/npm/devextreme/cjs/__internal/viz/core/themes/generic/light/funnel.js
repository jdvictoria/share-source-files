/**
* DevExtreme (cjs/__internal/viz/core/themes/generic/light/funnel.js)
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
var _contants = require("./contants");
var _default = exports.default = {
  funnel: {
    sortData: true,
    valueField: 'val',
    colorField: 'color',
    argumentField: 'arg',
    hoverEnabled: true,
    selectionMode: 'single',
    item: {
      border: {
        visible: false,
        width: 2,
        color: _contants.WHITE
      },
      hoverStyle: {
        hatching: {
          opacity: 0.75,
          step: 6,
          width: 2,
          direction: _contants.RIGHT
        },
        border: {}
      },
      selectionStyle: {
        hatching: {
          opacity: 0.5,
          step: 6,
          width: 2,
          direction: _contants.RIGHT
        },
        border: {}
      }
    },
    title: {
      margin: 10
    },
    adaptiveLayout: {
      width: 80,
      height: 80,
      keepLabels: true
    },
    legend: {
      visible: false
    },
    _rtl: {
      legend: {
        itemTextPosition: _contants.LEFT
      }
    },
    tooltip: {
      customizeTooltip(info) {
        return {
          text: "".concat(info.item.argument, " ").concat(info.valueText)
        };
      }
    },
    inverted: false,
    algorithm: 'dynamicSlope',
    neckWidth: 0,
    neckHeight: 0,
    resolveLabelOverlapping: 'shift',
    label: {
      textOverflow: 'ellipsis',
      wordWrap: 'normal',
      visible: true,
      horizontalAlignment: _contants.RIGHT,
      horizontalOffset: 0,
      verticalOffset: 0,
      showForZeroValues: false,
      customizeText(info) {
        return "".concat(info.item.argument, " ").concat(info.valueText);
      },
      position: 'columns',
      font: {
        color: _contants.WHITE
      },
      border: {
        visible: false,
        width: 1,
        color: _contants.LIGHT_GREY,
        dashStyle: _contants.SOLID
      },
      connector: {
        visible: true,
        width: 1,
        opacity: 0.5
      }
    }
  }
};
