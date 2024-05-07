/**
* DevExtreme (ui/pivot_grid/xmla_store.d.ts)
* Version: 24.1.1
* Build date: Tue May 07 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
/**
 * @namespace DevExpress.data
 * @docid
 * @type object
 */
export interface XmlaStoreOptions {
    /**
     * @docid
     * @type_function_param1_field headers:object
     * @type_function_param1_field xhrFields:object
     * @public
     */
    beforeSend?: ((options: { url?: string; method?: string; headers?: any; xhrFields?: any; data?: string; dataType?: string }) => void);
    /**
     * @docid
     * @public
     */
    catalog?: string;
    /**
     * @docid
     * @public
     */
    cube?: string;
    /**
     * @docid
     * @public
     */
    url?: string;
}
/**
 * @docid
 * @namespace DevExpress.data
 * @public
 * @options XmlaStoreOptions
 */
 // eslint-disable-next-line @typescript-eslint/no-extraneous-class
export default class XmlaStore {
    constructor(options?: XmlaStoreOptions);
}
