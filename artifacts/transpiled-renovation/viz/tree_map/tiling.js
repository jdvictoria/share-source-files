"use strict";

exports.addAlgorithm = addAlgorithm;
exports.buildSidesData = buildSidesData;
exports.calculateRectangles = calculateRectangles;
exports.getAlgorithm = getAlgorithm;
exports.getStaticSideIndex = void 0;
exports.setDefaultAlgorithm = setDefaultAlgorithm;
var _type = require("../../core/utils/type");
var _utils = require("../core/utils");
const _round = Math.round;
const algorithms = {};
let defaultAlgorithm;
function getAlgorithm(value) {
  return algorithms[(0, _utils.normalizeEnum)(value)] || (0, _type.isFunction)(value) && value || defaultAlgorithm;
}
function addAlgorithm(name, callback) {
  algorithms[name] = callback;
}
function setDefaultAlgorithm(name) {
  defaultAlgorithm = algorithms[name];
}
const directionToIndexOffsets = {};
directionToIndexOffsets[-1] = [2, 0];
directionToIndexOffsets[+1] = [0, 2];
const getStaticSideIndex = function (rect) {
  return rect[2] - rect[0] < rect[3] - rect[1] ? 0 : 1;
};
exports.getStaticSideIndex = getStaticSideIndex;
function buildSidesData(rect, directions, _staticSideIndex) {
  const staticSideIndex = _staticSideIndex !== undefined ? _staticSideIndex : getStaticSideIndex(rect);
  const variedSideIndex = 1 - staticSideIndex;
  const staticSideDirection = directions[staticSideIndex];
  const variedSideDirection = directions[variedSideIndex];
  const staticSideIndexOffsets = directionToIndexOffsets[staticSideDirection];
  const variedSideIndexOffsets = directionToIndexOffsets[variedSideDirection];
  return {
    staticSide: rect[2 + staticSideIndex] - rect[staticSideIndex],
    variedSide: rect[2 + variedSideIndex] - rect[variedSideIndex],
    static1: staticSideIndex + staticSideIndexOffsets[0],
    static2: staticSideIndex + staticSideIndexOffsets[1],
    varied1: variedSideIndex + variedSideIndexOffsets[0],
    varied2: variedSideIndex + variedSideIndexOffsets[1],
    staticDir: staticSideDirection,
    variedDir: variedSideDirection
  };
}
function calculateRectangles(nodes, head, totalRect, sidesData, rowData) {
  let i;
  let ii;
  const variedSidePart = [0, 0, 0, 0];
  const static1 = sidesData.static1;
  const static2 = sidesData.static2;
  let position = totalRect[static1];
  const dir = sidesData.staticDir;
  let side = sidesData.staticSide;
  let sum = rowData.sum;
  let rect;
  let delta;
  variedSidePart[sidesData.varied1] = totalRect[sidesData.varied1];
  variedSidePart[sidesData.varied2] = totalRect[sidesData.varied1] + sidesData.variedDir * rowData.side;
  for (i = head, ii = head + rowData.count; i < ii; ++i) {
    rect = variedSidePart.slice();
    rect[static1] = position;
    delta = _round(side * nodes[i].value / sum) || 0;
    sum -= nodes[i].value;
    side -= delta;
    position += dir * delta;
    rect[static2] = position;
    nodes[i].rect = rect;
  }
  totalRect[sidesData.varied1] = variedSidePart[sidesData.varied2];
}