/**
* DevExtreme (esm/renovation/ui/scroll_view/common/scrollable_props.js)
* Version: 24.1.1
* Build date: Tue May 07 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import _extends from "@babel/runtime/helpers/esm/extends";
import { ScrollableSimulatedProps } from './simulated_strategy_props';
import { getDefaultUseNative, getDefaultNativeRefreshStrategy, getDefaultUseSimulatedScrollbar } from '../utils/get_default_option_value';
export var ScrollableProps = Object.create(Object.prototype, _extends(Object.getOwnPropertyDescriptors(ScrollableSimulatedProps), Object.getOwnPropertyDescriptors({
  get useNative() {
    return getDefaultUseNative();
  },
  get useSimulatedScrollbar() {
    return getDefaultUseSimulatedScrollbar();
  },
  get refreshStrategy() {
    return getDefaultNativeRefreshStrategy();
  }
})));
