/**
* DevExtreme (esm/__internal/scheduler/workspaces/m_work_space_week.js)
* Version: 24.1.1
* Build date: Tue May 07 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import registerComponent from '../../../core/component_registrator';
import { weekUtils } from '../../scheduler/r1/utils/index';
import { VIEWS } from '../m_constants';
import SchedulerWorkSpaceVertical from './m_work_space_vertical';
var WEEK_CLASS = 'dx-scheduler-work-space-week';
class SchedulerWorkSpaceWeek extends SchedulerWorkSpaceVertical {
  get type() {
    return VIEWS.WEEK;
  }
  _getElementClass() {
    return WEEK_CLASS;
  }
  _calculateViewStartDate() {
    return weekUtils.calculateViewStartDate(this.option('startDate'), this._firstDayOfWeek());
  }
}
registerComponent('dxSchedulerWorkSpaceWeek', SchedulerWorkSpaceWeek);
export default SchedulerWorkSpaceWeek;
