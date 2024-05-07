/**
* DevExtreme (esm/renovation/ui/scroll_view/utils/subscribe_to_resize.js)
* Version: 24.1.1
* Build date: Tue May 07 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import resizeObserverSingleton from '../../../../core/resize_observer';
import { hasWindow } from '../../../../core/utils/window';
import { requestAnimationFrame, cancelAnimationFrame } from '../../../../animation/frame';
export function subscribeToResize(element, handler) {
  if (hasWindow() && element) {
    var resizeAnimationFrameID = -1;
    resizeObserverSingleton.observe(element, _ref => {
      var {
        target
      } = _ref;
      resizeAnimationFrameID = requestAnimationFrame(() => {
        handler(target);
      });
    });
    return () => {
      cancelAnimationFrame(resizeAnimationFrameID);
      resizeObserverSingleton.unobserve(element);
    };
  }
  return undefined;
}
