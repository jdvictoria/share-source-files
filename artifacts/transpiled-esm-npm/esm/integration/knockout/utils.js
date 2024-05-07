// eslint-disable-next-line no-restricted-imports
import ko from 'knockout';
import $ from '../../core/renderer';
export var getClosestNodeWithContext = node => {
  var context = ko.contextFor(node);
  if (!context && node.parentNode) {
    return getClosestNodeWithContext(node.parentNode);
  }
  return node;
};
export var getClosestNodeWithKoCreation = node => {
  var $el = $(node);
  var data = $el.data();
  var hasFlag = data && data['dxKoCreation'];
  if (hasFlag) {
    return node;
  }
  if (node.parentNode) {
    return getClosestNodeWithKoCreation(node.parentNode);
  }
  return null;
};