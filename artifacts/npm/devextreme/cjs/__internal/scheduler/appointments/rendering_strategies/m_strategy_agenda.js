/**
* DevExtreme (cjs/__internal/scheduler/appointments/rendering_strategies/m_strategy_agenda.js)
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
var _date = _interopRequireDefault(require("../../../../core/utils/date"));
var _iterator = require("../../../../core/utils/iterator");
var _m_appointment_adapter = require("../../m_appointment_adapter");
var _m_expression_utils = require("../../m_expression_utils");
var _m_utils = require("../../resources/m_utils");
var _m_utils2 = require("../data_provider/m_utils");
var _m_strategy_base = _interopRequireDefault(require("./m_strategy_base"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
let AgendaRenderingStrategy = /*#__PURE__*/function (_BaseRenderingStrateg) {
  _inheritsLoose(AgendaRenderingStrategy, _BaseRenderingStrateg);
  function AgendaRenderingStrategy() {
    return _BaseRenderingStrateg.apply(this, arguments) || this;
  }
  var _proto = AgendaRenderingStrategy.prototype;
  _proto.getAppointmentMinSize = function getAppointmentMinSize() {};
  _proto.getDeltaTime = function getDeltaTime() {};
  _proto.keepAppointmentSettings = function keepAppointmentSettings() {
    return true;
  };
  _proto.getAppointmentGeometry = function getAppointmentGeometry(geometry) {
    return geometry;
  };
  _proto.groupAppointmentByResources = function groupAppointmentByResources(appointments) {
    const groups = this.instance._getCurrentViewOption('groups');
    const config = {
      loadedResources: this.options.loadedResources,
      resources: this.options.resources,
      dataAccessors: this.dataAccessors.resources
    };
    return (0, _m_utils.groupAppointmentsByResources)(config, appointments, groups);
  };
  _proto.createTaskPositionMap = function createTaskPositionMap(appointments) {
    let height;
    let appointmentsByResources;
    this.calculateRows(appointments, this.agendaDuration, this.currentDate);
    if (appointments.length) {
      height = this.instance.fire('getAgendaVerticalStepHeight');
      appointmentsByResources = this.groupAppointmentByResources(appointments);
      let groupedAppts = [];
      (0, _iterator.each)(appointmentsByResources, (i, appts) => {
        let additionalAppointments = [];
        let recurrentIndexes = [];
        (0, _iterator.each)(appts, (index, appointment) => {
          const recurrenceBatch = this.instance.getAppointmentsInstance()._processRecurrenceAppointment(appointment, index);
          let appointmentBatch = null;
          if (!recurrenceBatch.indexes.length) {
            appointmentBatch = this.instance.getAppointmentsInstance()._processLongAppointment(appointment);
            additionalAppointments = additionalAppointments.concat(appointmentBatch.parts);
          }
          additionalAppointments = additionalAppointments.concat(recurrenceBatch.parts);
          recurrentIndexes = recurrentIndexes.concat(recurrenceBatch.indexes);
        });
        this.instance.getAppointmentsInstance()._reduceRecurrenceAppointments(recurrentIndexes, appts);
        this.instance.getAppointmentsInstance()._combineAppointments(appts, additionalAppointments);
        groupedAppts = groupedAppts.concat(appts);
      });
      Array.prototype.splice.apply(appointments, [0, appointments.length].concat(groupedAppts));
    }
    const result = [];
    let sortedIndex = 0;
    appointments.forEach((appt, index) => {
      result.push([{
        height,
        width: '100%',
        sortedIndex: sortedIndex++,
        groupIndex: this._calculateGroupIndex(index, appointmentsByResources),
        agendaSettings: appt.settings
      }]);
      delete appt.settings;
    });
    return result;
  };
  _proto._calculateGroupIndex = function _calculateGroupIndex(apptIndex, appointmentsByResources) {
    let resultInd;
    let counter = 0;
    // eslint-disable-next-line
    for (const i in appointmentsByResources) {
      const countApptInGroup = appointmentsByResources[i].length;
      if (apptIndex >= counter && apptIndex < counter + countApptInGroup) {
        resultInd = Number(i);
        break;
      }
      counter += countApptInGroup;
    }
    return resultInd;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ;
  _proto._getDeltaWidth = function _getDeltaWidth(args, initialSize) {};
  _proto._getAppointmentMaxWidth = function _getAppointmentMaxWidth() {
    return this.cellWidth;
  };
  _proto._needVerifyItemSize = function _needVerifyItemSize() {
    return false;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ;
  _proto._getAppointmentParts = function _getAppointmentParts(geometry, settings) {};
  _proto._reduceMultiWeekAppointment = function _reduceMultiWeekAppointment() {};
  _proto.calculateAppointmentHeight = function calculateAppointmentHeight() {
    return 0;
  };
  _proto.calculateAppointmentWidth = function calculateAppointmentWidth() {
    return 0;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ;
  _proto.isAppointmentGreaterThan = function isAppointmentGreaterThan(etalon, comparisonParameters) {};
  _proto.isAllDay = function isAllDay() {
    return false;
  };
  _proto._sortCondition = function _sortCondition() {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ;
  _proto._rowCondition = function _rowCondition(a, b) {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ;
  _proto._columnCondition = function _columnCondition(a, b) {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ;
  _proto._findIndexByKey = function _findIndexByKey(arr, iKey, jKey, iValue, jValue) {};
  _proto._markAppointmentAsVirtual = function _markAppointmentAsVirtual() {};
  _proto.getDropDownAppointmentWidth = function getDropDownAppointmentWidth() {};
  _proto.getCollectorLeftOffset = function getCollectorLeftOffset() {};
  _proto.getCollectorTopOffset = function getCollectorTopOffset() {}
  // From subscribe
  ;
  _proto.replaceWrongAppointmentEndDate = function replaceWrongAppointmentEndDate(rawAppointment, startDate, endDate) {
    const adapter = (0, _m_appointment_adapter.createAppointmentAdapter)(rawAppointment, this.dataAccessors, this.timeZoneCalculator);
    (0, _m_utils2.replaceWrongEndDate)(adapter, startDate, endDate, this.cellDuration, this.dataAccessors);
  }
  // TODO: get rid of an extra 'needClearSettings' argument
  ;
  _proto.calculateRows = function calculateRows(appointments, agendaDuration, currentDate, needClearSettings) {
    this._rows = [];
    currentDate = _date.default.trimTime(new Date(currentDate));
    const groupedAppointments = this.groupAppointmentByResources(appointments);
    // @ts-expect-error
    (0, _iterator.each)(groupedAppointments, (_, currentAppointments) => {
      const groupResult = [];
      const appts = {
        indexes: [],
        parts: []
      };
      if (!currentAppointments.length) {
        this._rows.push([]);
        return true;
      }
      (0, _iterator.each)(currentAppointments, (index, appointment) => {
        const startDate = _m_expression_utils.ExpressionUtils.getField(this.dataAccessors, 'startDate', appointment);
        const endDate = _m_expression_utils.ExpressionUtils.getField(this.dataAccessors, 'endDate', appointment);
        this.replaceWrongAppointmentEndDate(appointment, startDate, endDate);
        needClearSettings && delete appointment.settings;
        const result = this.instance.getAppointmentsInstance()._processRecurrenceAppointment(appointment, index, false);
        appts.parts = appts.parts.concat(result.parts);
        appts.indexes = appts.indexes.concat(result.indexes);
      });
      this.instance.getAppointmentsInstance()._reduceRecurrenceAppointments(appts.indexes, currentAppointments);
      currentAppointments.push(...appts.parts);
      const appointmentCount = currentAppointments.length;
      for (let i = 0; i < agendaDuration; i++) {
        const day = new Date(currentDate);
        day.setMilliseconds(day.getMilliseconds() + 24 * 3600000 * i);
        if (groupResult[i] === undefined) {
          groupResult[i] = 0;
        }
        for (let j = 0; j < appointmentCount; j++) {
          const appointmentData = currentAppointments[j].settings || currentAppointments[j];
          const adapter = (0, _m_appointment_adapter.createAppointmentAdapter)(currentAppointments[j], this.dataAccessors, this.timeZoneCalculator);
          const appointmentIsLong = (0, _m_utils2.getAppointmentTakesSeveralDays)(adapter);
          const appointmentIsRecurrence = _m_expression_utils.ExpressionUtils.getField(this.dataAccessors, 'recurrenceRule', currentAppointments[j]);
          if (this.instance.fire('dayHasAppointment', day, appointmentData, true) || !appointmentIsRecurrence && appointmentIsLong && this.instance.fire('dayHasAppointment', day, currentAppointments[j], true)) {
            groupResult[i] += 1;
          }
        }
      }
      this._rows.push(groupResult);
    });
    return this._rows;
  };
  _proto._iterateRow = function _iterateRow(row, obj, index) {
    for (let i = 0; i < row.length; i++) {
      obj.counter += row[i];
      if (obj.counter >= index) {
        obj.indexInRow = i;
        break;
      }
    }
  };
  _proto.getDateByIndex = function getDateByIndex(index, rows, startViewDate) {
    const obj = {
      counter: 0,
      indexInRow: 0
    };
    index++;
    for (let i = 0; i < rows.length; i++) {
      this._iterateRow(rows[i], obj, index);
      if (obj.indexInRow) break;
    }
    return new Date(new Date(startViewDate).setDate(startViewDate.getDate() + obj.indexInRow));
  };
  _proto.getAppointmentDataCalculator = function getAppointmentDataCalculator() {
    return ($appointment, originalStartDate) => {
      const apptIndex = $appointment.index();
      const startViewDate = this.instance.getStartViewDate();
      const calculatedStartDate = this.getDateByIndex(apptIndex, this._rows, startViewDate);
      const wrappedOriginalStartDate = new Date(originalStartDate);
      return {
        startDate: new Date(calculatedStartDate.setHours(wrappedOriginalStartDate.getHours(), wrappedOriginalStartDate.getMinutes(), wrappedOriginalStartDate.getSeconds(), wrappedOriginalStartDate.getMilliseconds()))
      };
    };
  };
  _createClass(AgendaRenderingStrategy, [{
    key: "instance",
    get: function () {
      return this.options.instance;
    }
  }, {
    key: "agendaDuration",
    get: function () {
      return this.options.agendaDuration;
    }
  }]);
  return AgendaRenderingStrategy;
}(_m_strategy_base.default);
var _default = exports.default = AgendaRenderingStrategy;
