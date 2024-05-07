"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _math = require("../../../core/utils/math");
var _config = _interopRequireDefault(require("../../../core/config"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* eslint-disable radix */

const getConvertedUntils = value => value.split('|').map(until => {
  if (until === 'Infinity') {
    return null;
  }
  return parseInt(until, 36) * 1000;
});
const parseTimezone = timeZoneConfig => {
  const {
    offsets
  } = timeZoneConfig;
  const {
    offsetIndices
  } = timeZoneConfig;
  const {
    untils
  } = timeZoneConfig;
  const offsetList = offsets.split('|').map(value => parseInt(value));
  const offsetIndexList = offsetIndices.split('').map(value => parseInt(value));
  const dateList = getConvertedUntils(untils)
  // eslint-disable-next-line
  .map((accumulator => value => accumulator += value)(0));
  return {
    offsetList,
    offsetIndexList,
    dateList
  };
};
let TimeZoneCache = /*#__PURE__*/function () {
  function TimeZoneCache() {
    this.map = new Map();
  }
  var _proto = TimeZoneCache.prototype;
  _proto.tryGet = function tryGet(id) {
    if (!this.map.get(id)) {
      const config = timeZoneDataUtils.getTimezoneById(id);
      if (!config) {
        return false;
      }
      const timeZoneInfo = parseTimezone(config);
      this.map.set(id, timeZoneInfo);
    }
    return this.map.get(id);
  };
  return TimeZoneCache;
}();
const tzCache = new TimeZoneCache();
const timeZoneDataUtils = {
  _tzCache: tzCache,
  getTimeZonesOld() {
    var _a;
    return (_a = (0, _config.default)().timezones) !== null && _a !== void 0 ? _a : [];
  },
  formatOffset(offset) {
    const hours = Math.floor(offset);
    const minutesInDecimal = offset - hours;
    const signString = (0, _math.sign)(offset) >= 0 ? '+' : '-';
    const hoursString = "0".concat(Math.abs(hours)).slice(-2);
    const minutesString = minutesInDecimal > 0 ? ":".concat(minutesInDecimal * 60) : ':00';
    return signString + hoursString + minutesString;
  },
  formatId(id) {
    return id.split('/').join(' - ').split('_').join(' ');
  },
  getTimezoneById(id) {
    if (!id) {
      return undefined;
    }
    const tzList = this.getTimeZonesOld();
    for (let i = 0; i < tzList.length; i++) {
      const currentId = tzList[i].id;
      if (currentId === id) {
        return tzList[i];
      }
    }
    return undefined;
  },
  getTimeZoneOffsetById(id, timestamp) {
    const timeZoneInfo = tzCache.tryGet(id);
    return timeZoneInfo ? this.getUtcOffset(timeZoneInfo, timestamp) : undefined;
  },
  getTimeZoneDeclarationTuple(id, year) {
    const timeZoneInfo = tzCache.tryGet(id);
    return timeZoneInfo ? this.getTimeZoneDeclarationTupleCore(timeZoneInfo, year) : [];
  },
  getTimeZoneDeclarationTupleCore(timeZoneInfo, year) {
    const {
      offsetList
    } = timeZoneInfo;
    const {
      offsetIndexList
    } = timeZoneInfo;
    const {
      dateList
    } = timeZoneInfo;
    const tupleResult = [];
    for (let i = 0; i < dateList.length; i++) {
      const currentDate = dateList[i];
      const currentYear = new Date(currentDate).getFullYear();
      if (currentYear === year) {
        const offset = offsetList[offsetIndexList[i + 1]];
        tupleResult.push({
          date: currentDate,
          offset: -offset / 60
        });
      }
      if (currentYear > year) {
        break;
      }
    }
    return tupleResult;
  },
  getUtcOffset(timeZoneInfo, dateTimeStamp) {
    const {
      offsetList
    } = timeZoneInfo;
    const {
      offsetIndexList
    } = timeZoneInfo;
    const {
      dateList
    } = timeZoneInfo;
    const infinityUntilCorrection = 1;
    const lastIntervalStartIndex = dateList.length - 1 - infinityUntilCorrection;
    let index = lastIntervalStartIndex;
    while (index >= 0 && dateTimeStamp < dateList[index]) {
      index--;
    }
    const offset = offsetList[offsetIndexList[index + 1]];
    return -offset / 60 || offset;
  }
};
var _default = exports.default = timeZoneDataUtils;