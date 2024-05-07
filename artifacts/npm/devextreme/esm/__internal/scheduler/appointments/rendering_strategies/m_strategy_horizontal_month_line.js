/**
* DevExtreme (esm/__internal/scheduler/appointments/rendering_strategies/m_strategy_horizontal_month_line.js)
* Version: 24.1.1
* Build date: Tue May 07 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import dateUtils from '../../../../core/utils/date';
import query from '../../../../data/query';
import { sortAppointmentsByStartDate } from '../data_provider/m_utils';
import HorizontalAppointmentsStrategy from './m_strategy_horizontal';
var HOURS_IN_DAY = 24;
var MINUTES_IN_HOUR = 60;
var MILLISECONDS_IN_MINUTE = 60000;
var ZERO_APPOINTMENT_DURATION_IN_DAYS = 1;
class HorizontalMonthLineRenderingStrategy extends HorizontalAppointmentsStrategy {
  calculateAppointmentWidth(_, position) {
    var {
      startDate: startDateWithTime,
      normalizedEndDate
    } = position.info.appointment;
    var startDate = dateUtils.trimTime(startDateWithTime);
    var cellWidth = this.cellWidth || this.getAppointmentMinSize();
    var duration = Math.ceil(this._getDurationInDays(startDate, normalizedEndDate));
    var width = this.cropAppointmentWidth(duration * cellWidth, cellWidth);
    if (this.isVirtualScrolling) {
      var skippedDays = this.viewDataProvider.getSkippedDaysCount(position.groupIndex, startDate, normalizedEndDate, duration);
      width -= skippedDays * cellWidth;
    }
    return width;
  }
  _columnCondition(a, b) {
    var conditions = this._getConditions(a, b);
    return conditions.rowCondition || conditions.columnCondition || conditions.cellPositionCondition;
  }
  _getDurationInDays(startDate, endDate) {
    var adjustedDuration = this._adjustDurationByDaylightDiff(endDate.getTime() - startDate.getTime(), startDate, endDate);
    return adjustedDuration / dateUtils.dateToMilliseconds('day') || ZERO_APPOINTMENT_DURATION_IN_DAYS;
  }
  getDeltaTime(args, initialSize) {
    return HOURS_IN_DAY * MINUTES_IN_HOUR * MILLISECONDS_IN_MINUTE * this._getDeltaWidth(args, initialSize);
  }
  isAllDay() {
    return false;
  }
  createTaskPositionMap(items, skipSorting) {
    if (!skipSorting) {
      sortAppointmentsByStartDate(items, this.dataAccessors);
    }
    return super.createTaskPositionMap(items);
  }
  _getSortedPositions(map, skipSorting) {
    var result = super._getSortedPositions(map);
    if (!skipSorting) {
      result = query(result).sortBy('top').thenBy('left').thenBy('cellPosition').thenBy('i').toArray();
    }
    return result;
  }
  needCorrectAppointmentDates() {
    return false;
  }
  getPositionShift(timeShift) {
    return {
      top: 0,
      left: 0,
      cellPosition: timeShift * this.cellWidth
    };
  }
}
export default HorizontalMonthLineRenderingStrategy;
