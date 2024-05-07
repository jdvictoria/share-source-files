/**
* DevExtreme (cjs/ui/html_editor/matchers/wordLists.js)
* Version: 24.1.1
* Build date: Tue May 07 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

exports.default = void 0;
function getListType(matches) {
  const prefix = matches[1];
  return prefix.match(/\S+\./) ? 'ordered' : 'bullet';
}
function getIndent(node, msStyleAttributeName) {
  const style = node.getAttribute(msStyleAttributeName);
  if (style) {
    const level = style.replace(/\n+/g, '').match(/level(\d+)/);
    return level ? level[1] - 1 : 0;
  } else {
    return false;
  }
}
function removeNewLineChar(operations) {
  const newLineOperation = operations[operations.length - 1];
  newLineOperation.insert = newLineOperation.insert.trim();
}
const getMatcher = quill => {
  const Delta = quill.import('delta');
  const msStyleAttributeName = quill.MS_LIST_DATA_KEY;
  return (node, delta) => {
    const ops = delta.ops.slice();
    const insertOperation = ops[0];
    insertOperation.insert = insertOperation.insert.replace(/^\s+/, '');
    const listDecoratorMatches = insertOperation.insert.match(/^(\S+)\s+/);
    const indent = listDecoratorMatches && getIndent(node, msStyleAttributeName);
    if (!listDecoratorMatches || indent === false) {
      return delta;
    }
    insertOperation.insert = insertOperation.insert.substring(listDecoratorMatches[0].length, insertOperation.insert.length);
    removeNewLineChar(ops);
    ops.push({
      insert: '\n',
      attributes: {
        list: getListType(listDecoratorMatches),
        indent
      }
    });
    return new Delta(ops);
  };
};
var _default = exports.default = getMatcher;
module.exports = exports.default;
module.exports.default = exports.default;
