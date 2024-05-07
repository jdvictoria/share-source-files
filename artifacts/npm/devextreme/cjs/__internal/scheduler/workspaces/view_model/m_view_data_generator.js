/**
* DevExtreme (cjs/__internal/scheduler/workspaces/view_model/m_view_data_generator.js)
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
exports.ViewDataGenerator = void 0;
var _date = _interopRequireDefault(require("../../../../core/utils/date"));
var _date2 = require("../../../core/utils/date");
var _index = require("../../../scheduler/r1/utils/index");
var _m_constants = require("../../m_constants");
var _m_utils_time_zone = _interopRequireDefault(require("../../m_utils_time_zone"));
var _m_utils = require("../../resources/m_utils");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const toMs = _date.default.dateToMilliseconds;
let ViewDataGenerator = exports.ViewDataGenerator = /*#__PURE__*/function () {
  function ViewDataGenerator() {
    this.daysInInterval = 1;
    this.isWorkView = false;
    this.tableAllDay = false;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  var _proto = ViewDataGenerator.prototype;
  _proto.isSkippedDate = function isSkippedDate(date) {
    return false;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ;
  _proto._calculateStartViewDate = function _calculateStartViewDate(options) {};
  _proto.getStartViewDate = function getStartViewDate(options) {
    return this._calculateStartViewDate(options);
  };
  _proto.getCompleteViewDataMap = function getCompleteViewDataMap(options) {
    const {
      groups,
      isGroupedByDate,
      isHorizontalGrouping,
      isVerticalGrouping,
      intervalCount,
      currentDate,
      viewType,
      startDayHour,
      endDayHour,
      hoursInterval
    } = options;
    this._setVisibilityDates(options);
    this.setHiddenInterval(startDayHour, endDayHour, hoursInterval);
    const groupsList = (0, _m_utils.getAllGroups)(groups);
    const cellCountInGroupRow = this.getCellCount({
      intervalCount,
      currentDate,
      viewType,
      startDayHour,
      endDayHour,
      hoursInterval
    });
    const rowCountInGroup = this.getRowCount({
      intervalCount,
      currentDate,
      viewType,
      hoursInterval,
      startDayHour,
      endDayHour
    });
    let viewDataMap = [];
    const allDayPanelData = this._generateAllDayPanelData(options, rowCountInGroup, cellCountInGroupRow);
    const viewCellsData = this._generateViewCellsData(options, rowCountInGroup, cellCountInGroupRow);
    if (allDayPanelData) {
      viewDataMap.push(allDayPanelData);
    }
    viewDataMap.push(...viewCellsData);
    if (isHorizontalGrouping && !isGroupedByDate) {
      viewDataMap = this._transformViewDataMapForHorizontalGrouping(viewDataMap, groupsList);
    }
    if (isVerticalGrouping) {
      viewDataMap = this._transformViewDataMapForVerticalGrouping(viewDataMap, groupsList);
    }
    if (isGroupedByDate) {
      viewDataMap = this._transformViewDataMapForGroupingByDate(viewDataMap, groupsList);
    }
    return this._addKeysToCells(viewDataMap);
  };
  _proto._transformViewDataMapForHorizontalGrouping = function _transformViewDataMapForHorizontalGrouping(viewDataMap, groupsList) {
    const result = viewDataMap.map(row => row.slice());
    groupsList.slice(1).forEach((groups, index) => {
      const groupIndex = index + 1;
      viewDataMap.forEach((row, rowIndex) => {
        const nextGroupRow = row.map(cellData => _extends(_extends({}, cellData), {
          groups,
          groupIndex
        }));
        result[rowIndex].push(...nextGroupRow);
      });
    });
    return result;
  };
  _proto._transformViewDataMapForVerticalGrouping = function _transformViewDataMapForVerticalGrouping(viewDataMap, groupsList) {
    const result = viewDataMap.map(row => row.slice());
    groupsList.slice(1).forEach((groups, index) => {
      const groupIndex = index + 1;
      const nextGroupMap = viewDataMap.map(cellsRow => {
        const nextRow = cellsRow.map(cellData => _extends(_extends({}, cellData), {
          groupIndex,
          groups
        }));
        return nextRow;
      });
      result.push(...nextGroupMap);
    });
    return result;
  };
  _proto._transformViewDataMapForGroupingByDate = function _transformViewDataMapForGroupingByDate(viewDataMap, groupsList) {
    const correctedGroupList = groupsList.slice(1);
    const correctedGroupCount = correctedGroupList.length;
    const result = viewDataMap.map(cellsRow => {
      const groupedByDateCellsRow = cellsRow.reduce((currentRow, cell) => {
        const rowWithCurrentCell = [...currentRow, _extends(_extends({}, cell), {
          isFirstGroupCell: true,
          isLastGroupCell: correctedGroupCount === 0
        }), ...correctedGroupList.map((groups, index) => _extends(_extends({}, cell), {
          groups,
          groupIndex: index + 1,
          isFirstGroupCell: false,
          isLastGroupCell: index === correctedGroupCount - 1
        }))];
        return rowWithCurrentCell;
      }, []);
      return groupedByDateCellsRow;
    });
    return result;
  };
  _proto._addKeysToCells = function _addKeysToCells(viewDataMap) {
    const totalColumnCount = viewDataMap[0].length;
    const {
      currentViewDataMap: result
    } = viewDataMap.reduce((_ref, row, rowIndex) => {
      let {
        allDayPanelsCount,
        currentViewDataMap
      } = _ref;
      const isAllDay = row[0].allDay;
      const keyBase = (rowIndex - allDayPanelsCount) * totalColumnCount;
      const currentAllDayPanelsCount = isAllDay ? allDayPanelsCount + 1 : allDayPanelsCount;
      currentViewDataMap[rowIndex].forEach((cell, columnIndex) => {
        cell.key = keyBase + columnIndex;
      });
      return {
        allDayPanelsCount: currentAllDayPanelsCount,
        currentViewDataMap
      };
    }, {
      allDayPanelsCount: 0,
      currentViewDataMap: viewDataMap
    });
    return result;
  };
  _proto.generateViewDataMap = function generateViewDataMap(completeViewDataMap, options) {
    const {
      rowCount,
      startCellIndex,
      startRowIndex,
      cellCount,
      isVerticalGrouping,
      isAllDayPanelVisible
    } = options;
    const sliceCells = (row, rowIndex, startIndex, count) => {
      const sliceToIndex = count !== undefined ? startIndex + count : undefined;
      return row.slice(startIndex, sliceToIndex).map((cellData, columnIndex) => ({
        cellData,
        position: {
          rowIndex,
          columnIndex
        }
      }));
    };
    let correctedStartRowIndex = startRowIndex;
    let allDayPanelMap = [];
    if (this._isStandaloneAllDayPanel(isVerticalGrouping, isAllDayPanelVisible)) {
      correctedStartRowIndex++;
      allDayPanelMap = sliceCells(completeViewDataMap[0], 0, startCellIndex, cellCount);
    }
    const displayedRowCount = (0, _index.getDisplayedRowCount)(rowCount, completeViewDataMap);
    const dateTableMap = completeViewDataMap.slice(correctedStartRowIndex, correctedStartRowIndex + displayedRowCount).map((row, rowIndex) => sliceCells(row, rowIndex, startCellIndex, cellCount));
    return {
      allDayPanelMap,
      dateTableMap
    };
  };
  _proto._isStandaloneAllDayPanel = function _isStandaloneAllDayPanel(isVerticalGrouping, isAllDayPanelVisible) {
    return !isVerticalGrouping && isAllDayPanelVisible;
  };
  _proto.getViewDataFromMap = function getViewDataFromMap(completeViewDataMap, viewDataMap, options) {
    const {
      topVirtualRowHeight,
      bottomVirtualRowHeight,
      leftVirtualCellWidth,
      rightVirtualCellWidth,
      cellCount,
      rowCount,
      startRowIndex,
      startCellIndex,
      isProvideVirtualCellsWidth,
      isGroupedAllDayPanel,
      isVerticalGrouping,
      isAllDayPanelVisible
    } = options;
    const {
      allDayPanelMap,
      dateTableMap
    } = viewDataMap;
    const {
      groupedData
    } = dateTableMap.reduce((_ref2, cellsRow) => {
      let {
        previousGroupIndex,
        groupedData
      } = _ref2;
      const cellDataRow = cellsRow.map(_ref3 => {
        let {
          cellData
        } = _ref3;
        return cellData;
      });
      const firstCell = cellDataRow[0];
      const isAllDayRow = firstCell.allDay;
      const currentGroupIndex = firstCell.groupIndex;
      if (currentGroupIndex !== previousGroupIndex) {
        groupedData.push({
          dateTable: [],
          isGroupedAllDayPanel: (0, _index.getIsGroupedAllDayPanel)(!!isAllDayRow, isVerticalGrouping),
          groupIndex: currentGroupIndex,
          key: (0, _index.getKeyByGroup)(currentGroupIndex, isVerticalGrouping)
        });
      }
      if (isAllDayRow) {
        groupedData[groupedData.length - 1].allDayPanel = cellDataRow;
      } else {
        groupedData[groupedData.length - 1].dateTable.push({
          cells: cellDataRow,
          key: cellDataRow[0].key - startCellIndex
        });
      }
      return {
        groupedData,
        previousGroupIndex: currentGroupIndex
      };
    }, {
      previousGroupIndex: -1,
      groupedData: []
    });
    if (this._isStandaloneAllDayPanel(isVerticalGrouping, isAllDayPanelVisible)) {
      groupedData[0].allDayPanel = allDayPanelMap.map(_ref4 => {
        let {
          cellData
        } = _ref4;
        return cellData;
      });
    }
    const totalCellCount = (0, _index.getTotalCellCountByCompleteData)(completeViewDataMap);
    const totalRowCount = (0, _index.getTotalRowCountByCompleteData)(completeViewDataMap);
    const displayedCellCount = (0, _index.getDisplayedCellCount)(cellCount, completeViewDataMap);
    const displayedRowCount = (0, _index.getDisplayedRowCount)(rowCount, completeViewDataMap);
    return {
      groupedData,
      topVirtualRowHeight,
      bottomVirtualRowHeight,
      leftVirtualCellWidth: isProvideVirtualCellsWidth ? leftVirtualCellWidth : undefined,
      rightVirtualCellWidth: isProvideVirtualCellsWidth ? rightVirtualCellWidth : undefined,
      isGroupedAllDayPanel,
      leftVirtualCellCount: startCellIndex,
      rightVirtualCellCount: cellCount === undefined ? 0 : totalCellCount - startCellIndex - displayedCellCount,
      topVirtualRowCount: startRowIndex,
      bottomVirtualRowCount: totalRowCount - startRowIndex - displayedRowCount
    };
  };
  _proto._generateViewCellsData = function _generateViewCellsData(options, rowCount, cellCountInGroupRow) {
    const viewCellsData = [];
    for (let rowIndex = 0; rowIndex < rowCount; rowIndex += 1) {
      viewCellsData.push(this._generateCellsRow(options, false, rowIndex, rowCount, cellCountInGroupRow));
    }
    return viewCellsData;
  };
  _proto._generateAllDayPanelData = function _generateAllDayPanelData(options, rowCount, columnCount) {
    if (!options.isAllDayPanelVisible) {
      return null;
    }
    return this._generateCellsRow(options, true, 0, rowCount, columnCount);
  };
  _proto._generateCellsRow = function _generateCellsRow(options, allDay, rowIndex, rowCount, columnCount) {
    const cellsRow = [];
    for (let columnIndex = 0; columnIndex < columnCount; ++columnIndex) {
      const cellDataValue = this.getCellData(rowIndex, columnIndex, options, allDay);
      cellDataValue.index = rowIndex * columnCount + columnIndex;
      cellDataValue.isFirstGroupCell = this._isFirstGroupCell(rowIndex, columnIndex, options, rowCount, columnCount);
      cellDataValue.isLastGroupCell = this._isLastGroupCell(rowIndex, columnIndex, options, rowCount, columnCount);
      cellsRow.push(cellDataValue);
    }
    return cellsRow;
  };
  _proto.getCellData = function getCellData(rowIndex, columnIndex, options, allDay) {
    return allDay ? this.prepareAllDayCellData(options, rowIndex, columnIndex) : this.prepareCellData(options, rowIndex, columnIndex);
  };
  _proto.prepareCellData = function prepareCellData(options, rowIndex, columnIndex) {
    const {
      groups,
      startDayHour,
      endDayHour,
      hoursInterval
    } = options;
    const groupsList = (0, _m_utils.getAllGroups)(groups);
    const startDate = this.getDateByCellIndices(options, rowIndex, columnIndex, this.getCellCountInDay(startDayHour, endDayHour, hoursInterval));
    const endDate = this.getCellEndDate(startDate, options);
    const data = {
      startDate,
      endDate,
      allDay: this.tableAllDay,
      groupIndex: 0
    };
    if (groupsList.length > 0) {
      // eslint-disable-next-line prefer-destructuring
      data.groups = groupsList[0];
    }
    return data;
  };
  _proto.prepareAllDayCellData = function prepareAllDayCellData(options, rowIndex, columnIndex) {
    const data = this.prepareCellData(_extends(_extends({}, options), {
      // NOTE: For all-day cells we should shift cell's dates
      // after trimming these dates time.
      viewOffset: 0
    }), rowIndex, columnIndex);
    const {
      viewOffset
    } = options;
    const startDate = _date.default.trimTime(data.startDate);
    const shiftedStartDate = _date2.dateUtilsTs.addOffsets(startDate, [viewOffset]);
    return _extends(_extends({}, data), {
      startDate: shiftedStartDate,
      endDate: shiftedStartDate,
      allDay: true
    });
  };
  _proto.getDateByCellIndices = function getDateByCellIndices(options, rowIndex, columnIndex, cellCountInDay) {
    let {
      startViewDate
    } = options;
    const {
      startDayHour,
      interval,
      firstDayOfWeek,
      intervalCount,
      viewOffset
    } = options;
    const isStartViewDateDuringDST = startViewDate.getHours() !== Math.floor(startDayHour);
    if (isStartViewDateDuringDST) {
      const dateWithCorrectHours = (0, _index.getStartViewDateWithoutDST)(startViewDate, startDayHour);
      startViewDate = new Date(dateWithCorrectHours.getTime() - toMs('day'));
    }
    const columnCountBase = this.getCellCount(options);
    const rowCountBase = this.getRowCount(options);
    const cellIndex = this._calculateCellIndex(rowIndex, columnIndex, rowCountBase, columnCountBase);
    const millisecondsOffset = this.getMillisecondsOffset(cellIndex, interval, cellCountInDay);
    const offsetByCount = this.isWorkView ? this.getTimeOffsetByColumnIndex(columnIndex, this.getFirstDayOfWeek(firstDayOfWeek), columnCountBase, intervalCount) : 0;
    const startViewDateTime = startViewDate.getTime();
    const currentDate = new Date(startViewDateTime + millisecondsOffset + offsetByCount + viewOffset);
    const timeZoneDifference = isStartViewDateDuringDST ? 0 : _date.default.getTimezonesDifference(startViewDate, currentDate);
    currentDate.setTime(currentDate.getTime() + timeZoneDifference);
    return currentDate;
  };
  _proto.getMillisecondsOffset = function getMillisecondsOffset(cellIndex, interval, cellCountInDay) {
    const dayIndex = Math.floor(cellIndex / cellCountInDay);
    const realHiddenInterval = dayIndex * this.hiddenInterval;
    return interval * cellIndex + realHiddenInterval;
  };
  _proto.getTimeOffsetByColumnIndex = function getTimeOffsetByColumnIndex(columnIndex, firstDayOfWeek, columnCount, intervalCount) {
    const firstDayOfWeekDiff = Math.max(0, firstDayOfWeek - 1);
    const columnsInWeek = columnCount / intervalCount;
    const weekendCount = Math.floor((columnIndex + firstDayOfWeekDiff) / columnsInWeek);
    return weekendCount * 2 * toMs('day');
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ;
  _proto.calculateEndDate = function calculateEndDate(startDate, interval, endDayHour) {
    return this.getCellEndDate(startDate, {
      interval
    });
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ;
  _proto._calculateCellIndex = function _calculateCellIndex(rowIndex, columnIndex, rowCount, columnCountBase) {
    return (0, _index.calculateCellIndex)(rowIndex, columnIndex, rowCount);
  };
  _proto.generateGroupedDataMap = function generateGroupedDataMap(viewDataMap) {
    const {
      allDayPanelMap,
      dateTableMap
    } = viewDataMap;
    const {
      previousGroupedDataMap: dateTableGroupedMap
    } = dateTableMap.reduce((previousOptions, cellsRow) => {
      const {
        previousGroupedDataMap,
        previousRowIndex,
        previousGroupIndex
      } = previousOptions;
      const {
        groupIndex: currentGroupIndex
      } = cellsRow[0].cellData;
      const currentRowIndex = currentGroupIndex === previousGroupIndex ? previousRowIndex + 1 : 0;
      cellsRow.forEach(cell => {
        const {
          groupIndex
        } = cell.cellData;
        if (!previousGroupedDataMap[groupIndex]) {
          previousGroupedDataMap[groupIndex] = [];
        }
        if (!previousGroupedDataMap[groupIndex][currentRowIndex]) {
          previousGroupedDataMap[groupIndex][currentRowIndex] = [];
        }
        previousGroupedDataMap[groupIndex][currentRowIndex].push(cell);
      });
      return {
        previousGroupedDataMap,
        previousRowIndex: currentRowIndex,
        previousGroupIndex: currentGroupIndex
      };
    }, {
      previousGroupedDataMap: [],
      previousRowIndex: -1,
      previousGroupIndex: -1
    });
    const allDayPanelGroupedMap = [];
    allDayPanelMap === null || allDayPanelMap === void 0 ? void 0 : allDayPanelMap.forEach(cell => {
      const {
        groupIndex
      } = cell.cellData;
      if (!allDayPanelGroupedMap[groupIndex]) {
        allDayPanelGroupedMap[groupIndex] = [];
      }
      allDayPanelGroupedMap[groupIndex].push(cell);
    });
    return {
      allDayPanelGroupedMap,
      dateTableGroupedMap
    };
  };
  _proto._isFirstGroupCell = function _isFirstGroupCell(rowIndex, columnIndex, options, rowCount, columnCount) {
    const {
      groupOrientation,
      groups,
      isGroupedByDate
    } = options;
    const groupCount = (0, _index.getGroupCount)(groups);
    if (isGroupedByDate) {
      return columnIndex % groupCount === 0;
    }
    if (groupOrientation === _m_constants.HORIZONTAL_GROUP_ORIENTATION) {
      return columnIndex % columnCount === 0;
    }
    return rowIndex % rowCount === 0;
  };
  _proto._isLastGroupCell = function _isLastGroupCell(rowIndex, columnIndex, options, rowCount, columnCount) {
    const {
      groupOrientation,
      groups,
      isGroupedByDate
    } = options;
    const groupCount = (0, _index.getGroupCount)(groups);
    if (isGroupedByDate) {
      return (columnIndex + 1) % groupCount === 0;
    }
    if (groupOrientation === _m_constants.HORIZONTAL_GROUP_ORIENTATION) {
      return (columnIndex + 1) % columnCount === 0;
    }
    return (rowIndex + 1) % rowCount === 0;
  };
  _proto.markSelectedAndFocusedCells = function markSelectedAndFocusedCells(viewDataMap, renderOptions) {
    const {
      selectedCells,
      focusedCell
    } = renderOptions;
    if (!selectedCells && !focusedCell) {
      return viewDataMap;
    }
    const {
      allDayPanelMap,
      dateTableMap
    } = viewDataMap;
    const nextDateTableMap = dateTableMap.map(row => this._markSelectedAndFocusedCellsInRow(row, selectedCells, focusedCell));
    const nextAllDayMap = this._markSelectedAndFocusedCellsInRow(allDayPanelMap, selectedCells, focusedCell);
    return {
      allDayPanelMap: nextAllDayMap,
      dateTableMap: nextDateTableMap
    };
  };
  _proto._markSelectedAndFocusedCellsInRow = function _markSelectedAndFocusedCellsInRow(dataRow, selectedCells, focusedCell) {
    return dataRow.map(cell => {
      const {
        index,
        groupIndex,
        allDay,
        startDate
      } = cell.cellData;
      const indexInSelectedCells = selectedCells.findIndex(_ref5 => {
        let {
          index: selectedCellIndex,
          groupIndex: selectedCellGroupIndex,
          allDay: selectedCellAllDay,
          startDate: selectedCellStartDate
        } = _ref5;
        return groupIndex === selectedCellGroupIndex && (index === selectedCellIndex || selectedCellIndex === undefined && startDate.getTime() === selectedCellStartDate.getTime()) && !!allDay === !!selectedCellAllDay;
      });
      const isFocused = !!focusedCell && index === focusedCell.cellData.index && groupIndex === focusedCell.cellData.groupIndex && allDay === focusedCell.cellData.allDay;
      if (!isFocused && indexInSelectedCells === -1) {
        return cell;
      }
      return _extends(_extends({}, cell), {
        cellData: _extends(_extends({}, cell.cellData), {
          isSelected: indexInSelectedCells > -1,
          isFocused
        })
      });
    });
  };
  _proto.getInterval = function getInterval(hoursInterval) {
    return hoursInterval * toMs('hour');
  };
  _proto._getIntervalDuration = function _getIntervalDuration(intervalCount) {
    return toMs('day') * intervalCount;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ;
  _proto._setVisibilityDates = function _setVisibilityDates(options) {};
  _proto.getCellCountInDay = function getCellCountInDay(startDayHour, endDayHour, hoursInterval) {
    const result = (0, _index.calculateDayDuration)(startDayHour, endDayHour) / hoursInterval;
    return Math.ceil(result);
  };
  _proto.getCellCount = function getCellCount(options) {
    const {
      intervalCount,
      viewType,
      startDayHour,
      endDayHour,
      hoursInterval
    } = options;
    const cellCountInDay = this.getCellCountInDay(startDayHour, endDayHour, hoursInterval);
    const columnCountInDay = (0, _index.isHorizontalView)(viewType) ? cellCountInDay : 1;
    return this.daysInInterval * intervalCount * columnCountInDay;
  };
  _proto.getRowCount = function getRowCount(options) {
    const {
      viewType,
      startDayHour,
      endDayHour,
      hoursInterval
    } = options;
    const cellCountInDay = this.getCellCountInDay(startDayHour, endDayHour, hoursInterval);
    const rowCountInDay = !(0, _index.isHorizontalView)(viewType) ? cellCountInDay : 1;
    return rowCountInDay;
  };
  _proto.setHiddenInterval = function setHiddenInterval(startDayHour, endDayHour, hoursInterval) {
    this.hiddenInterval = toMs('day') - this.getVisibleDayDuration(startDayHour, endDayHour, hoursInterval);
  };
  _proto.getVisibleDayDuration = function getVisibleDayDuration(startDayHour, endDayHour, hoursInterval) {
    const cellCountInDay = this.getCellCountInDay(startDayHour, endDayHour, hoursInterval);
    return hoursInterval * cellCountInDay * toMs('hour');
  };
  _proto.getFirstDayOfWeek = function getFirstDayOfWeek(firstDayOfWeekOption) {
    return firstDayOfWeekOption;
  };
  _proto.getCellEndDate = function getCellEndDate(cellStartDate, options) {
    const durationMs = Math.round(options.interval);
    return _m_utils_time_zone.default.addOffsetsWithoutDST(cellStartDate, durationMs);
  };
  return ViewDataGenerator;
}();
