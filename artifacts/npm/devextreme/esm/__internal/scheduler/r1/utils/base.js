/**
* DevExtreme (esm/__internal/scheduler/r1/utils/base.js)
* Version: 24.1.1
* Build date: Tue May 07 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import _extends from "@babel/runtime/helpers/esm/extends";
import { equalByValue } from '../../../../core/utils/common';
import dateUtils from '../../../../core/utils/date';
import { isDefined } from '../../../../core/utils/type';
import dateLocalization from '../../../../localization/date';
import { dateUtilsTs } from '../../../core/utils/date';
import { VERTICAL_GROUP_COUNT_CLASSES } from '../../m_classes';
import { VIEWS } from '../../m_constants';
import timeZoneUtils from '../../m_utils_time_zone';
import { HORIZONTAL_GROUP_ORIENTATION, TIMELINE_VIEWS, VERTICAL_GROUP_ORIENTATION } from '../const';
var toMs = dateUtils.dateToMilliseconds;
var DAY_HOURS = 24;
var HOUR_IN_MS = 1000 * 60 * 60;
var SATURDAY_INDEX = 6;
var SUNDAY_INDEX = 0;
var getDurationInHours = (startDate, endDate) => Math.floor((endDate.getTime() - startDate.getTime()) / toMs('hour'));
export var getDatesWithoutTime = (min, max) => {
  var newMin = dateUtils.trimTime(min);
  var newMax = dateUtils.trimTime(max);
  newMax.setDate(newMax.getDate() + 1);
  return [newMin, newMax];
};
export var getAppointmentRenderingStrategyName = viewType => {
  var appointmentRenderingStrategyMap = {
    day: {
      renderingStrategy: 'vertical'
    },
    week: {
      renderingStrategy: 'week'
    },
    workWeek: {
      renderingStrategy: 'week'
    },
    month: {
      renderingStrategy: 'horizontalMonth'
    },
    timelineDay: {
      renderingStrategy: 'horizontal'
    },
    timelineWeek: {
      renderingStrategy: 'horizontal'
    },
    timelineWorkWeek: {
      renderingStrategy: 'horizontal'
    },
    timelineMonth: {
      renderingStrategy: 'horizontalMonthLine'
    },
    agenda: {
      renderingStrategy: 'agenda'
    }
  };
  var {
    renderingStrategy
  } = appointmentRenderingStrategyMap[viewType];
  return renderingStrategy;
};
export var getAppointmentTakesAllDay = (appointmentAdapter, allDayPanelMode) => {
  var {
    startDate,
    endDate,
    allDay
  } = appointmentAdapter;
  switch (allDayPanelMode) {
    case 'hidden':
      return false;
    case 'allDay':
      return allDay;
    case 'all':
    default:
      if (allDay) {
        return true;
      }
      if (!isDefined(endDate)) {
        return false;
      }
      return getDurationInHours(startDate, endDate) >= DAY_HOURS;
  }
};
export var getAppointmentKey = geometry => {
  var {
    left,
    top,
    width,
    height
  } = geometry;
  return "".concat(left, "-").concat(top, "-").concat(width, "-").concat(height);
};
export var hasResourceValue = (resourceValues, itemValue) => isDefined(resourceValues.find(value => equalByValue(value, itemValue)));
export var getOverflowIndicatorColor = (color, colors) => !colors.length || colors.filter(item => item !== color).length === 0 ? color : undefined;
export var getVerticalGroupCountClass = groups => {
  switch (groups === null || groups === void 0 ? void 0 : groups.length) {
    case 1:
      return VERTICAL_GROUP_COUNT_CLASSES[0];
    case 2:
      return VERTICAL_GROUP_COUNT_CLASSES[1];
    case 3:
      return VERTICAL_GROUP_COUNT_CLASSES[2];
    default:
      return undefined;
  }
};
export var setOptionHour = (date, optionHour) => {
  var nextDate = new Date(date);
  if (!isDefined(optionHour)) {
    return nextDate;
  }
  nextDate.setHours(optionHour, optionHour % 1 * 60, 0, 0);
  return nextDate;
};
export var calculateDayDuration = (startDayHour, endDayHour) => endDayHour - startDayHour;
export var getStartViewDateTimeOffset = (startViewDate, startDayHour) => {
  var validStartDayHour = Math.floor(startDayHour);
  var isDSTChange = timeZoneUtils.isTimezoneChangeInDate(startViewDate);
  if (isDSTChange && validStartDayHour !== startViewDate.getHours()) {
    return dateUtils.dateToMilliseconds('hour');
  }
  return 0;
};
export var getValidCellDateForLocalTimeFormat = (date, _ref) => {
  var {
    startViewDate,
    startDayHour,
    cellIndexShift,
    viewOffset
  } = _ref;
  var originDate = dateUtilsTs.addOffsets(date, [-viewOffset]);
  var localTimeZoneChangedInOriginDate = timeZoneUtils.isTimezoneChangeInDate(originDate);
  if (!localTimeZoneChangedInOriginDate) {
    return date;
  }
  // NOTE: Shift the startViewDate by two days ahead because
  // we can have viewOffset equals -1/+1 day.
  // This strange method of changing date used here because
  // +2 days from DST date not affected by DST.
  var startViewDateWithoutDST = new Date(new Date(startViewDate).setDate(startViewDate.getDate() + 2));
  var startViewDateOffset = getStartViewDateTimeOffset(startViewDate, startDayHour);
  return dateUtilsTs.addOffsets(startViewDateWithoutDST, [viewOffset, cellIndexShift, -startViewDateOffset]);
};
export var getTotalCellCountByCompleteData = completeData => completeData[completeData.length - 1].length;
export var getDisplayedCellCount = (displayedCellCount, completeData) => displayedCellCount !== null && displayedCellCount !== void 0 ? displayedCellCount : getTotalCellCountByCompleteData(completeData);
export var getHeaderCellText = (headerIndex, date, headerCellTextFormat, getDateForHeaderText, additionalOptions) => {
  var validDate = getDateForHeaderText(headerIndex, date, additionalOptions);
  return dateLocalization.format(validDate, headerCellTextFormat);
};
export var isVerticalGroupingApplied = (groups, groupOrientation) => groupOrientation === VERTICAL_GROUP_ORIENTATION && !!groups.length;
export var getGroupCount = groups => {
  var result = 0;
  for (var i = 0, len = groups.length; i < len; i += 1) {
    if (!i) {
      result = groups[i].items.length;
    } else {
      result *= groups[i].items.length;
    }
  }
  return result;
};
export var getHorizontalGroupCount = (groups, groupOrientation) => {
  var groupCount = getGroupCount(groups) || 1;
  var isVerticalGrouping = isVerticalGroupingApplied(groups, groupOrientation);
  return isVerticalGrouping ? 1 : groupCount;
};
export var isTimelineView = viewType => !!TIMELINE_VIEWS[viewType];
export var isDateAndTimeView = viewType => viewType !== VIEWS.TIMELINE_MONTH && viewType !== VIEWS.MONTH;
export var isHorizontalView = viewType => {
  switch (viewType) {
    case VIEWS.TIMELINE_DAY:
    case VIEWS.TIMELINE_WEEK:
    case VIEWS.TIMELINE_WORK_WEEK:
    case VIEWS.TIMELINE_MONTH:
    case VIEWS.MONTH:
      return true;
    default:
      return false;
  }
};
export var isDateInRange = (date, startDate, endDate, diff) => diff > 0 ? dateUtils.dateInRange(date, startDate, new Date(endDate.getTime() - 1)) : dateUtils.dateInRange(date, endDate, startDate, 'date');
export var isFirstCellInMonthWithIntervalCount = (cellDate, intervalCount) => cellDate.getDate() === 1 && intervalCount > 1;
export var getViewStartByOptions = (startDate, currentDate, intervalDuration, startViewDate) => {
  if (!startDate) {
    return new Date(currentDate);
  }
  var currentStartDate = dateUtils.trimTime(startViewDate);
  var diff = currentStartDate.getTime() <= currentDate.getTime() ? 1 : -1;
  var endDate = new Date(currentStartDate.getTime() + intervalDuration * diff);
  while (!isDateInRange(currentDate, currentStartDate, endDate, diff)) {
    currentStartDate = endDate;
    endDate = new Date(currentStartDate.getTime() + intervalDuration * diff);
  }
  return diff > 0 ? currentStartDate : endDate;
};
export var calculateIsGroupedAllDayPanel = (groups, groupOrientation, isAllDayPanelVisible) => isVerticalGroupingApplied(groups, groupOrientation) && isAllDayPanelVisible;
export var calculateViewStartDate = startDateOption => startDateOption;
export var getCellDuration = (viewType, startDayHour, endDayHour, hoursInterval) => {
  switch (viewType) {
    case 'month':
      return calculateDayDuration(startDayHour, endDayHour) * 3600000;
    case 'timelineMonth':
      return dateUtils.dateToMilliseconds('day');
    default:
      return 3600000 * hoursInterval;
  }
};
export var calculateCellIndex = (rowIndex, columnIndex, rowCount) => columnIndex * rowCount + rowIndex;
export var getTotalRowCountByCompleteData = completeData => completeData.length;
export var getDisplayedRowCount = (displayedRowCount, completeData) => displayedRowCount !== null && displayedRowCount !== void 0 ? displayedRowCount : getTotalRowCountByCompleteData(completeData);
export var getStartViewDateWithoutDST = (startViewDate, startDayHour) => {
  var newStartViewDate = timeZoneUtils.getDateWithoutTimezoneChange(startViewDate);
  newStartViewDate.setHours(startDayHour);
  return newStartViewDate;
};
export var getIsGroupedAllDayPanel = (hasAllDayRow, isVerticalGrouping) => hasAllDayRow && isVerticalGrouping;
export var getKeyByGroup = (groupIndex, isVerticalGrouping) => {
  if (isVerticalGrouping && !!groupIndex) {
    return groupIndex.toString();
  }
  return '0';
};
export var getToday = (indicatorTime, timeZoneCalculator) => {
  var todayDate = indicatorTime !== null && indicatorTime !== void 0 ? indicatorTime : new Date();
  return (timeZoneCalculator === null || timeZoneCalculator === void 0 ? void 0 : timeZoneCalculator.createDate(todayDate, {
    path: 'toGrid'
  })) || todayDate;
};
export var getCalculatedFirstDayOfWeek = firstDayOfWeekOption => isDefined(firstDayOfWeekOption) ? firstDayOfWeekOption : dateLocalization.firstDayOfWeekIndex();
export var isHorizontalGroupingApplied = (groups, groupOrientation) => groupOrientation === HORIZONTAL_GROUP_ORIENTATION && !!groups.length;
export var isGroupingByDate = (groups, groupOrientation, groupByDate) => {
  var isHorizontalGrouping = isHorizontalGroupingApplied(groups, groupOrientation);
  return groupByDate && isHorizontalGrouping;
};
export var getSkippedHoursInRange = (startDate, endDate, allDay, viewDataProvider) => {
  var isAllDay = allDay && !viewDataProvider.viewType.includes('timeline');
  var result = 0;
  var currentDate = new Date(startDate);
  currentDate.setDate(currentDate.getDate() + 1);
  currentDate.setHours(0, 0, 0, 0);
  var endDateWithStartHour = new Date(endDate);
  endDateWithStartHour.setHours(0, 0, 0, 0);
  var {
    startDayHour,
    endDayHour
  } = viewDataProvider.getViewOptions();
  var dayHours = isAllDay ? DAY_HOURS : endDayHour - startDayHour;
  while (currentDate < endDateWithStartHour) {
    if (viewDataProvider.isSkippedDate(currentDate)) {
      result += dayHours;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  var startDateHours = startDate.getHours();
  var endDateHours = endDate.getHours() + Math.ceil(endDate.getTime() % HOUR_IN_MS);
  if (viewDataProvider.isSkippedDate(startDate)) {
    if (isAllDay) {
      result += DAY_HOURS;
    } else if (startDateHours < startDayHour) {
      result += dayHours;
    } else if (startDateHours < endDayHour) {
      result += endDayHour - startDateHours;
    }
  }
  if (viewDataProvider.isSkippedDate(endDate)) {
    if (isAllDay) {
      result += DAY_HOURS;
    } else if (endDateHours > endDayHour) {
      result += dayHours;
    } else if (endDateHours > startDayHour) {
      result += endDateHours - startDayHour;
    }
  }
  return result;
};
export var isDataOnWeekend = date => {
  var day = date.getDay();
  return day === SATURDAY_INDEX || day === SUNDAY_INDEX;
};
export var getWeekendsCount = days => 2 * Math.floor(days / 7);
export var extendGroupItemsForGroupingByDate = (groupRenderItems, columnCountPerGroup) => [...new Array(columnCountPerGroup)].reduce((currentGroupItems, _, index) => groupRenderItems.map((groupsRow, rowIndex) => {
  var currentRow = currentGroupItems[rowIndex] || [];
  return [...currentRow, ...groupsRow.map((item, columnIndex) => _extends(_extends({}, item), {
    key: "".concat(item.key, "_group_by_date_").concat(index),
    isFirstGroupCell: columnIndex === 0,
    isLastGroupCell: columnIndex === groupsRow.length - 1
  }))];
}), []);
export var getGroupPanelData = (groups, columnCountPerGroup, groupByDate, baseColSpan) => {
  var repeatCount = 1;
  var groupPanelItems = groups.map(group => {
    var result = [];
    var {
      name: resourceName,
      items,
      data
    } = group;
    var _loop = function _loop(iterator) {
      result.push(...items.map((_ref2, index) => {
        var {
          id,
          text,
          color
        } = _ref2;
        return {
          id,
          text,
          color,
          key: "".concat(iterator, "_").concat(resourceName, "_").concat(id),
          resourceName,
          data: data === null || data === void 0 ? void 0 : data[index]
        };
      }));
    };
    for (var iterator = 0; iterator < repeatCount; iterator += 1) {
      _loop(iterator);
    }
    repeatCount *= items.length;
    return result;
  });
  if (groupByDate) {
    groupPanelItems = extendGroupItemsForGroupingByDate(groupPanelItems, columnCountPerGroup);
  }
  return {
    groupPanelItems,
    baseColSpan
  };
};
export var splitNumber = (value, splitValue) => Array.from({
  length: Math.ceil(value / splitValue)
}, (_, index) => Math.min(value - splitValue * index, splitValue));
