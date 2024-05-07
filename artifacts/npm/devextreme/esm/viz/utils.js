/**
* DevExtreme (esm/viz/utils.js)
* Version: 24.1.1
* Build date: Tue May 07 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import _extends from "@babel/runtime/helpers/esm/extends";
import { refreshPaths } from './core/renderers/renderer';
import { each as _each } from '../core/utils/iterator';
var {
  floor
} = Math;
export var prepareSegmentRectPoints = function prepareSegmentRectPoints(left, top, width, height, borderOptions) {
  var maxSW = ~~((width < height ? width : height) / 2);
  var sw = borderOptions.width || 0;
  var newSW = sw < maxSW ? sw : maxSW;
  left = left + newSW / 2;
  top = top + newSW / 2;
  width = width - newSW;
  height = height - newSW;
  var right = left + width;
  var bottom = top + height;
  var points = [];
  var segments = [];
  var segmentSequence;
  var visiblyOpt = 0;
  var prevSegmentVisibility = 0;
  var allSegment = {
    top: [[left, top], [right, top]],
    right: [[right, top], [right, bottom]],
    bottom: [[right, bottom], [left, bottom]],
    left: [[left, bottom], [left, top]]
  };
  _each(allSegment, function (seg) {
    var visibility = !!borderOptions[seg];
    visiblyOpt = visiblyOpt * 2 + ~~visibility;
  });
  switch (visiblyOpt) {
    case 13:
    case 9:
      segmentSequence = ['left', 'top', 'right', 'bottom'];
      break;
    case 11:
      segmentSequence = ['bottom', 'left', 'top', 'right'];
      break;
    default:
      segmentSequence = ['top', 'right', 'bottom', 'left'];
  }
  _each(segmentSequence, function (_, seg) {
    var segmentVisibility = !!borderOptions[seg];
    if (!prevSegmentVisibility && segments.length) {
      points.push(segments);
      segments = [];
    }
    if (segmentVisibility) {
      _each(allSegment[seg].slice(prevSegmentVisibility), function (_, segment) {
        segments = segments.concat(segment);
      });
    }
    prevSegmentVisibility = ~~segmentVisibility;
  });
  segments.length && points.push(segments);
  points.length === 1 && (points = points[0]);
  return {
    points: points,
    pathType: visiblyOpt === 15 ? 'area' : 'line'
  };
};
export { refreshPaths };
export var areCanvasesDifferent = function areCanvasesDifferent(canvas1, canvas2) {
  var sizeChangingThreshold = 1;
  var sizeLessThreshold = ['width', 'height'].every(key => Math.abs(canvas1[key] - canvas2[key]) < sizeChangingThreshold);
  var canvasCoordsIsEqual = ['left', 'right', 'top', 'bottom'].every(key => canvas1[key] === canvas2[key]);
  return !(sizeLessThreshold && canvasCoordsIsEqual);
};
export var floorCanvasDimensions = function floorCanvasDimensions(canvas) {
  return _extends({}, canvas, {
    height: floor(canvas.height),
    width: floor(canvas.width)
  });
};