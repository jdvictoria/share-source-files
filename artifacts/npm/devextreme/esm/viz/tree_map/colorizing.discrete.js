/**
* DevExtreme (esm/viz/tree_map/colorizing.discrete.js)
* Version: 24.1.1
* Build date: Tue May 07 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
function discreteColorizer(options, themeManager, root) {
  var palette = themeManager.createPalette(options.palette, {
    useHighlight: true,
    extensionMode: options.paletteExtensionMode,
    count: options.colorizeGroups ? getNodesCount(root) : getLeafsCount(root)
  });
  return (options.colorizeGroups ? discreteGroupColorizer : discreteLeafColorizer)(palette, root);
}
function getLeafsCount(root) {
  var allNodes = root.nodes.slice();
  var i;
  var ii = allNodes.length;
  var count = 0;
  var node;
  for (i = 0; i < ii; ++i) {
    node = allNodes[i];
    if (node.isNode()) {
      count = Math.max(count, getLeafsCount(node));
    } else {
      count += 1;
    }
  }
  return count;
}
function discreteLeafColorizer(palette) {
  var colors = palette.generateColors();
  return function (node) {
    return colors[node.index];
  };
}
function getNodesCount(root) {
  var allNodes = root.nodes.slice();
  var i;
  var ii = allNodes.length;
  var count = 0;
  var node;
  for (i = 0; i < ii; ++i) {
    node = allNodes[i];
    if (node.isNode()) {
      count += getNodesCount(node) + 1;
    }
  }
  return count;
}
function prepareDiscreteGroupColors(palette, root) {
  var colors = {};
  var allNodes = root.nodes.slice();
  var i;
  var ii = allNodes.length;
  var node;
  for (i = 0; i < ii; ++i) {
    node = allNodes[i];
    if (node.isNode()) {
      allNodes = allNodes.concat(node.nodes);
      ii = allNodes.length;
    } else if (!colors[node.parent._id]) {
      colors[node.parent._id] = palette.getNextColor();
    }
  }
  return colors;
}
function discreteGroupColorizer(palette, root) {
  var colors = prepareDiscreteGroupColors(palette, root);
  return function (node) {
    return colors[node._id];
  };
}
import { addColorizer } from './colorizing';
addColorizer('discrete', discreteColorizer);
export default discreteColorizer;
