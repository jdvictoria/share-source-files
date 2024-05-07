"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ViewDataGeneratorTimelineMonth = void 0;
var _date = _interopRequireDefault(require("../../../../core/utils/date"));
var _index = require("../../../scheduler/r1/utils/index");
var _m_utils_time_zone = _interopRequireDefault(require("../../m_utils_time_zone"));
var _m_view_data_generator = require("./m_view_data_generator");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
const toMs = _date.default.dateToMilliseconds;
let ViewDataGeneratorTimelineMonth = exports.ViewDataGeneratorTimelineMonth = /*#__PURE__*/function (_ViewDataGenerator) {
  _inheritsLoose(ViewDataGeneratorTimelineMonth, _ViewDataGenerator);
  function ViewDataGeneratorTimelineMonth() {
    return _ViewDataGenerator.apply(this, arguments) || this;
  }
  var _proto = ViewDataGeneratorTimelineMonth.prototype;
  _proto._calculateCellIndex = function _calculateCellIndex(rowIndex, columnIndex, rowCount, columnCount) {
    return _index.monthUtils.calculateCellIndex(rowIndex, columnIndex, rowCount, columnCount);
  };
  _proto.calculateEndDate = function calculateEndDate(startDate, interval, endDayHour) {
    return (0, _index.setOptionHour)(startDate, endDayHour);
  };
  _proto.getInterval = function getInterval() {
    return toMs('day');
  };
  _proto._calculateStartViewDate = function _calculateStartViewDate(options) {
    return _index.timelineMonthUtils.calculateStartViewDate(options.currentDate, options.startDayHour, options.startDate, options.intervalCount);
  };
  _proto.getCellCount = function getCellCount(options) {
    const {
      intervalCount
    } = options;
    const currentDate = new Date(options.currentDate);
    let cellCount = 0;
    for (let i = 1; i <= intervalCount; i++) {
      cellCount += new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 0).getDate();
    }
    return cellCount;
  };
  _proto.setHiddenInterval = function setHiddenInterval() {
    this.hiddenInterval = 0;
  };
  _proto.getCellEndDate = function getCellEndDate(cellStartDate, options) {
    const {
      startDayHour,
      endDayHour
    } = options;
    const durationMs = (endDayHour - startDayHour) * toMs('hour');
    return _m_utils_time_zone.default.addOffsetsWithoutDST(cellStartDate, durationMs);
  };
  return ViewDataGeneratorTimelineMonth;
}(_m_view_data_generator.ViewDataGenerator);