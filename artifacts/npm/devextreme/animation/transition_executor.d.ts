/**
* DevExtreme (animation/transition_executor.d.ts)
* Version: 24.1.1
* Build date: Tue May 07 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import {
    UserDefinedElementsArray,
} from '../core/element';

import {
    DxPromise,
} from '../core/utils/deferred';

import {
    AnimationConfig,
} from './fx';

/**
 * @docid
 * @namespace DevExpress
 * @public
 */
export default class TransitionExecutor {
    /**
     * @docid
     * @publicName enter(elements, animation)
     * @param1 elements:jQuery
     * @public
     */
    enter(elements: UserDefinedElementsArray, animation: AnimationConfig | string): void;
    /**
     * @docid
     * @publicName leave(elements, animation)
     * @param1 elements:jQuery
     * @public
     */
    leave(elements: UserDefinedElementsArray, animation: AnimationConfig | string): void;
    /**
     * @docid
     * @publicName reset()
     * @public
     */
    reset(): void;
    /**
     * @docid
     * @publicName start()
     * @return Promise<void>
     * @public
     */
    start(): DxPromise<void>;
    /**
     * @docid
     * @publicName stop()
     * @public
     */
    stop(): void;
}