/**
* DevExtreme (cjs/__internal/grids/data_grid/m_aggregate_calculator.js)
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
var _data = require("../../../core/utils/data");
var _type = require("../../../core/utils/type");
var _errors = require("../../../data/errors");
var _utils = require("../../../data/utils");
// @ts-expect-error

// @ts-expect-error

function depthFirstSearch(i, depth, root, callback) {
  let j = 0;
  if (i < depth) {
    for (; j < root.items.length; j++) {
      depthFirstSearch(i + 1, depth, root.items[j], callback);
    }
  }
  if (i === depth) {
    callback(root);
  }
}
// NOTE: https://github.com/jquery/jquery/blame/master/src/core.js#L392
function map(array, callback) {
  let i;
  if ('map' in array) {
    return array.map(callback);
  }
  const result = new Array(array.length);
  // eslint-disable-next-line no-restricted-syntax, guard-for-in
  for (i in array) {
    result[i] = callback(array[i], i);
  }
  return result;
}
function isEmpty(x) {
  return x !== x || x === '' || x === null || x === undefined;
}
function isCount(aggregator) {
  return aggregator === _utils.aggregators.count;
}
function normalizeAggregate(aggregate) {
  const selector = (0, _data.compileGetter)(aggregate.selector);
  const skipEmptyValues = 'skipEmptyValues' in aggregate ? aggregate.skipEmptyValues : true;
  let {
    aggregator
  } = aggregate;
  if (typeof aggregator === 'string') {
    aggregator = _utils.aggregators[aggregator];
    if (!aggregator) {
      throw _errors.errors.Error('E4001', aggregate.aggregator);
    }
  }
  return {
    selector,
    aggregator,
    skipEmptyValues
  };
}
let AggregateCalculator = exports.default = /*#__PURE__*/function () {
  function AggregateCalculator(options) {
    this._data = options.data;
    this._groupLevel = options.groupLevel || 0;
    this._totalAggregates = map(options.totalAggregates || [], normalizeAggregate);
    this._groupAggregates = map(options.groupAggregates || [], normalizeAggregate);
    this._totals = [];
  }
  var _proto = AggregateCalculator.prototype;
  _proto.calculate = function calculate() {
    if (this._totalAggregates.length) {
      this._calculateTotals(0, {
        items: this._data
      });
    }
    if (this._groupAggregates.length && this._groupLevel > 0) {
      this._calculateGroups({
        items: this._data
      });
    }
  };
  _proto.totalAggregates = function totalAggregates() {
    return this._totals;
  };
  _proto._aggregate = function _aggregate(aggregates, data, container) {
    const length = data.items ? data.items.length : 0;
    for (let i = 0; i < aggregates.length; i++) {
      if (isCount(aggregates[i].aggregator)) {
        container[i] = (container[i] || 0) + length;
        continue;
      }
      for (let j = 0; j < length; j++) {
        this._accumulate(i, aggregates[i], container, data.items[j]);
      }
    }
  };
  _proto._calculateTotals = function _calculateTotals(level, data) {
    if (level === 0) {
      this._totals = this._seed(this._totalAggregates);
    }
    if (level === this._groupLevel) {
      this._aggregate(this._totalAggregates, data, this._totals);
    } else {
      for (let i = 0; i < data.items.length; i++) {
        this._calculateTotals(level + 1, data.items[i]);
      }
    }
    if (level === 0) {
      this._totals = this._finalize(this._totalAggregates, this._totals);
    }
  };
  _proto._calculateGroups = function _calculateGroups(root) {
    const maxLevel = this._groupLevel;
    let currentLevel = maxLevel + 1;
    const seedFn = this._seed.bind(this, this._groupAggregates);
    const stepFn = this._aggregate.bind(this, this._groupAggregates);
    const finalizeFn = this._finalize.bind(this, this._groupAggregates);
    function aggregator(node) {
      node.aggregates = seedFn(currentLevel - 1);
      if (currentLevel === maxLevel) {
        stepFn(node, node.aggregates);
      } else {
        depthFirstSearch(currentLevel, maxLevel, node, innerNode => {
          stepFn(innerNode, node.aggregates);
        });
      }
      node.aggregates = finalizeFn(node.aggregates);
    }
    while (--currentLevel > 0) {
      depthFirstSearch(0, currentLevel, root, aggregator);
    }
  };
  _proto._seed = function _seed(aggregates, groupIndex) {
    return map(aggregates, aggregate => {
      const {
        aggregator
      } = aggregate;
      const seed = 'seed' in aggregator ? (0, _type.isFunction)(aggregator.seed) ? aggregator.seed(groupIndex) : aggregator.seed : NaN;
      return seed;
    });
  };
  _proto._accumulate = function _accumulate(aggregateIndex, aggregate, results, item) {
    const value = aggregate.selector(item);
    const {
      aggregator
    } = aggregate;
    const {
      skipEmptyValues
    } = aggregate;
    if (skipEmptyValues && isEmpty(value)) {
      return;
    }
    if (results[aggregateIndex] !== results[aggregateIndex]) {
      results[aggregateIndex] = value;
    } else {
      results[aggregateIndex] = aggregator.step(results[aggregateIndex], value);
    }
  };
  _proto._finalize = function _finalize(aggregates, results) {
    return map(aggregates, (aggregate, index) => {
      const fin = aggregate.aggregator.finalize;
      return fin ? fin(results[index]) : results[index];
    });
  };
  return AggregateCalculator;
}();
