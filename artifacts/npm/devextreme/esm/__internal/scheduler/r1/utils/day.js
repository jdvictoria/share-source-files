/**
* DevExtreme (esm/__internal/scheduler/r1/utils/day.js)
* Version: 24.1.1
* Build date: Tue May 07 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import { getViewStartByOptions, setOptionHour } from './base';
export var calculateStartViewDate = (currentDate, startDayHour, startDate, intervalDuration) => {
  var firstViewDate = getViewStartByOptions(startDate, currentDate, intervalDuration, startDate);
  return setOptionHour(firstViewDate, startDayHour);
};
