import { formatDate, formatNumber } from '../../../localization';
var startPlaceHolderChar = '{';
var endPlaceHolderChar = '}';
var placeholderFormatDelimiter = ':';
function formatValue(value, format) {
  if (format) {
    if (value instanceof Date) {
      return formatDate(value, format);
    }
    if (typeof value === 'number') {
      return formatNumber(value, format);
    }
  }
  return value;
}
function getValueByPlaceHolder(placeHolder, pointInfo) {
  var customFormat = '';
  var customFormatIndex = placeHolder.indexOf(placeholderFormatDelimiter);
  if (customFormatIndex > 0) {
    customFormat = placeHolder.substr(customFormatIndex + 1);
    placeHolder = placeHolder.substr(0, customFormatIndex);
  }
  return formatValue(pointInfo[placeHolder], customFormat);
}
export function processDisplayFormat(displayFormat, pointInfo) {
  var actualText = displayFormat;
  var continueProcess = true;
  while (continueProcess) {
    var startBracketIndex = actualText.indexOf(startPlaceHolderChar);
    var endBracketIndex = actualText.indexOf(endPlaceHolderChar);
    if (startBracketIndex >= 0 && endBracketIndex > 0) {
      var placeHolder = actualText.substring(startBracketIndex + 1, endBracketIndex);
      var value = getValueByPlaceHolder(placeHolder, pointInfo);
      actualText = actualText.substr(0, startBracketIndex) + value + actualText.substr(endBracketIndex + 1);
    } else {
      continueProcess = false;
    }
  }
  return actualText;
}