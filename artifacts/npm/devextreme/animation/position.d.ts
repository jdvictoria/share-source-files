/**
* DevExtreme (animation/position.d.ts)
* Version: 24.1.1
* Build date: Tue May 07 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import {
    UserDefinedElement,
} from '../core/element';

import {
    HorizontalAlignment,
    PositionAlignment,
    VerticalAlignment,
} from '../common';

/** @public */
export type CollisionResolution = 'fit' | 'flip' | 'flipfit' | 'none';
/** @public */
export type CollisionResolutionCombination = 'fit' | 'fit flip' | 'fit flipfit' | 'fit none' | 'flip' | 'flip fit' | 'flip none' | 'flipfit' | 'flipfit fit' | 'flipfit none' | 'none' | 'none fit' | 'none flip' | 'none flipfit';

/**
 * @docid
 * @namespace DevExpress
 * @type object
 * @public
 */
export interface PositionConfig {
    /**
     * @docid
     * @public
     */
    at?: PositionAlignment | {
      /**
       * @docid
       */
      x?: HorizontalAlignment;
      /**
       * @docid
       */
      y?: VerticalAlignment;
    };
    /**
     * @docid
     * @public
     */
    boundary?: string | UserDefinedElement | Window;
    /**
     * @docid
     * @public
     */
    boundaryOffset?: string | {
      /**
       * @docid
       * @default 0
       */
      x?: number;
      /**
       * @docid
       * @default 0
       */
      y?: number;
    };
    /**
     * @docid
     * @public
     */
    collision?: CollisionResolutionCombination | {
      /**
       * @docid
       * @default 'none'
       */
      x?: CollisionResolution;
      /**
       * @docid
       * @default 'none'
       */
      y?: CollisionResolution;
    };
    /**
     * @docid
     * @public
     */
    my?: PositionAlignment | {
      /**
       * @docid
       */
      x?: HorizontalAlignment;
      /**
       * @docid
       */
      y?: VerticalAlignment;
    };
    /**
     * @docid
     * @public
     */
    of?: string | UserDefinedElement | Window;
    /**
     * @docid
     * @public
     */
    offset?: string | {
      /**
       * @docid
       * @default 0
       */
      x?: number;
      /**
       * @docid
       * @default 0
       */
      y?: number;
    };
}

/**
 * @public
 * @deprecated Use the PositionConfig type instead
 */
export interface positionConfig extends PositionConfig { }
