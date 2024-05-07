/**
* DevExtreme (viz/sparklines/base_sparkline.d.ts)
* Version: 24.1.1
* Build date: Tue May 07 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import {
    UserDefinedElement,
    DxElement,
} from '../../core/element';

import {
    template,
} from '../../core/templates/template';

import {
    EventInfo,
} from '../../events/index';

import BaseWidget, {
    BaseWidgetExport,
    BaseWidgetLoadingIndicator,
    BaseWidgetOptions,
    BaseWidgetTitle,
    BaseWidgetTooltip,
} from '../core/base_widget';

/**
 * @namespace DevExpress.viz
 * @docid
 * @hidden
 */
export interface BaseSparklineOptions<TComponent> extends BaseWidgetOptions<TComponent> {
    /**
     * @docid
     * @type object
     * @hidden
     */
    export?: BaseWidgetExport;
    /**
     * @docid
     * @type object
     * @hidden
     */
    loadingIndicator?: BaseWidgetLoadingIndicator;
    /**
     * @docid
     * @default null
     * @notUsedInTheme
     * @action
     * @public
     */
    onTooltipHidden?: ((e: EventInfo<TComponent>) => void);
    /**
     * @docid
     * @default null
     * @notUsedInTheme
     * @action
     * @public
     */
    onTooltipShown?: ((e: EventInfo<TComponent>) => void);
    /**
     * @docid
     * @hidden
     */
    redrawOnResize?: boolean;
    /**
     * @docid
     * @type object
     * @hidden
     */
    title?: BaseWidgetTitle | string;
    /**
     * @docid
     * @type object
     * @public
     */
    tooltip?: BaseSparklineTooltip;
}
/**
 * @hidden
 * @docid
 * @namespace DevExpress.viz
 */
export interface BaseSparklineTooltip extends BaseWidgetTooltip {
    /**
     * @docid BaseSparklineOptions.tooltip.contentTemplate
     * @type_function_param1 pointsInfo:object
     * @type_function_return string|Element|jQuery
     * @default undefined
     * @public
     */
    contentTemplate?: template | ((pointsInfo: any, element: DxElement) => string | UserDefinedElement);
    /**
     * @docid BaseSparklineOptions.tooltip.customizeTooltip
     * @type_function_param1 pointsInfo:object
     * @type_function_return object
     * @default undefined
     * @notUsedInTheme
     * @public
     */
    customizeTooltip?: ((pointsInfo: any) => any);
    /**
     * @docid BaseSparklineOptions.tooltip.enabled
     * @default true
     * @public
     */
    enabled?: boolean;
    /**
     * @docid BaseSparklineOptions.tooltip.interactive
     * @default false
     * @public
     */
    interactive?: boolean;
}
/**
 * @docid
 * @hidden
 * @inherits BaseWidget
 * @namespace DevExpress.viz
 * @options BaseSparklineOptions
 */
export default class BaseSparkline<TProperties> extends BaseWidget<TProperties> {
    /**
     * @docid
     * @publicName hideLoadingIndicator()
     * @hidden
     */
    hideLoadingIndicator(): void;
    /**
     * @docid
     * @publicName showLoadingIndicator()
     * @hidden
     */
    showLoadingIndicator(): void;
}
