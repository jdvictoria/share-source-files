/**
* DevExtreme (esm/localization.js)
* Version: 24.1.1
* Build date: Tue May 07 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import core from './localization/core';
import message from './localization/message';
import number from './localization/number';
import date from './localization/date';
import './localization/currency';

/**
 * @name localization
 */

export var locale = core.locale.bind(core);
export var loadMessages = message.load.bind(message);
export var formatMessage = message.format.bind(message);
export var formatNumber = number.format.bind(number);
export var parseNumber = number.parse.bind(number);
export var formatDate = date.format.bind(date);
export var parseDate = date.parse.bind(date);
export { message, number, date };
export function disableIntl() {
  if (number.engine() === 'intl') {
    number.resetInjection();
  }
  if (date.engine() === 'intl') {
    date.resetInjection();
  }
}
